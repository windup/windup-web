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
public class FileDTO
{
    private Object fileModelVertexID;
    private String filePath;
    private String name;
    private List<TagDTO> tags = new ArrayList<>();
    private List<Object> hintIDs = new ArrayList<>();
    private List<Object> classificationIDs = new ArrayList<>();

    public Object getFileModelVertexID()
    {
        return fileModelVertexID;
    }

    public void setFileModelVertexID(Object fileModelVertexID)
    {
        this.fileModelVertexID = fileModelVertexID;
    }

    public String getFilePath()
    {
        return filePath;
    }

    public void setFilePath(String filePath)
    {
        this.filePath = filePath;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public List<TagDTO> getTags()
    {
        return tags;
    }

    public void setTags(List<TagDTO> tags)
    {
        this.tags = tags;
    }

    public List<Object> getHintIDs()
    {
        return hintIDs;
    }

    public void setHintIDs(List<Object> hintIDs)
    {
        this.hintIDs = hintIDs;
    }

    public List<Object> getClassificationIDs()
    {
        return classificationIDs;
    }

    public void setClassificationIDs(List<Object> classificationIDs)
    {
        this.classificationIDs = classificationIDs;
    }
}
