package org.jboss.windup.web.addons.websupport.tsmodelgen;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Info about the type class from which the TypeScript model can be created.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
class ModelDescriptor
{
    /** Model class name. */
    String modelClassName;

    /** Currently we only support 1 "parent" Model. For Models with more, a warning is printed. */
    List<String> extendedModels;

    /** Frames model class discriminator - determines the type. */
    String discriminator;

    private final Map<String, ModelProperty> properties = new TreeMap<>();
    Map<String, ModelSetInProperties> modelSetInPropertiesMap = new HashMap<>();

    private final Map<String, ModelRelation> relations = new TreeMap<>();

    
    private static String formatRelationsMapKey(String edgeLabel, boolean out)
    {
        return edgeLabel + (out ? "/o" : "/i");
    }

    ModelRelation getRelation(String edgeLabel, boolean out)
    {
        return relations.get(formatRelationsMapKey(edgeLabel, out));
    }

    ModelDescriptor addRelation(ModelRelation relation)
    {
        relations.put(formatRelationsMapKey(relation.edgeLabel, relation.directionOut), relation);
        return this;
    }

    Collection<ModelRelation> getRelations()
    {
        return this.relations.values();
    }

    public Map<String, ModelProperty> getProperties()
    {
        return properties;
    }

    @Override
    public String toString()
    {
        return "ModelDescriptor{modelClass=" + modelClassName + ", disc=" + discriminator + '}';
    }

}
