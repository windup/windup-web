package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.addons.websupport.rest.MyRESTAPI;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;

import javax.inject.Inject;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@ApplicationPath(RestApplicationFurnace.REST_BASE)
public class RestApplicationFurnace extends Application {
    public static final String REST_BASE = "/rest-furnace";

    @Inject
    @FromFurnace
    private MyRESTAPI myRESTAPI;

    @Override
    public Set<Object> getSingletons()
    {
        Set<Object> singletons = new HashSet<>(super.getSingletons());
        singletons.add(myRESTAPI);
        return singletons;
    }
}
