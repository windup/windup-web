package org.jboss.windup.web.services.rest;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.config.LabelProvider;
import org.jboss.windup.config.metadata.Label;
import org.jboss.windup.web.services.model.LabelProviderEntity;
import org.jboss.windup.web.services.model.LabelsPath;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Provides Metadata regarding the {@link LabelProvider}s and {@link Label}s that are available within Windup.
 *
 * @author <a href="mailto:carlosthe19916@gmail.com">Carlos Feria</a>
 */
@Path("/labels")
@Consumes("application/json")
@Produces("application/json")
public interface LabelEndpoint
{
    /**
     * Returns a list of data about all of the providers and labels that are registered within the system.
     */
    @GET
    @Path("/allProviders")
    List<LabelProviderEntity> getAllProviders();

    @GET
    @Path("/by-labels-path/{id}")
    List<LabelProviderEntity> getByLabelsPath(@PathParam("id") Long labelsPathID);

    /**
     * Uploads new LabelProvider
     */
    @POST
    @Path("upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    LabelsPath uploadLabelProvider(MultipartFormDataInput data);

    /**
     * Uploads new LabelProvider
     */
    @POST
    @Path("upload/by-project/{projectId}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    LabelsPath uploadLabelProviderByProject(@PathParam("projectId") Long projectId, MultipartFormDataInput data);

    @DELETE
    @Path("/by-labels-path/{id}")
    void deleteLabelProvider(@PathParam("id") Long labelsPathID);

    @GET
    @Path("/is-used-labels-path/{id}")
    Boolean isLabelsPathUsed(@PathParam("id") Long labelsPathID);
}
