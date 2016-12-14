package org.jboss.windup.web.addons.websupport.tsmodelgen;

import static org.jboss.windup.web.addons.websupport.tsmodelgen.TsGenUtils.quoteIfNotNull;

/**
 * A property - annotated with @Property in the original model. Can be a {@link java.io.Serializable} too, but in Windup models, it's only primitive
 * types IIRC.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
class ModelProperty extends ModelMember
{

    String graphPropertyName;
    boolean hasSetter;
    boolean hasGetter;

    public ModelProperty(String beanPropertyName, String graphPropertyName, PrimitiveType type)
    {
        this.beanPropertyName = beanPropertyName;
        this.graphPropertyName = graphPropertyName;
        this.type = type;
    }

    String toTypeScript(TypeScriptModelsGeneratorConfig.AdjacencyMode mode)
    {
        StringBuilder sb = new StringBuilder();
        if (TypeScriptModelsGeneratorConfig.AdjacencyMode.DECORATED.equals(mode))
        {
            sb.append(String.format("    @GraphProperty(%s)\n", quoteIfNotNull(this.graphPropertyName)));
        }
        sb.append(String.format("    get %s(): %s { return null; };\n", this.beanPropertyName, this.type.getTypeScriptTypeName()));
        return sb.toString();
    }

}
