package org.jboss.windup.web.services.rest;

import javax.ws.rs.core.Application;
import javax.ws.rs.ApplicationPath;

@ApplicationPath(RestApplication.REST_BASE)
public class RestApplication extends Application
{
    public static final String REST_BASE = "/rest";
}