package org.jboss.windup.web.addons.websupport.tsmodelgen;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    Map<String, ModelProperty> properties = new HashMap<>();

    private Map<String, ModelRelation> relations = new HashMap<>();

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

    @Override
    public String toString()
    {
        return "ModelDescriptor{modelClass=" + modelClassName + ", disc=" + discriminator + '}';
    }

}
