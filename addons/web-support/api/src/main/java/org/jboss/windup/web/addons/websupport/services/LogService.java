package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.exec.configuration.WindupConfiguration;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.logging.Handler;

/**
 * Contains methods for assisting in the storage and management of execution logs.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface LogService
{
    /**
     * Creates a handler that logs all windup related messages to the log directory.
     */
    Handler createLogHandler(WindupConfiguration configuration) throws IOException;

    /**
     * Gets the last "n" bytes of the log file for the given report. This will return the whole
     * file if it is less than "n" length.
     */
    List<String> getLogData(Path reportPath, int lastNBytes);
}
