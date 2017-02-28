package org.jboss.windup.web.addons.websupport.rest.graph.aggregatedStatistics;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;

/**
 * Contains a list of {@link StatisticEntry}s as well as methods to manipulate them.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class StatisticsList
{
    List<StatisticEntry> entries = new ArrayList<>();

    @JsonIgnore
    private Map<String, StatisticEntry> entriesByKey = new HashMap<>();

    /**
     * Gets all of the entries.
     */
    public List<StatisticEntry> getEntries()
    {
        return entries;
    }

    /**
     * Sorts them alphabetically (ascending) by key.
     */
    public void sortByKey() {
        this.entries.sort(Comparator.comparing(o -> o.getName().toUpperCase()));
    }

    /**
     * Sorts numerically (by value), descending.
     */
    public void sortByValue() {
        this.entries.sort(Comparator.comparingInt(StatisticEntry::getValue).reversed());
    }

    /**
     * Adds the given value. If an entry with this key already exists, the value will be added to
     * the existing entry.
     */
    public void addValue(String key, int value)
    {
        StatisticEntry entry = this.entriesByKey.get(key);
        int previousValue = entry == null ? 0 : entry.getValue();

        if (entry != null)
            this.entries.remove(entry);

        entry = new StatisticEntry(key, previousValue + value);

        this.entries.add(entry);
        this.entriesByKey.put(key, entry);
    }
}
