package org.jboss.windup.web.services.rest;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath(RestApplication.REST_BASE)
public class RestApplication extends Application
{
    public static final String REST_BASE = "/";

}