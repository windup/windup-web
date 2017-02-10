package org.jboss.windup.web.services.rest;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.commons.lang.StringUtils;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class FileEndpointImpl implements FileEndpoint
{
    static boolean remoteUserCanQueryPath(Path path){
        if (!Files.isReadable(path))
           return false;
        if (Files.isExecutable(path) && !Files.isDirectory(path))
               return false;
        for (Path element : path) {
            if (element.toString().equals(".."))
                return false;
            if (element.toString().startsWith("."))
                return false;
        }

        return true;
    }

    @Override
    public boolean pathExists(String pathStr)
    {
        final Path path = Paths.get(pathStr);
        return !StringUtils.isBlank(pathStr) && Files.exists(path) && remoteUserCanQueryPath(path);
    }

    @Override
    public PathTargetType pathTargetType(String pathStr)
    {
        if (StringUtils.isBlank(pathStr))
            return null;

        final Path path = Paths.get(pathStr);

        if (!Files.exists(path) || !remoteUserCanQueryPath(path))
            return null;

        if (Files.isDirectory(path))
            return PathTargetType.DIRECTORY;

        if (Files.isRegularFile(path))
            return PathTargetType.FILE;

        return null;
    }

}
