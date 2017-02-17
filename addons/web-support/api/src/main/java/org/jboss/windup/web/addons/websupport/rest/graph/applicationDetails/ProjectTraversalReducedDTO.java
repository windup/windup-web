package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.inject.Vetoed;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.traversal.ProjectModelTraversal;
import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;

/**
 * Contains the project information and metadata. This should only contain the data relevant to
 * the application details report. See {@link ApplicationDetailsDTO} for more information.
 *
 * For more information about traversals, see {@link ProjectModelTraversal}.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({ "handler", "delegate" })
public class ProjectTraversalReducedDTO
{
    private Object id;
    private Object currentID;
    private Object canonicalID;
    private String canonicalFilename;
    private String path;
    private String name;
    private String description;
    private String sha1;
    private String gav;
    private String organization;
    private String url;
    private List<ApplicationMessageReducedDTO> messages = new ArrayList<>();

    private List<FileReducedDTO> files = new ArrayList<>();
    private List<ProjectTraversalReducedDTO> children = new ArrayList<>();

    /**
     * Contains the id of this {@link PersistedProjectModelTraversalModel}.
     */
    public Object getId()
    {
        return id;
    }

    /**
     * Contains the id of this {@link PersistedProjectModelTraversalModel}.
     */
    public void setId(Object id)
    {
        this.id = id;
    }

    /**
     * Contains the id of the current {@link ProjectModel}. See {@link ProjectModelTraversal} for more
     * information.
     */
    public Object getCurrentID()
    {
        return currentID;
    }

    /**
     * Contains the id of the current {@link ProjectModel}. See {@link ProjectModelTraversal} for more
     * information.
     */
    public void setCurrentID(Object currentID)
    {
        this.currentID = currentID;
    }

    /**
     * Contains the id of the canonical {@link ProjectModel}. See {@link ProjectModelTraversal} for more
     * information.
     */
    public Object getCanonicalID()
    {
        return canonicalID;
    }

    /**
     * Contains the id of the canonical {@link ProjectModel}. See {@link ProjectModelTraversal} for more
     * information.
     */
    public void setCanonicalID(Object canonicalID)
    {
        this.canonicalID = canonicalID;
    }

    /**
     * Contains the filename of the canonical instance of this project.
     */
    public String getCanonicalFilename()
    {
        return canonicalFilename;
    }

    /**
     * Contains the filename of the canonical instance of this project.
     */
    public void setCanonicalFilename(String canonicalFilename)
    {
        this.canonicalFilename = canonicalFilename;
    }

    /**
     * Contains the relative path to this project.
     */
    public String getPath()
    {
        return path;
    }

    /**
     * Contains the relative path to this project.
     */
    public void setPath(String path)
    {
        this.path = path;
    }

    /**
     * Contains the name of this project.
     */
    public String getName()
    {
        return name;
    }

    /**
     * Contains the name of this project.
     */
    public void setName(String name)
    {
        this.name = name;
    }

    /**
     * Contains the description of this project.
     */
    public String getDescription()
    {
        return description;
    }

    /**
     * Contains the description of this project.
     */
    public void setDescription(String description)
    {
        this.description = description;
    }

    /**
     * Contains the sha1 hash of this project.
     */
    public String getSha1()
    {
        return sha1;
    }

    /**
     * Contains the sha1 hash of this project.
     */
    public void setSha1(String sha1)
    {
        this.sha1 = sha1;
    }

    /**
     * Contains the Group, Artifact, Version string (in Maven format) for this project.
     */
    public String getGav()
    {
        return gav;
    }

    /**
     * Contains the Group, Artifact, Version string (in Maven format) for this project.
     */
    public void setGav(String gav)
    {
        this.gav = gav;
    }

    /**
     * Contains the name of the organization that produced this project.
     */
    public String getOrganization()
    {
        return organization;
    }

    /**
     * Contains the name of the organization that produced this project.
     */
    public void setOrganization(String organization)
    {
        this.organization = organization;
    }

    /**
     * Contains project url.
     */
    public String getUrl()
    {
        return url;
    }

    /**
     * Contains project url.
     */
    public void setUrl(String url)
    {
        this.url = url;
    }

    /**
     * Contains any application level messages for this project.
     */
    public List<ApplicationMessageReducedDTO> getMessages()
    {
        return messages;
    }

    /**
     * Contains any application level messages for this project.
     */
    public void setMessages(List<ApplicationMessageReducedDTO> messages)
    {
        this.messages = messages;
    }

    /**
     * Contains all files within this project that are suitable for reporting (for example, source files).
     */
    public List<FileReducedDTO> getFiles()
    {
        return files;
    }

    /**
     * Contains all files within this project that are suitable for reporting (for example, source files).
     */
    public void setFiles(List<FileReducedDTO> files)
    {
        this.files = files;
    }

    /**
     * Contains all files within this project that are suitable for reporting (for example, source files).
     */
    public List<ProjectTraversalReducedDTO> getChildren()
    {
        return children;
    }

    /**
     * Contains all files within this project that are suitable for reporting (for example, source files).
     */
    public void setChildren(List<ProjectTraversalReducedDTO> children)
    {
        this.children = children;
    }
}
