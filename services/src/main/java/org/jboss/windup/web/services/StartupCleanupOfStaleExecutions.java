package org.jboss.windup.web.services;

import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import org.jboss.windup.web.services.service.WindupExecutionService;

/**
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Singleton
@Startup
public class StartupCleanupOfStaleExecutions
{
    private static Logger LOG = Logger.getLogger(StartupCleanupOfStaleExecutions.class.getName());

    @Inject
    private WindupExecutionService execService;

    @PostConstruct
    public void cleanupStaleExecutions()
    {
        execService.cleanupStaleExecutions();
    }
}
