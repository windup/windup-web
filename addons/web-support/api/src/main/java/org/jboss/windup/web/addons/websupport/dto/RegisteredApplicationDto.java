package org.jboss.windup.web.addons.websupport.dto;

import com.tinkerpop.blueprints.Vertex;
import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class RegisteredApplicationDto
{
    private String fileName;
    private String filePath;

    public RegisteredApplicationDto()
    {
    }

    public RegisteredApplicationDto(RegisteredApplicationModel model)
    {
        this.fileName = model.getFileName();
        this.filePath = model.getFilePath();
    }

    public RegisteredApplicationDto(String fileName, String filePath)
    {
        this.fileName = fileName;
        this.filePath = filePath;
    }

    public String getFileName()
    {
        return fileName;
    }

    public void setFileName(String fileName)
    {
        this.fileName = fileName;
    }

    public String getFilePath()
    {
        return filePath;
    }

    public void setFilePath(String filePath)
    {
        this.filePath = filePath;
    }
}
