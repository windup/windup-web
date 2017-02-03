package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import java.util.HashMap;
import java.util.Map;

import javax.enterprise.inject.Vetoed;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
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

    public Map<Integer, String> getByID()
    {
        return byID;
    }
}
