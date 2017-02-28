package org.jboss.windup.web.addons.websupport.rest.graph.aggregatedStatistics;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;

/**
 * Contains a basic key value pair for storing statistics.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class StatisticEntry
{
    private String name;
    private int value;

    /**
     * Create an empty object.
     */
    public StatisticEntry()
    {
    }

    /**
     * Creates an object with the given name and value.
     */
    public StatisticEntry(String name, int value)
    {
        this.name = name;
        this.value = value;
    }

    /**
     * Contains the name of this entry.
     */
    public String getName()
    {
        return name;
    }

    /**
     * Contains the numerical value.
     */
    public int getValue()
    {
        return value;
    }
}
