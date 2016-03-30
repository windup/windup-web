package org.jboss.windup.web.services.rest;

import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.commons.lang.StringUtils;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class FileEndpointImpl implements FileEndpoint
{
    @Override
    public boolean pathExists(String path)
    {
        return !StringUtils.isBlank(path) && Files.exists(Paths.get(path));
    }
}
