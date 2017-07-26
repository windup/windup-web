package org.jboss.windup.web.services.rest;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import org.jboss.windup.web.services.ServerMode;

/**
 * This exception handler should handle all runtime exceptions.
 * It should prevent server from returning HTML Error page with stack trace and internals of error.
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Provider
public class UnhandledExceptionHandler implements ExceptionMapper<Exception>
{
    private static Logger LOG = Logger.getLogger(UnhandledExceptionHandler.class.getSimpleName());
    private final ExceptionHandler applicationExceptionHandler = new ExceptionHandler();

    @Override
    public Response toResponse(Exception exception)
    {
        Throwable cause = exception.getCause();
        if (cause == null)
            cause = exception;

        if (cause instanceof WebApplicationException)
            return this.applicationExceptionHandler.toResponse((WebApplicationException) cause);

        LOG.log(Level.SEVERE, cause.getMessage(), cause);

        ErrorInfo errorInfo;
        if (ServerMode.isProduction())
        {
            errorInfo = new ErrorInfo(Response.Status.INTERNAL_SERVER_ERROR.getReasonPhrase());

            if (null != findFirstOccurenceInExceptionChain(org.hibernate.exception.ConstraintViolationException.class, exception))
                errorInfo.setMessage("Database constraints were not met.");
            else if (null != findFirstOccurenceInExceptionChain("org.h2.jdbc.JdbcSQLException", exception))
                errorInfo.setMessage("Database error occurred.");
        }
        else
        {
            Throwable rootCause = exception;
            while (exception.getCause() != null)
                rootCause = exception.getCause();

            errorInfo = new ErrorInfo(cause.getMessage()).setOuterException(exception).setRootCause(rootCause);
        }

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errorInfo)
                    .type(MediaType.APPLICATION_JSON)
                    .build();
    }

    static final Throwable findFirstOccurenceInExceptionChain(Class<? extends Throwable> type, Throwable exception)
    {
        Throwable cause = exception;
        while (cause != null && type.isAssignableFrom(cause.getClass()))
            cause = exception.getCause();
        return cause;
    }

    static final Throwable findFirstOccurenceInExceptionChain(String typeName, Throwable exception)
    {
        Throwable cause = exception;
        while (cause != null && typeName.equals(cause.getClass().getName()))
            cause = exception.getCause();
        return cause;
    }
}
