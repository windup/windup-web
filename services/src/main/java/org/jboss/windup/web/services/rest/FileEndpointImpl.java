package org.jboss.windup.web.services.rest;

import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.ws.rs.QueryParam;

import org.apache.commons.lang.StringUtils;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class FileEndpointImpl implements FileEndpoint
{
    static boolean remoteUserCanQueryPath(Path path)
    {
        if (!Files.isReadable(path))
            return false;

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

    @Override
    public int directoryFilesCount(String pathStr, String nameRegex, Long minSizeBytes)
    {
        Path path = Paths.get(pathStr);
        if(!Files.isDirectory(path))
            return -1;
            //throw new javax.ws.rs.BadRequestException(pathStr + " is not a directory");

        Pattern namePattern = null;
        if (nameRegex != null)
        try {
            namePattern = Pattern.compile(nameRegex);
        }
        catch (Exception ex)
        {
            throw new javax.ws.rs.ClientErrorException("Invalid regex '" + nameRegex + "': " + ex.getMessage(), 400);
        }

        int c = 0;
        try(DirectoryStream<Path> files = Files.newDirectoryStream(path)) {
            for(Path file : files) {
                if((Files.isRegularFile(file) && Files.size(file) > 0) || Files.isSymbolicLink(file)) {
                    if (namePattern != null && !namePattern.matcher(file.getFileName().toString()).matches())
                        continue;
                    if (minSizeBytes != null && minSizeBytes > 0 && file.toFile().length() < minSizeBytes)
                        continue;
                    c++;
                }
            }
        }
        catch (Exception e) {
            final String msg = "Failed counting the files in directory " + pathStr + ": " + e.getMessage();
            throw new javax.ws.rs.ServerErrorException(msg, 500);
        }
        return c;
    }
}
