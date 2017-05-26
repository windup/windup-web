package org.jboss.windup.web.services.rest;

import javax.ws.rs.WebApplicationException;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class FileAlreadyExistsException extends WindupWebException
{
    public static final int ERROR_CODE = 1;

    public FileAlreadyExistsException(WebApplicationException exception)
    {
        super(exception, ERROR_CODE);
    }
}
