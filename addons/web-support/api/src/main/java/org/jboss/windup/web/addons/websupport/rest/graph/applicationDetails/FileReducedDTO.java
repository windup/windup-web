package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.inject.Vetoed;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.jboss.windup.graph.model.resource.FileModel;

/**
 * Contains a reduced subset of data from the {@link FileModel} that is the minimal set required by the
 * application details report.
 *
 * This includes:
 * <ul>
 *     <li>Vertex ID</li>
 *     <li>Relative file path</li>
 *     <li>Name (filename or Java class name)</li>
 *     <li>List of tags</li>
 *     <li>List of hint ids</li>
 *     <li>List of classification ids</li>
 * </ul>
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({ "handler", "delegate" })
public class FileReducedDTO
{
    private Object fileModelVertexID;
    private String filePath;
    private String name;
    private List<TagReducedDTO> tags = new ArrayList<>();
    private List<Object> hintIDs = new ArrayList<>();
    private List<Object> classificationIDs = new ArrayList<>();

    /**
     * Contains the vertex id.
     */
    public Object getFileModelVertexID()
    {
        return fileModelVertexID;
    }

    /**
     * Contains the vertex id.
     */
    public void setFileModelVertexID(Object fileModelVertexID)
    {
        this.fileModelVertexID = fileModelVertexID;
    }

    /**
     * Contains the file path.
     */
    public String getFilePath()
    {
        return filePath;
    }

    /**
     * Contains the file path.
     */
    public void setFilePath(String filePath)
    {
        this.filePath = filePath;
    }

    /**
     * Contains the file name (filename or classname for display).
     */
    public String getName()
    {
        return name;
    }

    /**
     * Contains the file name (filename or classname for display).
     */
    public void setName(String name)
    {
        this.name = name;
    }

    /**
     * Contains the tags associated with this file.
     */
    public List<TagReducedDTO> getTags()
    {
        return tags;
    }

    /**
     * Contains the tags associated with this file.
     */
    public void setTags(List<TagReducedDTO> tags)
    {
        this.tags = tags;
    }

    /**
     * Contains the ids of all hints associated with this file.
     */
    public List<Object> getHintIDs()
    {
        return hintIDs;
    }

    /**
     * Contains the ids of all hints associated with this file.
     */
    public void setHintIDs(List<Object> hintIDs)
    {
        this.hintIDs = hintIDs;
    }

    /**
     * Contains the ids of all classifications associated with this file.
     */
    public List<Object> getClassificationIDs()
    {
        return classificationIDs;
    }

    /**
     * Contains the ids of all classifications associated with this file.
     */
    public void setClassificationIDs(List<Object> classificationIDs)
    {
        this.classificationIDs = classificationIDs;
    }
}
