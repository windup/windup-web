package org.jboss.windup.web.addons.websupport.tsmodelgen;

import java.util.EnumSet;

/**
 * Common for properties and relations.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
abstract class ModelMember implements Comparable<ModelMember>
{
    String beanPropertyName;
    ModelType type;
    boolean isIterable;
    EnumSet<BeanMethodType> methodsPresent = EnumSet.noneOf(BeanMethodType.class);

    public enum BeanMethodType
    {
        GET, SET, ADD, REMOVE
    }

    @Override
    public int compareTo(ModelMember o)
    {
        if (o == null)
            throw new IllegalArgumentException("Comparing to null.");
        return this.beanPropertyName.compareToIgnoreCase(o.beanPropertyName);
    }

}
