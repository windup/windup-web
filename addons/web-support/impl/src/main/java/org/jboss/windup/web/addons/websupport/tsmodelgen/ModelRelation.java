package org.jboss.windup.web.addons.websupport.tsmodelgen;

import java.lang.annotation.Annotation;
import static org.jboss.windup.web.addons.websupport.tsmodelgen.TsGenUtils.quoteIfNotNull;
import static org.jboss.windup.web.addons.websupport.tsmodelgen.TsGenUtils.format;

import java.lang.reflect.Method;
import java.util.EnumSet;
import java.util.logging.Logger;

import com.syncleus.ferma.ClassInitializer;
import com.syncleus.ferma.annotations.InVertex;
import com.syncleus.ferma.annotations.Incidence;
import com.syncleus.ferma.annotations.OutVertex;
import org.apache.commons.lang3.StringUtils;
import static org.apache.commons.lang3.StringUtils.capitalize;

import org.apache.tinkerpop.gremlin.structure.Direction;
import org.jboss.windup.graph.Adjacency;
import org.jboss.windup.util.exception.WindupException;

/**
 * A relation between WinudpVertexFrame's.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
class ModelRelation extends ModelMember
{
    private static final Logger LOG = Logger.getLogger(ModelRelation.class.getName());

    String edgeLabel;
    String query;
    boolean directionOut;

    /**
     * If this is an @Incidence relation, this.type contains the model of the edge
     * through which an @Incidence leads to the targetModel.
     * If this is not an @Incidence relation, targetModelType is null.
     */
    ModelType targetModelType;

    /**
     * Is it @Adjacency (vertex-vertex) or @Incidence (vertex-edge)?
     * @deprecated TODO  Use kind.
     */
    @Deprecated
    boolean isAdjacency;

    private RelationKind kind;


    public ModelRelation(String name, String edgeLabel, boolean directionOut, ModelType type, boolean iterable, RelationKind kind)
    {
        this.beanPropertyName = name;
        this.edgeLabel = edgeLabel;
        this.directionOut = directionOut;
        this.type = type;
        this.isIterable = iterable;
        //this.isAdjacency = isAdjacency;
        this.kind = kind;
    }

    ModelRelation()
    {
    }

    /**
     * Derives the property beanPropertyName from the given method, assuming it's a getter, setter, adder or remover.
     * The returned ModelRelation is not complete; only these are set:
     *    * beanPropertyName
     *    * methodsPresent
     *    * isIterable
     *
     * Incidence has a middle type and the signature looks like this:
     *
        @Incidence(label = SOURCE_REPORT_TO_PROJECT_MODEL, direction = Direction.OUT)
        Iterable<SourceReportToProjectEdgeModel> getProjectEdges();

        @Incidence(label = SOURCE_REPORT_TO_PROJECT_MODEL, direction = Direction.OUT)
        SourceReportToProjectEdgeModel addProjectModel(ProjectModel projectModel);
     */
    static ModelRelation infoFromMethod(Method method)
    {
        // Relying on conventions here. Might need some additional data in the Frames models.
        String name = method.getName();
        ModelRelation info = new ModelRelation();
        name = TsGenUtils.removePrefixAndSetMethodPresence(name, "getAll", info.methodsPresent, ModelRelation.BeanMethodType.GET);
        name = TsGenUtils.removePrefixAndSetMethodPresence(name, "get", info.methodsPresent, ModelRelation.BeanMethodType.GET);
        name = TsGenUtils.removePrefixAndSetMethodPresence(name, "is", info.methodsPresent, ModelRelation.BeanMethodType.GET);
        name = TsGenUtils.removePrefixAndSetMethodPresence(name, "set", info.methodsPresent, ModelRelation.BeanMethodType.SET);
        name = TsGenUtils.removePrefixAndSetMethodPresence(name, "add", info.methodsPresent, ModelRelation.BeanMethodType.ADD);
        name = TsGenUtils.removePrefixAndSetMethodPresence(name, "remove", info.methodsPresent, ModelRelation.BeanMethodType.REMOVE);
        name = StringUtils.uncapitalize(name);
        // name = StringUtils.removeEnd(modelClassName, "s"); // Better to have addItems(item: Item) than getItem(): Item[]
        info.beanPropertyName = name;

        String methodIdent = method.toGenericString(); //method.getDeclaringClass() + " " + method.getName();

        /*
        if (method.getAnnotation(Adjacency.class) != null)
            info.isAdjacency = true;
        else if (method.getAnnotation(Incidence.class) != null)
            info.isAdjacency = false;
        else if (method.getAnnotation(Property.class) != null)
            info.isAdjacency = false;
        else
            throw new WindupException("Method is neither @Adjacency nor @Incidence nor @Property, ergo not a relation: " + methodIdent);
        */

        // Param and return type sanity checks.
        if (info.methodsPresent.contains(BeanMethodType.GET) && method.getReturnType().equals(Void.TYPE))
            throw new WindupException("Getter returns void: " + methodIdent);

        if (info.methodsPresent.contains(BeanMethodType.SET) && method.getParameterCount() != 1)
            throw new WindupException("Setter must have 1 param: " + methodIdent);

        if (info.methodsPresent.contains(BeanMethodType.ADD) && method.getParameterCount() != 1)
        {
            if (method.getParameterCount() == 0)
                throw new WindupException("Adder must have >0 params: " + methodIdent);

            if (method.getParameterCount() > 2 && !method.getParameterTypes()[1].isAssignableFrom(ClassInitializer.class))
                throw new WindupException("Adder must have 1 param: " + methodIdent);
        }

        if (info.methodsPresent.contains(BeanMethodType.REMOVE) && method.getParameterCount() != 1)
            throw new WindupException("Remover must have 1 param: " + methodIdent);

        if (Iterable.class.isAssignableFrom(method.getReturnType()))
            info.isIterable = true;
        else if (method.getParameterCount() > 0 && Iterable.class.isAssignableFrom(method.getParameterTypes()[0]))
            info.isIterable = true;

        return info;
    }

    /**
     * Query that is passed to the REST API to limit the set of returned objects.
     */
    public ModelRelation setQuery(String query)
    {
        this.query = query;
        return this;
    }

    public EnumSet<BeanMethodType> getMethodsPresent()
    {
        return methodsPresent;
    }

    public ModelType getType()
    {
        return type;
    }

    String toTypeScript(TypeScriptModelsGeneratorConfig.AdjacencyMode mode)
    {
        switch (mode)
        {
        case PROXIED:
            return toTypeScriptProxy();
        case MATERIALIZED:
            return toTypeScriptMaterialized();
        case DECORATED:
            return toTypeScriptDecorated();
        default:
            throw new UnsupportedOperationException();
        }
    }

    String toTypeScriptMaterialized()
    {
        String brackets = this.isIterable ? "[]" : "";
        return "    public " + this.beanPropertyName + ": " + this.type.getTypeScriptTypeName() + brackets + "; // edge label '" + this.edgeLabel
                    + "'\n";
    }

    /**
     * Generates a getter with @GraphAdjacency decoration with parameters as per this relation. Example:
     * <pre><code>
            @GraphAdjacency('DuplicateArchive:canonicalArchive', 'OUT', false, "ADJ")
            get canonicalArchive(): Observable<ArchiveModel> { return null; };
     * </code></pre>
     */
    String toTypeScriptDecorated()
    {
        String brackets = this.isIterable ? "[]" : "";
        StringBuilder sb = new StringBuilder();
        String direction = this.directionOut ? "'OUT'" : "'IN'";
        format(sb, "    @GraphAdjacency(%s, %s, %b, '%s')", quoteIfNotNull(this.edgeLabel), direction, this.isIterable, this.kind.name());
        if(this.targetModelType != null)
            format(sb, " // @Incidence opposite type: %s", this.targetModelType.getTypeScriptTypeName());
        sb.append("\n");
        format(sb, "    get %s(): Observable<%s%s> { return null; };\n", this.beanPropertyName, this.type.getTypeScriptTypeName(), brackets);

        return sb.toString();
    }

    String toTypeScriptProxy()
    {
        String brackets = this.isIterable ? "[]" : "";

        // A method calling a service to get the adjacent items.
        StringBuilder sb = new StringBuilder();
        format(sb, "    function get%s(): %s%s {\n", capitalize(this.beanPropertyName), this.type.getTypeScriptTypeName(), brackets);
        format(sb, "        return this.queryAdjacent('%s', %s);\n", this.edgeLabel, quoteIfNotNull(this.query));
        format(sb, "    }\n\n");

        // A method calling a service to set the given adjacent item.
        format(sb, "    function set%s(item: %s%s) {\n", capitalize(this.beanPropertyName), this.type.getTypeScriptTypeName(), brackets);
        format(sb, "        return this.set('%s', item);\n", this.edgeLabel);
        format(sb, "    }\n\n");
        if (this.isIterable)
        {
            // A method calling a service to add the adjacent items.
            format(sb, "    function add%s(item: %s) {\n", capitalize(this.beanPropertyName), this.type.getTypeScriptTypeName());
            format(sb, "        return this.add('%s', item);\n" , this.edgeLabel);
            format(sb, "    }\n\n");
            // A method calling a service to remove the adjacent items.
            format(sb, "    function remove%s(item: %s) {\n", capitalize(this.beanPropertyName), this.type.getTypeScriptTypeName());
            format(sb, "        return this.remove('%s', item);\n" , this.edgeLabel);
            format(sb, "    }\n\n");
        }
        return sb.toString();
    }

    @Override
    public String toString()
    {
        return "Relation{" + "edge: " + edgeLabel + ", name: " + beanPropertyName + ", type: "
                    + (type == null ? "null" : type.getTypeScriptTypeName()) + (this.isIterable ? "[]" : "") + '}';
    }


    /**
     * Utility class for easy access to label and direction of different annotations.
     */
    public static enum RelationKind
    {
        ADJACENCY (Adjacency.class),
        INCIDENCE (Incidence.class),
        IN_V  (InVertex.class),
        OUT_V (OutVertex.class);

        private final Class<? extends Annotation> ann;

        private RelationKind(Class<? extends Annotation> annInterface)
        {
            this.ann = annInterface;
        }

        public String label(Annotation ann)
        {
            switch(this){
                case ADJACENCY: return ((Adjacency)ann).label();
                case INCIDENCE: return ((Incidence)ann).label();
                case IN_V:  return null;
                case OUT_V: return null;
            }
            return null;
        }

        public Direction direction(Annotation ann)
        {
            switch(this){
                case ADJACENCY: return ((Adjacency)ann).direction();
                case INCIDENCE: return ((Incidence)ann).direction();
                case IN_V:  return Direction.IN;
                case OUT_V: return Direction.OUT;
            }
            return null;
        }
    }

}
