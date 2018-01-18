package org.jboss.windup.web.addons.websupport.tsmodelgen;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.syncleus.ferma.annotations.InVertex;
import com.syncleus.ferma.annotations.Incidence;
import com.syncleus.ferma.annotations.OutVertex;
import org.apache.commons.collections4.BidiMap;
import org.apache.commons.collections4.bidimap.DualHashBidiMap;
import org.apache.tinkerpop.gremlin.structure.Direction;
import org.jboss.windup.graph.Adjacency;
import org.jboss.windup.graph.Property;
import org.jboss.windup.graph.SetInProperties;
import org.jboss.windup.graph.model.TypeValue;
import org.jboss.windup.graph.model.WindupFrame;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.addons.websupport.tsmodelgen.TypeScriptModelsGeneratorConfig.AdjacencyMode;

import java.lang.annotation.Annotation;
import org.jboss.windup.graph.model.WindupEdgeFrame;
import org.jboss.windup.util.exception.WindupException;
import org.jboss.windup.web.addons.websupport.tsmodelgen.ModelRelation.RelationKind;
import static org.jboss.windup.web.addons.websupport.tsmodelgen.ModelRelation.RelationKind.IN_V;
import static org.jboss.windup.web.addons.websupport.tsmodelgen.ModelRelation.RelationKind.OUT_V;
import static org.jboss.windup.web.addons.websupport.tsmodelgen.TsGenUtils.methodIdent;
import static org.jboss.windup.web.addons.websupport.tsmodelgen.ModelRelation.RelationKind.INCIDENCE;
import static org.jboss.windup.web.addons.websupport.tsmodelgen.ModelRelation.RelationKind.ADJACENCY;

