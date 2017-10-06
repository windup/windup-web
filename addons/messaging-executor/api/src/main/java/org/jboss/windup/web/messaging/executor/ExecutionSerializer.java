package org.jboss.windup.web.messaging.executor;

import org.jboss.windup.web.services.model.WindupExecution;

import javax.jms.JMSContext;
import javax.jms.Message;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface ExecutionSerializer
{
    /**
     * Returns the name for this serializer.
     */
    String getName();

    /**
     * Serialize the given execution request for transmission over JMS. This may require creating consolidated
     * tar files or some other (implementation dependent) approach to getting the files to the other end.
     *
     * Alternatively, it may be as simple as using the given path, if the implementation is using
     * shared storage.s
     */
    Message serializeExecutionRequest(JMSContext context, WindupExecution execution);

    /**
     * Deserialize the execution request, uncompress any files from the image, and prepare for the
     * analysis to take place.
     */
    ExecutionRequest deserializeExecutionRequest(Message message);

    /**
     * Serialize a status update. If the includeReportOutput parameter is set, then insure that full message
     * contents are included in the serialized output.
     */
    Message serializeStatusUpdate(JMSContext context, Long projectId, WindupExecution execution, boolean includeReportOutput);

    /**
     * Deserialize the status update. This should also decompress the files locally if the files are being transferred
     * in the message (this is implementation dependent).
     *
     * The last status update from the local DB is provided, as that may have relevant path information. Some
     * serialization providers may find this information useful.
     */
    WindupExecution deserializeStatusUpdate(Message message, WindupExecution lastStatusUpdateFromDB);

}
