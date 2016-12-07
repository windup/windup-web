package org.jboss.windup.web.services.rest;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

/**
 * This exception handler should handle all runtime exceptions.
 * It should prevent server from returning HTML Error page with stack trace and internals of error.
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Provider
public class UnhandledExceptionHandler implements ExceptionMapper<RuntimeException>
{
    private ExceptionHandler applicationExceptionHandler = new ExceptionHandler();

    @Override
    public Response toResponse(RuntimeException exception)
    {
        Throwable cause = exception.getCause();

        if (cause instanceof WebApplicationException)
        {
            return this.applicationExceptionHandler.toResponse((WebApplicationException) cause);
        }

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorMessage(Response.Status.INTERNAL_SERVER_ERROR.getReasonPhrase()))
                    .type(MediaType.APPLICATION_JSON)
                    .build();
    }
}
