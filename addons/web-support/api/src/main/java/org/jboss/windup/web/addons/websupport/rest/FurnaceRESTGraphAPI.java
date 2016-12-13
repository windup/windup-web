package org.jboss.windup.web.addons.websupport.rest;

import org.jboss.windup.web.addons.websupport.services.ReportFilterService;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;

/**
 * This interface provides a way to set a {@link GraphPathLookup} on each service.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface FurnaceRESTGraphAPI
{
    /**
     * Sets the URI info from JAX-RS.
     */
    @Context
    void setUriInfo(UriInfo uriInfo);

    /**
     * Provides this service with an implementation of {@link GraphPathLookup}.
     */
    void setGraphPathLookup(GraphPathLookup graphPathLookup);

    /**
     * Provides this service with an implementation of {@link ReportFilterService}
     */
    void setReportFilterService(ReportFilterService reportFilterService);
}
