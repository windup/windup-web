package org.jboss.windup.web.services.rest;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class ExceptionHandler implements ExceptionMapper<WebApplicationException>
{
    @Override
    public Response toResponse(WebApplicationException exception)
    {
        Response.ResponseBuilder responseBuilder = Response.status(exception.getResponse().getStatus())
                    .type(MediaType.APPLICATION_JSON);

        if (exception instanceof WindupWebException)
        {
            responseBuilder.entity(new ErrorInfo(exception.getMessage(), ((WindupWebException) exception).getCode()));
        }
        else
        {
            responseBuilder.entity(new ErrorInfo(exception));
        }

        return responseBuilder.build();
    }
}
