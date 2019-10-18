package org.jboss.windup.web.services.rest;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.config.RuleProvider;
import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.jboss.windup.web.services.model.RulesPath;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Provides Metadata regarding the {@link RuleProvider}s and {@link Rule}s that are available within Windup.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("/rules")
@Consumes("application/json")
@Produces("application/json")
public interface RuleEndpoint
{
    /**
     * Returns a list of data about all of the providers and rules that are registered within the system.
     */
    @GET
    @Path("/allProviders")
    List<RuleProviderEntity> getAllProviders();

    @GET
    @Path("/by-rules-path/{id}")
    List<RuleProviderEntity> getByRulesPath(@PathParam("id") Long rulesPathID);

    /**
     * Uploads new RuleProvider
     */
    @POST
    @Path("upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    RulesPath uploadRuleProvider(MultipartFormDataInput data);

    /**
     * Uploads new RuleProvider
     */
    @POST
    @Path("upload/by-project/{projectId}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    RulesPath uploadRuleProviderByProject(@PathParam("projectId") Long projectId, MultipartFormDataInput data);


    @DELETE
    @Path("/by-rules-path/{id}")
    void deleteRuleProvider(@PathParam("id") Long rulesPathID);
    
    @GET
    @Path("/is-used-rules-path/{id}")
    Boolean isRulesPathUsed(@PathParam("id") Long rulesPathID);
}
