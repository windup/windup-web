package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This provides all of the data required by the execution list. At a high level, this consists of:
 *
 * <ul>
 *     <li>Projects and their children - in a tree structure</li>
 *     <li>
 *         Projects contain files
 *         <ul>
 *             <li>Files reference the ID of hints and classification</li>
 *             <li>Files also reference tags</li>
 *         </ul>
 *     </li>
 *     <li>Classification and Hint maps by ID</li>
 *     <li>A global string cache that is used for all potentially long strings to reduce transmission volume</li>
 * </ul>
 *
 * The net effect is that we are able to quickly and succinctly transmit data to the client, even in the case of extremely
 * large applications.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class ApplicationDetailsDTO
{
    private List<ProjectTraversalReducedDTO> traversals = new ArrayList<>();
    private Map<Object, HintReducedDTO> hints = new HashMap<>();
    private Map<Object, ClassificationReducedDTO> classifications = new HashMap<>();
    private StringCache stringCache = new StringCache();

    /**
     * Contains the project hierarchy, project metadata, and the files in each project.
     */
    public List<ProjectTraversalReducedDTO> getTraversals()
    {
        return traversals;
    }

    /**
     * Contains all hints used by the files in the contained projects, organized by vertex id.
     */
    public Map<Object, HintReducedDTO> getHints()
    {
        return hints;
    }

    /**
     * Contains all classifications used by the files in the contained projects, organized by vertex id.
     */
    public Map<Object, ClassificationReducedDTO> getClassifications()
    {
        return classifications;
    }

    /**
     * Contains a indexed cache of strings used in order to save bandwidth.
     */
    public StringCache getStringCache() {
        return stringCache;
    }
}
