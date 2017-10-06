package org.jboss.windup.web.messaging.executor;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public abstract class AMQConstants
{
    public static final String EXECUTOR_QUEUE = "executorQueue";
    public static final String CANCELLATION_TOPIC = "executorCancellation";
    public static final String STATUS_UPDATE_QUEUE = "statusUpdateQueue";
    public static final String PACKAGE_DISCOVERY_QUEUE = "packageDiscoveryQueue";

    public static final String DELIVERY_GROUP_EXECUTOR = "dg_executors";
    public static final String DELIVERY_GROUP_SERVICES = "dg_services";

    public static final String AMQ_LARGE_MESSAGE_INPUTSTREAM_PROPERTY = "JMS_AMQ_InputStream";
    public static final String AMQ_LARGE_MESSAGE_SAVESTREAM_PROPERTY = "JMS_AMQ_SaveStream";
}
