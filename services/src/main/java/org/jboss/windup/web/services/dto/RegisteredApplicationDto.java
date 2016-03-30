package org.jboss.windup.web.services.dto;

import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.services.validators.FileExistsConstraint;

/**
 * Provides an easy way to transfer RegisteredApplication information between the client and server
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class RegisteredApplicationDto
{
    @FileExistsConstraint
    private String inputPath;

    private String inputFilename;
    private String outputPath;

    public RegisteredApplicationDto()
    {
    }

    public RegisteredApplicationDto(String inputPath)
    {
        this.inputPath = inputPath;
    }

    public RegisteredApplicationDto(String inputPath, String inputFilename, String outputPath)
    {
        this.inputPath = inputPath;
        this.inputFilename = inputFilename;
        this.outputPath = outputPath;
    }

    public RegisteredApplicationDto(RegisteredApplicationModel model)
    {
        this(model.getInputPath(), model.getInputFilename(), model.getOutputPath());
    }

    public String getInputPath()
    {
        return this.inputPath;
    }

    public void setInputPath(String path)
    {
        this.inputPath = path;
    }

    public String getInputFilename()
    {
        return this.inputFilename;
    }

    public void setInputFilename(String filename)
    {
        this.inputFilename = filename;
    }

    public String getOutputPath()
    {
        return this.outputPath;
    }

    public void setOutputPath(String path)
    {
        this.outputPath = path;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        RegisteredApplicationDto that = (RegisteredApplicationDto) o;

        if (inputPath != null ? !inputPath.equals(that.inputPath) : that.inputPath != null)
            return false;
        if (inputFilename != null ? !inputFilename.equals(that.inputFilename) : that.inputFilename != null)
            return false;
        return outputPath != null ? outputPath.equals(that.outputPath) : that.outputPath == null;

    }

    @Override
    public int hashCode()
    {
        int result = inputPath != null ? inputPath.hashCode() : 0;
        result = 31 * result + (inputFilename != null ? inputFilename.hashCode() : 0);
        result = 31 * result + (outputPath != null ? outputPath.hashCode() : 0);
        return result;
    }

    @Override
    public String toString()
    {
        return "RegisteredApplicationDto{" +
                    "inputPath='" + inputPath + '\'' +
                    ", inputFilename='" + inputFilename + '\'' +
                    ", outputPath='" + outputPath + '\'' +
                    '}';
    }
}
