package org.jboss.windup.web.services.rest;

import javax.ws.rs.WebApplicationException;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class WindupWebException extends WebApplicationException
{
    protected int code;

    public WindupWebException(WebApplicationException exception, int code)
    {
        super(exception.getMessage(), exception.getResponse().getStatus());
        this.code = code;
    }

    public int getCode()
    {
        return code;
    }
}
