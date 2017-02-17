package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import java.util.HashMap;
import java.util.Map;

import javax.enterprise.inject.Vetoed;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Contains a key/value indexed dictionary of strings as a way of reducing bandwidth overhead in transferring
 * this data to the client.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({ "handler", "delegate" })
public class StringCache
{
    @JsonIgnore
    private Map<String, Integer> stringToID = new HashMap<>();
    @JsonIgnore
    private int maxID = 1;

    private Map<Integer, String> byID = new HashMap<>();

    /**
     * Adds a string to the cache and returns the id.
     */
    public int getOrAdd(String title)
    {
        Integer id = stringToID.get(title);
        if (id == null)
        {
            id = maxID++;
            byID.put(id, title);
            stringToID.put(title, id);
        }
        return id;
    }

    /**
     * Gets a string from the cache based upon its id.
     */
    public Map<Integer, String> getByID()
    {
        return byID;
    }
}
