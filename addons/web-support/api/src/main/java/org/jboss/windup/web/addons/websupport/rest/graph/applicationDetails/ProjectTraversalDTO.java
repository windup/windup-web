package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.inject.Vetoed;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({ "handler", "delegate" })
public class ProjectTraversalDTO
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
    private List<ApplicationMessageDTO> messages = new ArrayList<>();

    private List<FileDTO> files = new ArrayList<>();
    private List<ProjectTraversalDTO> children = new ArrayList<>();
    private List<DuplicateProjectDTO> duplicates = new ArrayList<>();

    public Object getId()
    {
        return id;
    }

    public void setId(Object id)
    {
        this.id = id;
    }

    public Object getCurrentID()
    {
        return currentID;
    }

    public void setCurrentID(Object currentID)
    {
        this.currentID = currentID;
    }

    public Object getCanonicalID()
    {
        return canonicalID;
    }

    public void setCanonicalID(Object canonicalID)
    {
        this.canonicalID = canonicalID;
    }

    public String getCanonicalFilename()
    {
        return canonicalFilename;
    }

    public void setCanonicalFilename(String canonicalFilename)
    {
        this.canonicalFilename = canonicalFilename;
    }

    public List<DuplicateProjectDTO> getDuplicates()
    {
        return duplicates;
    }

    public void setDuplicates(List<DuplicateProjectDTO> duplicates)
    {
        this.duplicates = duplicates;
    }

    public String getPath()
    {
        return path;
    }

    public void setPath(String path)
    {
        this.path = path;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String getSha1()
    {
        return sha1;
    }

    public void setSha1(String sha1)
    {
        this.sha1 = sha1;
    }

    public String getGav()
    {
        return gav;
    }

    public void setGav(String gav)
    {
        this.gav = gav;
    }

    public String getOrganization()
    {
        return organization;
    }

    public void setOrganization(String organization)
    {
        this.organization = organization;
    }

    public String getUrl()
    {
        return url;
    }

    public void setUrl(String url)
    {
        this.url = url;
    }

    public List<ApplicationMessageDTO> getMessages()
    {
        return messages;
    }

    public void setMessages(List<ApplicationMessageDTO> messages)
    {
        this.messages = messages;
    }

    public List<FileDTO> getFiles()
    {
        return files;
    }

    public void setFiles(List<FileDTO> files)
    {
        this.files = files;
    }

    public List<ProjectTraversalDTO> getChildren()
    {
        return children;
    }

    public void setChildren(List<ProjectTraversalDTO> children)
    {
        this.children = children;
    }
}
