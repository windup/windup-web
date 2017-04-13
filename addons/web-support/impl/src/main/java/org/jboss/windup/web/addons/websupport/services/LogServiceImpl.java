package org.jboss.windup.web.addons.websupport.services;

import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
import java.util.logging.Handler;
import java.util.logging.LogRecord;

import org.apache.commons.io.IOUtils;
import org.jboss.forge.furnace.util.OperatingSystemUtils;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.util.exception.WindupException;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class LogServiceImpl implements LogService
{
    private static final String LOG_DIR = "logs";
    private static final String LOG_FILENAME = "analysis.log";

    @Override
    public Handler createLogHandler(WindupConfiguration configuration) throws IOException
    {
        Path logFilePath = getLogFilePath(configuration.getOutputDirectory());
        final FileWriter writer = new FileWriter(logFilePath.toFile());
        return new Handler()
        {
            @Override
            public void publish(LogRecord record)
            {
                try
                {
                    writer.write("[");
                    writer.write(record.getLoggerName());
                    writer.write("] ");
                    writer.write(record.getMessage());
                    writer.write(OperatingSystemUtils.getLineSeparator());
                }
                catch (Throwable t)
                {
                    // just ignore it... unable to log
                }
            }

            @Override
            public void flush()
            {
                try
                {
                    writer.flush();
                }
                catch (Throwable t)
                {
                    // just ignore it...
                }
            }

            @Override
            public void close() throws SecurityException
            {
                try
                {
                    writer.close();
                }
                catch (Throwable t)
                {
                    // just ignore it...
                }
            }
        };
    }

    @Override
    public List<String> getLogData(Path reportPath, int lastNBytes)
    {
        Path logPath = getLogFilePath(reportPath);
        if (!Files.exists(logPath) || !Files.isRegularFile(logPath))
            return Collections.emptyList();

        try
        {
            long fileSize = Files.size(logPath);
            FileInputStream fileInputStream = new FileInputStream(logPath.toFile());

            if (lastNBytes < fileSize)
                fileInputStream.skip(fileSize - lastNBytes);

            List<String> results = IOUtils.readLines(fileInputStream);
            return results;
        }
        catch (IOException e)
        {
            return Collections.singletonList("Error reading log file!");
        }
    }

    private Path getLogFilePath(Path reportPath)
    {
        Path logDir = reportPath.resolve("logs");
        try
        {
            Files.createDirectories(logDir);
        }
        catch (IOException e)
        {
            throw new WindupException("Could not create log directory due to: " + e.getMessage(), e);
        }
        return logDir.resolve("analysis.log");
    }
}
