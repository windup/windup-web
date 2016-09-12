package org.jboss.windup.web.services.rest.exmapper;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;


/**
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Provider
public class NotFoundMapper implements ExceptionMapper<NotFoundException>
{
    public Response toResponse(NotFoundException ex)
    {
        return Response.status(404).entity(ex.getMessage()).header("WindupError", ex.getMessage()).build();
    }
}