package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class ApplicationDetailsDTO
{
    private List<ProjectTraversalDTO> traversals = new ArrayList<>();
    private Map<Object, HintDTO> hints = new HashMap<>();
    private Map<Object, ClassificationDTO> classifications = new HashMap<>();
    private StringCache stringCache = new StringCache();

    public List<ProjectTraversalDTO> getTraversals()
    {
        return traversals;
    }

    public Map<Object, HintDTO> getHints()
    {
        return hints;
    }

    public Map<Object, ClassificationDTO> getClassifications()
    {
        return classifications;
    }

    public StringCache getStringCache() {
        return stringCache;
    }
}