/**
 * Creates the TypeScript models which could accommodate the Frames models instances. Also creates a mapping between discriminators (@TypeValue's) and
 * the TS model classes. In TypeScript it's not reliably possible to scan for all models.
 *
 * How this class works:
 *
 * 1) The list of models are given to generate()
 * 2) Collect the model information - createModelDescriptor()
 * 3) Writes the TypeScript classes - writeTypeScriptModelClass()
 *      * ModelProperty#toTypeScript(mode)
 *      * ModelRelation#toTypeScript(mode)
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public class TypeScriptModelsGenerator
{
    public static final Logger LOG = Logger.getLogger(TypeScriptModelsGenerator.class.getName());
    private static final String DISCRIMINATOR_MAPPING_DATA = "DiscriminatorMappingData";
    private static final String DISCRIMINATOR_MAPPING_DATA_PATH = "discriminator-mapping-data";

    private static final String DISCRIMINATOR_MAPPING = "DiscriminatorMapping";
    private static final String DISCRIMINATOR_MAPPING_PATH = "discriminator-mapping";

    private static final String TS_SUFFIX = ".ts";
    /**
     * Path the webapp/ dir which will be used for the imports in the generated models. I.e. <code>import {...} from '$importPathToWebapp';</code>
     * Needs to be the relative path from the final TS models dir to the graph package dir.
     */
    private static final String PATH_TO_GRAPH_PKG = "app/services/graph";
    private static final Pattern UPPERCASE_LETTER = Pattern.compile("(.)(\\p{javaUpperCase})");

    // private final Path modelFilesDir;
    private static final String BaseModelName = "BaseModel";
    private static final String BaseModelPath = "base.model";

    private final Set<Class<? extends WindupFrame<?>>> notModels =
        (Set<Class<? extends WindupFrame<?>>>) new HashSet(Arrays.asList(new Class[]{
            WindupFrame.class,
            WindupVertexFrame.class,
            WindupEdgeFrame.class
        }));

    private TypeScriptModelsGeneratorConfig config;

    public TypeScriptModelsGenerator(TypeScriptModelsGeneratorConfig config)
    {
        this.config = config;
    }

    /**
     * @param methodNameVsPropName
     * @param methodPropName
     * @param graphPropName
     * @param method
     * @param messageFormat
     *
     * @return false if there was pre-existing mapping of bean property beanPropertyName (getter/setter "base beanPropertyName") to a graph property
     *         beanPropertyName or an edge label, and the examined method beanPropertyName doesn't fit that. true otherwise (No pre-existing mapping
     *         or the names fit.)
     */
    private static boolean checkMethodNameVsPropNameConsistency(
                Map<String, String> methodNameVsPropName, final String methodPropName,
                final String graphPropName, Method method, String messageFormat)
    {
        final String existingPropName = methodNameVsPropName.get(methodPropName);
        if (existingPropName != null)
        {
            if (!graphPropName.equals(existingPropName))
            {
                LOG.warning(String.format(messageFormat,
                            graphPropName, method.toString(), existingPropName, methodPropName, method.getDeclaringClass().getName()));
                return false;
            }
        }

        methodNameVsPropName.put(methodPropName, graphPropName);
        return true;
    }

    /**
     * Generates the TypeScript files for models, copying the structure of WindupVertexModel's. The "entry point".
     */
    public void generate(Set<Class<? extends WindupFrame<?>>> modelTypes)
    {
        validateConfig();

        try
        {
            Files.createDirectories(this.config.getOutputPath());
            LOG.info("Creating TypeScript models in " + this.config.getOutputPath().toAbsolutePath());
        }
        catch (IOException ex)
        {
            LOG.severe("Could not create directory for TS models: " + ex.getMessage() + "\n\t" + this.config.getOutputPath());
        }

        Map<String, ModelDescriptor> classesMapping = new TreeMap<>(); // We want deterministic order.

        for (Class<? extends WindupFrame<?>> frameClass : modelTypes)
        {
            if (!(WindupFrame.class.isAssignableFrom(frameClass)))
            {
                LOG.warning("Does not extend " + WindupFrame.class.getSimpleName() + ", skipping: " + frameClass);
                continue;
            }
            if (notModels.contains(frameClass))
            {
                LOG.warning("Base model class - not a model, skipping: " + frameClass);
                continue;
            }

            @SuppressWarnings("unchecked")
            final Class<? extends WindupVertexFrame> frameClass2 = (Class<? extends WindupVertexFrame>) frameClass;
            ModelDescriptor modelDescriptor = createModelDescriptor(frameClass2);
            classesMapping.put(modelDescriptor.discriminator, modelDescriptor);
        }

        addClassesThatAreSkippedForSomeReason(classesMapping);

        for (ModelDescriptor modelDescriptor : classesMapping.values())
        {
            writeTypeScriptModelClass(modelDescriptor, this.config.getAdjacencyMode());
        }

        writeTypeScriptClassesMapping(classesMapping);
        writeTypeScriptBarrel(classesMapping);
    }

    private void validateConfig()
    {
        if (this.config.getImportPathToWebapp() == null)
        {
            LOG.warning("Import path to webapp is null! Setting to ''.");
            this.config.setImportPathToWebapp(Paths.get(""));
        }
    }

    private void addClassesThatAreSkippedForSomeReason(Map<String, ModelDescriptor> classesMapping)
    {
        List<String> artificiallyAddedModels = new ArrayList<>();
        // This is a hack in AmbiguousReferenceMode and WindupVertexListModel
        artificiallyAddedModels.add("WindupVertexFrame");
        artificiallyAddedModels.add("WindupEdgeFrame");
        // graphTypeManager.getRegisteredTypes() skips the following for some reason.
        artificiallyAddedModels.add("ResourceModel");
        for (String className : artificiallyAddedModels)
        {
            if (!classesMapping.containsKey("ResourceModel"))
            {
                ModelDescriptor md = new ModelDescriptor();
                md.discriminator = "ADummyDiscr_" + className;
                md.modelClassName = className;
                classesMapping.put(md.discriminator, md);
            }
        }
    }

    /**
     * Extracts the information from the given type, based on @Property and @Adjacent annotations.
     */
    private ModelDescriptor createModelDescriptor(Class<? extends WindupVertexFrame> frameClass)
    {
        ModelDescriptor modelDescriptor = new ModelDescriptor();
        LOG.info("\n    * Examining frame " + frameClass.getSimpleName());

        if (FileModel.class.getSimpleName().equals(frameClass.getSimpleName()))
            LOG.info("DEBUG STOP");

        // Get the type discriminator string
        TypeValue typeValueAnn = frameClass.getAnnotation(TypeValue.class);
        modelDescriptor.discriminator = typeValueAnn.value();

        modelDescriptor.modelClassName = frameClass.getSimpleName();

        if (frameClass.getInterfaces().length != 1)
            LOG.warning("Model " + frameClass.getSimpleName() + " extends more than 1 model. Current TS unmarshaller doesn't support that (yet).");
        modelDescriptor.extendedModels = Arrays.asList(frameClass.getInterfaces()).stream()
                    .filter((x) -> WindupVertexFrame.class.isAssignableFrom(x) && !WindupVertexFrame.class.equals(x))
                    .map(Class::getSimpleName).collect(Collectors.toList());

        // TODO: These could be part of the ModelDescriptor.
        BidiMap<String, String> methodNameVsPropName = new DualHashBidiMap<>();
        BidiMap<String, String> methodNameVsEdgeLabel = new DualHashBidiMap<>();

        for (Method method : frameClass.getDeclaredMethods())
        {
            try {
                // Get the properties - @Property
                prop:
                {
                    Property propAnn = method.getAnnotation(Property.class);
                    if (propAnn == null)
                        break prop;
                    LOG.fine("    * Examining @Property " + method.getName());

                    final Class propertyType = TsGenUtils.getPropertyTypeFromMethod(method);
                    if (propertyType == null)
                        break prop;

                    final ModelRelation methodInfo = ModelRelation.infoFromMethod(method);
                    final String graphPropName = propAnn.value();
                    final ModelProperty existing = modelDescriptor.getProperties().get(graphPropName);

                    checkMethodNameVsPropNameConsistency(methodNameVsPropName, methodInfo.beanPropertyName, graphPropName, method,
                        "Property name '%s' of method '%s' doesn't fit previously seen property name '%s' of other method for '%s'."
                        + "\nCheck the Frames model %s");

                    // Method base beanPropertyName already seen.
                    if (existing != null)
                        continue;

                    // This method beanPropertyName was not seen yet.

                    final PrimitiveType primitiveType = PrimitiveType.from(propertyType);
                    if (primitiveType == null)
                        throw new WindupException(String.format("Unrecognized primitive type: %s\n of %s %s",
                                propertyType.getName(), frameClass.getName(), method.getName()));
                    final ModelProperty prop = new ModelProperty(methodInfo.beanPropertyName, graphPropName, primitiveType);
                    modelDescriptor.getProperties().put(prop.graphPropertyName, prop);
                }

                // Get the relations - @Adjacent or @Incidence (an explicit relation to an edge model)
                adj:
                {
                    Adjacency adjAnn = method.getAnnotation(Adjacency.class);
                    Incidence incAnn = method.getAnnotation(Incidence.class);
                    InVertex inAnn = method.getAnnotation(InVertex.class);
                    OutVertex outAnn = method.getAnnotation(OutVertex.class);
                    {
                        int check = (adjAnn == null ? 0 : 1) + (incAnn == null ? 0 : 1) + (inAnn == null ? 0 : 1) + (outAnn == null ? 0 : 1);
                        if (check == 0)
                            break adj;
                        if (check > 1)
                            throw new WindupException("Method can only have one of @Adjacency, @Incidence, @InVertex, or @OutVertex.");
                    }

                    Annotation ann = (adjAnn != null ? adjAnn : (incAnn != null ? incAnn: (inAnn != null ? inAnn : (outAnn != null ? outAnn : null))));
                    Class<? extends Annotation> annType = ann.getClass(); //(adjAnn != null ? Adjacency.class : (incAnn != null ? Incidence.class : (inAnn != null ? InVertex.class : (outAnn != null ? OutVertex.class : null))));
                    RelationKind relKind = (adjAnn != null ? ADJACENCY : (incAnn != null ? INCIDENCE : (inAnn != null ? IN_V : (outAnn != null ? OUT_V : null))));

                    boolean isAdjacency = adjAnn != null;
                    LOG.fine("    * Examining @" + annType.getSimpleName() + " " + method.getName());

                    // Model class of the other end.
                    Class theOtherType = TsGenUtils.getPropertyTypeFromMethod(method);
                    if (theOtherType == null)
                        //break adj;
                        throw new WindupException("Could not determine the relation target type: " + methodIdent(method));

                    final ModelRelation methodInfo = ModelRelation.infoFromMethod(method);
                    final String label = relKind.label(ann); //(adjAnn != null ? adjAnn.label() : (incAnn != null ? incAnn.label() : null));
                    final Direction direction = relKind.direction(ann); //(adjAnn != null ? adjAnn.direction(): (incAnn != null ? incAnn.direction(): null));
                    final ModelRelation existing = modelDescriptor.getRelation(label, Direction.OUT.equals(direction));

                    checkMethodNameVsPropNameConsistency(methodNameVsEdgeLabel, methodInfo.beanPropertyName, label, method,
                                "Edge label '%s' of method '%s' doesn't fit previously seen edge label '%s' of other method for '%s'."
                                            + "\nCheck the Frames model %s");

                    // @Incidence - find the target type. Maybe this should rather be in createModelDescriptor().
                    if (relKind == RelationKind.INCIDENCE)
                    {
                        if(methodInfo.methodsPresent.contains(ModelMember.BeanMethodType.ADD))
                        {
                            if (method.getReturnType().equals(Void.TYPE))
                                throw new WindupException("Adder of @Incidence relation must return the edge frame model: " + methodIdent(method));
                            // Override this from infoFromMethod() as it's different for @Incidence methods.
                            //methodInfo.type = ModelType.from(method.getReturnType());
                            theOtherType = method.getReturnType();
                            methodInfo.targetModelType = ModelType.from(method.getParameterTypes()[0]);
                        }
                        else if(methodInfo.methodsPresent.contains(ModelMember.BeanMethodType.GET))
                            methodInfo.type = ModelType.from(theOtherType);
                        else
                            LOG.warning("Only adder and getter is supported for @Incidence: " + methodIdent(method));
                    }

                    // Method base beanPropertyName already seen. Override some traits and check consistency.
                    if (existing != null)
                    {
                        if (existing.isAdjacency && !isAdjacency)
                            throw new WindupException("Same label used for both @Adjacency and @Incidence: " + frameClass.getName() + ", " + label);
                        existing.isIterable |= methodInfo.isIterable;
                        existing.methodsPresent.addAll(methodInfo.getMethodsPresent());
                        // We want the plural, which is presumably on methods working with Iterable.
                        // Also, this filters out things like addFileToDirectory() next to getFilesInDirectory().
                        if (methodInfo.isIterable)
                            existing.beanPropertyName = methodInfo.beanPropertyName;

                        existing.targetModelType = (ModelType) setAndWarnIfDifferent("targetModelType", existing.targetModelType, methodInfo.targetModelType);
                        //existing.targetModelType = methodInfo.targetModelType;
                        continue;
                    }


                    final ModelRelation modelRelation = new ModelRelation(
                                methodInfo.beanPropertyName,
                                label,
                                direction.OUT.equals(direction),
                                ModelType.from(theOtherType),
                                methodInfo.isIterable, // Also add/remove? That prefix suggests it's a collection.
                                relKind
                    );
                    modelRelation.targetModelType = methodInfo.targetModelType;
                    modelRelation.methodsPresent.addAll(methodInfo.methodsPresent);
                    modelDescriptor.addRelation(modelRelation);
                }

                setInProperties:
                {
                    SetInProperties setInProperties = method.getAnnotation(SetInProperties.class);
                    if (setInProperties == null)
                        break setInProperties;

                    final Class propertyType = TsGenUtils.getPropertyTypeFromMethod(method);
                    if (propertyType == null)
                        break setInProperties;

                    String graphPropertyPrefix = setInProperties.propertyPrefix();
                    final ModelRelation methodInfo = ModelRelation.infoFromMethod(method);
                    final ModelSetInProperties existing = modelDescriptor.modelSetInPropertiesMap.get(graphPropertyPrefix);
                    if (existing != null)
                        continue;

                    LOG.info("    * Examining @SetInProperties " + method.getName());
                    final ModelSetInProperties modelSetInProperties = new ModelSetInProperties(
                            methodInfo.beanPropertyName,
                            graphPropertyPrefix,
                            PrimitiveType.from(propertyType)
                    );
                    modelDescriptor.modelSetInPropertiesMap.put(graphPropertyPrefix, modelSetInProperties);
                }
            }
            catch (Exception ex)
            {
                throw new WindupException("Error on " + methodIdent(method) +":\n    " + ex.getMessage(), ex);
            }

            setInProperties:
            {
                SetInProperties setInProperties = method.getAnnotation(SetInProperties.class);
                if (setInProperties == null)
                    break setInProperties;

                final Class propertyType = TsGenUtils.getPropertyTypeFromMethod(method);
                if (propertyType == null)
                    break setInProperties;

                String graphPropertyPrefix = setInProperties.propertyPrefix();
                final ModelRelation methodInfo = ModelRelation.infoFromMethod(method);
                final ModelSetInProperties existing = modelDescriptor.modelSetInPropertiesMap.get(graphPropertyPrefix);
                if (existing != null)
                    continue;

                LOG.info("    * Examining @SetInProperties " + method.getName());
                final ModelSetInProperties modelSetInProperties = new ModelSetInProperties(
                        methodInfo.beanPropertyName,
                        graphPropertyPrefix,
                        PrimitiveType.from(propertyType)
                );
                modelDescriptor.modelSetInPropertiesMap.put(graphPropertyPrefix, modelSetInProperties);
            }
        }
        return modelDescriptor;
    }

    /**
     * Writes a TypeScript class 'DiscriminatorMapping.ts' with the mapping from the discriminator value (@TypeValue) to TypeScript model class.
     */
    private void writeTypeScriptClassesMapping(Map<String, ModelDescriptor> discriminatorToClassMapping)
    {
        final File mappingFile = this.config.getOutputPath().resolve(DISCRIMINATOR_MAPPING_DATA_PATH + TS_SUFFIX).toFile();
        try (FileWriter mappingWriter = new FileWriter(mappingFile))
        {
            Set<String> imported = new HashSet<>();

            final Path path = this.config.getImportPathToWebapp().resolve(PATH_TO_GRAPH_PKG).resolve(BaseModelPath);
            mappingWriter.write("import {" + BaseModelName + "} from '" + path + "';\n");
            imported.add(BaseModelName);

            final Path path2 = this.config.getImportPathToWebapp().resolve(PATH_TO_GRAPH_PKG).resolve(DISCRIMINATOR_MAPPING_PATH);
            mappingWriter.write("import {" + DISCRIMINATOR_MAPPING + "} from '" + path2 + "';\n\n");
            imported.add(DISCRIMINATOR_MAPPING);

            for (Map.Entry<String, ModelDescriptor> entry : discriminatorToClassMapping.entrySet())
            {
                String importedClass = entry.getValue().modelClassName;
                if (imported.add(importedClass))
                    mappingWriter.write(String.format("import {%1$s} from './%1$s';\n", importedClass));
                else
                    mappingWriter.write(String.format("// {%1$s} wanted to be here again\n", importedClass));
            }

            mappingWriter.write("export function initializeModelMappingData() {\n");
            for (Map.Entry<String, ModelDescriptor> entry : discriminatorToClassMapping.entrySet())
            {
                mappingWriter.write("    DiscriminatorMapping.addModelClass(" + entry.getValue().modelClassName + ");\n");
            }
            mappingWriter.write("}\n");
        }
        catch (IOException ex)
        {
            LOG.log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Generates a TS barrel, see https://angular.io/docs/ts/latest/glossary.html#B
     *
     * @param discriminatorToClassMapping
     */
    private void writeTypeScriptBarrel(Map<String, ModelDescriptor> discriminatorToClassMapping)
    {
        final File mappingFile = this.config.getOutputPath().resolve("index.ts").toFile();
        try (FileWriter mappingWriter = new FileWriter(mappingFile))
        {
            final Path path = this.config.getImportPathToWebapp().resolve(PATH_TO_GRAPH_PKG).resolve(BaseModelPath);
            mappingWriter.write("import {" + BaseModelName + "} from '" + path + "';\n");
            //mappingWriter.write("import {" + DISCRIMINATOR_MAPPING_DATA + "} from './" + DISCRIMINATOR_MAPPING_DATA_PATH + "';\n\n");

            for (Map.Entry<String, ModelDescriptor> entry : discriminatorToClassMapping.entrySet())
            {
                mappingWriter.write(String.format("export {%1$s} from './%1$s';\n", entry.getValue().modelClassName));
            }
        }
        catch (IOException ex)
        {
            LOG.log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Writes a TypeScript class file for the model described by given model descriptor.
     *
     * @param modelDescriptor
     * @param mode The mode in which the models will operate. This can be a passive way (properties and arrays), active way - proxies, or mixed, or
     *            both. Currently implemented is passive.
     */
    private void writeTypeScriptModelClass(ModelDescriptor modelDescriptor, AdjacencyMode mode)
    {
        final File tsFile = this.config.getOutputPath().resolve(formatClassFileName(modelDescriptor.modelClassName, true)).toFile();
        LOG.info("    * Writing " + tsFile.getPath());

        try (FileWriter tsWriter = new FileWriter(tsFile))
        {
            final Path graphPkg = this.config.getImportPathToWebapp().resolve(PATH_TO_GRAPH_PKG);
            tsWriter.write("import {" + BaseModelName + "} from '" + graphPkg.resolve(BaseModelPath) + "';\n");
            tsWriter.write("import {GraphAdjacency} from '" + graphPkg.resolve("graph-adjacency.decorator") + "';\n");
            tsWriter.write("import {GraphProperty} from '" + graphPkg.resolve("graph-property.decorator") + "';\n");
            tsWriter.write("import {SetInProperties} from '" + graphPkg.resolve("set-in-properties.decorator") + "';\n\n");
            tsWriter.write("import {Observable} from 'rxjs/Observable';\n\n");

            Set<String> imported = new HashSet<>();
            imported.add(BaseModelName);

            // Import property and relation types.
            for (ModelRelation relation : modelDescriptor.getRelations())
            {
                final String typeScriptTypeName = relation.type.getTypeScriptTypeName();
                // Don't import this class
                if (typeScriptTypeName.equals(modelDescriptor.modelClassName))
                    continue;
                // Prevent import {any}...
                if ("any".equals(modelDescriptor.modelClassName))
                    continue;
                if (imported.add(typeScriptTypeName))
                    tsWriter.write(String.format("import {%1$s} from './%1$s';\n",
                                typeScriptTypeName, formatClassFileName(typeScriptTypeName, false)));
            }

            List<String> extendedModels = modelDescriptor.extendedModels;
            if (extendedModels == null || extendedModels.isEmpty())
                extendedModels = Collections.singletonList(AdjacencyMode.PROXIED.equals(mode) ? "FrameProxy" : BaseModelName);

            // Import extended types.
            tsWriter.write( extendedModels.stream()
                .filter(imported::add)
                .map(x -> String.format("import {%1$s} from './%1$s';\n", x))
                .collect(Collectors.joining()));

            tsWriter.write("\nexport class " + modelDescriptor.modelClassName + " extends " + String.join(" //", extendedModels) + "\n{\n");
            // tsWriter.write(" private vertexId: number;\n\n");
            tsWriter.write("    static discriminator: string = '" + modelDescriptor.discriminator + "';\n\n");

            // Data for mapping from the graph JSON object to Frame-based models.
            if (!AdjacencyMode.DECORATED.equals(mode))
            {
                tsWriter.write("    static graphPropertyMapping: { [key:string]:string; } = {\n");
                for (ModelProperty property : modelDescriptor.getProperties().values())
                {
                    tsWriter.write(String.format("        %s: '%s',\n", TsGenUtils.escapeJSandQuote(property.graphPropertyName),
                                property.beanPropertyName));
                }
                tsWriter.write("    };\n\n");
                tsWriter.write("    static graphRelationMapping: { [key:string]:string; } = {\n");
                for (ModelRelation relation : modelDescriptor.getRelations())
                {
                    try
                    {
                        // edgeLabel: 'propName[TypeValue'
                        // The TypeValue (discriminator) is useful on the client side because the generated JavaScript
                        // has no clue what type is coming or what types should it send back to the server.
                        // While it's coming in the "w:winduptype" value, this may contain several values,
                        // and the models unmarshaller needs to know which one to unmarshall to.
                        tsWriter.write("        " + TsGenUtils.escapeJSandQuote(relation.edgeLabel) + ": '" + relation.beanPropertyName
                                    + (relation.isIterable ? "[" : "|")
                                    + (relation.type instanceof FrameType ? ((FrameType) relation.type).getFrameDiscriminator() : "") + "',\n");

                    }
                    catch (Exception ex)
                    {
                        String msg = "Error writing relation " + relation.beanPropertyName + ": " + ex.getMessage();
                        tsWriter.write("        // " + msg + "\n");
                        LOG.severe(msg);
                    }
                }
                tsWriter.write("    };\n\n");
            }

            // Actual properties and methods.
            for (ModelProperty property : modelDescriptor.getProperties().values())
            {
                tsWriter.write(property.toTypeScript(mode));
                tsWriter.write("\n");
            }

            for (ModelSetInProperties modelSetInProperties : modelDescriptor.modelSetInPropertiesMap.values())
            {
                tsWriter.write(modelSetInProperties.toTypeScript(mode));
                tsWriter.write("\n");
            }

            tsWriter.write("\n");

            for (ModelRelation relation : modelDescriptor.getRelations())
            {
                tsWriter.write(relation.toTypeScript(mode));
                tsWriter.write("\n");
            }

            tsWriter.write("}\n");
        }
        catch (IOException ex)
        {
            LOG.log(Level.SEVERE, "Failed creating TypeScript model for " + modelDescriptor.toString() + ":\n\t" + ex.getMessage(), ex);
        }
    }

    /**
     * We really should not try to generate filenames, otherwise it will lead to names like "e-j-b-statefull-bean.ts" or "x-m-l-http-request", or,
     * alternatively, "eJB-statefull" and "xmlhttp-request".
     *
     * @param className
     * @param includeSuffix
     * @return
     */
    private String formatClassFileName(String className, boolean includeSuffix)
    {
        if (null == className)
            throw new IllegalArgumentException("className is null");

        String suffix = includeSuffix ? TS_SUFFIX : "";
        String separ = ".";
        switch (this.config.getFileNamingStyle())
        {
        case LOWERCASE_DASHES:
            separ = "-";
        case LOWERCASE_DOTS:
        {
            // Replace uppercase letters with $separ + lowercase.
            Matcher mat = UPPERCASE_LETTER.matcher(className);
            return mat.replaceAll("$1" + separ + "$2").toLowerCase(Locale.ENGLISH) + suffix;
        }
        default:
        case CAMELCASE:
            return className + suffix;
        }
    }

    private Object setAndWarnIfDifferent(String what, Object existing, Object newOne)
    {
        if (existing == null)
            return newOne;
        if (existing.equals(newOne) || newOne == null)
            return existing;
        throw new WindupException(String.format("Trait '%s' was expected to be new or same as previously seen, but were:"
                + "\n    Existing: %s"
                + "\n    New:      %s", what, existing, newOne));
    }
}
