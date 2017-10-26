package org.jboss.windup.web.messaging.executor;

/**
 * Contains messaging related constants (for example, queue names, jndi names, etc).
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public abstract class AMQConstants
{
    /**
     * This queue contains requests to start an analysis session.
     */
    public static final String EXECUTOR_QUEUE = "executorQueue";

    /**
     * This topic contains WindupExecution requests that should be cancelled.
     */
    public static final String CANCELLATION_TOPIC = "executorCancellation";

    /**
     * This queue contains status updates for existing executions.
     */
    public static final String STATUS_UPDATE_QUEUE = "statusUpdateQueue";

    /**
     * This queue contains requests for package discovery runs.
     */
    public static final String PACKAGE_DISCOVERY_QUEUE = "packageDiscoveryQueue";

    /**
     * The name of the delivery group for MDBs that receive execution and cancellation
     * requests.
     */
    public static final String DELIVERY_GROUP_EXECUTOR = "dg_executors";

    /**
     * The delivery group that receives status updates (for example, recording the progress
     * of active analyses).
     */
    public static final String DELIVERY_GROUP_SERVICES = "dg_services";

    /**
     * This property is used by A-MQ/Artemis to indicate that a large file is available at the
     * given input stream. Just call streamMessage.setProperty() with the InputStream as
     * the value to include the contents of the stream in the message.
     */
    public static final String AMQ_LARGE_MESSAGE_INPUTSTREAM_PROPERTY = "JMS_AMQ_InputStream";

    /**
     * This tells A-MQ/Artemis to save the data to the provided OutputStream. As soon as this is called,
     * the message will be saved synchronously to this stream.
     */
    public static final String AMQ_LARGE_MESSAGE_SAVESTREAM_PROPERTY = "JMS_AMQ_SaveStream";
}
