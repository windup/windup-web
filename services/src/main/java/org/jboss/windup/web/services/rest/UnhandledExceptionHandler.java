package org.jboss.windup.web.services.rest;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.util.logging.Logger;

/**
 * This exception handler should handle all runtime exceptions.
 * It should prevent server from returning HTML Error page with stack trace and internals of error.
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Provider
public class UnhandledExceptionHandler implements ExceptionMapper<RuntimeException>
{
    private static Logger LOG = Logger.getLogger(UnhandledExceptionHandler.class.getSimpleName());

    public enum ServerMode {
        DEV,
        PROD
    }

    private final String SERVER_MODE_ENV_VARIABLE = "SERVER_MODE";

    private ExceptionHandler applicationExceptionHandler = new ExceptionHandler();

    @Override
    public Response toResponse(RuntimeException exception)
    {
        Throwable cause = exception.getCause();

        if (cause instanceof WebApplicationException)
        {
            return this.applicationExceptionHandler.toResponse((WebApplicationException) cause);
        }

        String responseBody;

        if (this.getServerMode() == ServerMode.DEV) {
            responseBody = cause.getMessage();
        } else {
            responseBody = Response.Status.INTERNAL_SERVER_ERROR.getReasonPhrase();
        }

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorMessage(responseBody))
                    .type(MediaType.APPLICATION_JSON)
                    .build();
    }

    protected ServerMode getServerMode() {
        ServerMode modeEnum = ServerMode.PROD;

        if (System.getenv().containsKey(SERVER_MODE_ENV_VARIABLE)) {
            String modeAsString = System.getenv(SERVER_MODE_ENV_VARIABLE);

            try {
                modeEnum = ServerMode.valueOf(modeAsString);
            } catch (IllegalArgumentException e) {
                LOG.warning(e.getMessage());
            }
        }

        return modeEnum;
    }
}
