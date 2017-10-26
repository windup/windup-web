package org.jboss.windup.web.messaging.executor;

/**
 * Thrown when there is an attempt to register multiple {@link ExecutionSerializer}s with the same name.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class DuplicateSerializerException extends RuntimeException
{
    public DuplicateSerializerException()
    {
    }

    public DuplicateSerializerException(String message)
    {
        super(message);
    }

    public DuplicateSerializerException(String message, Throwable cause)
    {
        super(message, cause);
    }

    public DuplicateSerializerException(Throwable cause)
    {
        super(cause);
    }

    public DuplicateSerializerException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace)
    {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
