package org.jboss.windup.web.addons.websupport.rest;

import javax.ws.rs.core.Response;
import org.apache.commons.lang3.StringEscapeUtils;

/**
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public class RestUtil {
    public static String formatErrorJson(String msg)
    {
        return "{ \"error\": \"" + StringEscapeUtils.escapeJson(msg) + "\" }";
    }

    public static Response createErrorResponse(Response.Status status, final String msg)
    {
        return Response.status(status).entity(msg).header("X-Windup-Error", msg).build();
    }

}
