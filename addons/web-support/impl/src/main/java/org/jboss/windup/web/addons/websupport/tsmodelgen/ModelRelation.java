package org.jboss.windup.web.addons.websupport.tsmodelgen;

import static org.jboss.windup.web.addons.websupport.tsmodelgen.TsGenUtils.quoteIfNotNull;
import static org.jboss.windup.web.addons.websupport.tsmodelgen.TsGenUtils.format;

import java.lang.reflect.Method;
import java.util.EnumSet;

import org.apache.commons.lang3.StringUtils;
import static org.apache.commons.lang3.StringUtils.capitalize;

/**
 * A relation between WinudpVertexFrame's.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
class ModelRelation extends ModelMember
{
    String edgeLabel;
    String query;
    boolean directionOut;

    /**
     * Is it @Adjacency (vertex-vertex) or @Incidence (vertex-edge)?
     */
    boolean isAdjacency;

    public ModelRelation(String name, String edgeLabel, boolean directionOut, ModelType type, boolean iterable, boolean isAdjacency)
    {
        this.beanPropertyName = name;
        this.edgeLabel = edgeLabel;
        this.directionOut = directionOut;
        this.type = type;
        this.isIterable = iterable;
        this.isAdjacency = isAdjacency;
    }

    ModelRelation()
    {
    }

    /**
     * Derives the property beanPropertyName from the given method, assuming it's a getter, setter, adder or remover. The returned ModelRelation has
     * the beanPropertyName, the methodsPresent and the isIterable set.
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

    String toTypeScriptDecorated()
    {
        String brackets = this.isIterable ? "[]" : "";
        StringBuilder sb = new StringBuilder();
        String direction = this.directionOut ? "'OUT'" : "'IN'";
        format(sb, "    @GraphAdjacency(%s, %s, %b, %b)\n", quoteIfNotNull(this.edgeLabel), direction, this.isIterable, this.isAdjacency);
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

}
