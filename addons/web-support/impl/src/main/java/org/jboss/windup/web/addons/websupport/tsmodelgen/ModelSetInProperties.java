package org.jboss.windup.web.addons.websupport.tsmodelgen;

import static org.jboss.windup.web.addons.websupport.tsmodelgen.TsGenUtils.quoteIfNotNull;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ModelSetInProperties extends ModelMember {
    String graphPropertyPrefix;
    boolean hasSetter;
    boolean hasGetter;

    public ModelSetInProperties(String beanPropertyName, String graphPropertyPrefix, PrimitiveType type)
    {
        this.beanPropertyName = beanPropertyName;
        this.graphPropertyPrefix = graphPropertyPrefix;
        this.type = type;
    }

    String toTypeScript(TypeScriptModelsGeneratorConfig.AdjacencyMode mode)
    {
        StringBuilder sb = new StringBuilder();
        if (TypeScriptModelsGeneratorConfig.AdjacencyMode.DECORATED.equals(mode))
        {
            sb.append(String.format("    @SetInProperties(%s)\n", quoteIfNotNull(this.graphPropertyPrefix)));
        }
        sb.append(String.format("    get %s(): %s { return null; };\n", this.beanPropertyName, this.type.getTypeScriptTypeName() + "[]"));
        return sb.toString();
    }

}
