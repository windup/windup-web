package org.jboss.windup.web.services.messaging;

import org.jboss.windup.web.services.WindupWebProgressMonitor;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public abstract class MessagingConstants
{
    public static final String EXECUTOR_QUEUE = "executorQueue";

    /**
     * Serves primarily for updating the execution status in the database
     * by the {@link WindupWebProgressMonitor}, from where the web UI takes it.
     */
    public static final String STATUS_UPDATE_QUEUE = "statusUpdateQueue";

    /**
     * Serves primarily to send execution change requests to the {@link WindupWebProgressMonitor},
     * which will pass it to Windup core.
     */
    public static final String EXEC_CHANGE_REQUEST_TOPIC = "execChangeRequestTopic";
    public static final String PACKAGE_DISCOVERY_QUEUE = "packageDiscoveryQueue";
}
