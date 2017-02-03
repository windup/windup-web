package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;
import java.util.ArrayList;
import java.util.List;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class DuplicateProjectDTO
{
    private List<String> duplicatePaths = new ArrayList<>();

    public List<String> getDuplicatePaths()
    {
        return duplicatePaths;
    }

    public void setDuplicatePaths(List<String> duplicatePaths)
    {
        this.duplicatePaths = duplicatePaths;
    }
}
