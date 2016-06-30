package org.jboss.windup.web.services.rest;

import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.service.Service;
import org.jboss.windup.web.addons.websupport.model.ApplicationGroupModel;
import org.jboss.windup.web.services.dto.ApplicationGroupDto;
import org.jboss.windup.web.services.dto.RegisteredApplicationDto;
import org.jboss.windup.web.services.producer.WindupServicesProducer;

import com.google.common.collect.Iterables;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class ApplicationGroupEndpointImpl implements ApplicationGroupEndpoint
{
    private static Logger LOG = Logger.getLogger(ApplicationGroupEndpointImpl.class.getName());

    @Inject
    private WindupServicesProducer producer;

    @Override
    public ApplicationGroupDto register(String name)
    {
        LOG.info("Creating group with name: " + name);
        ApplicationGroupModel model = getService().create();
        model.setName(name);
        commit();
        return new ApplicationGroupDto(model);
    }

    @Override
    public ApplicationGroupDto get(Integer id)
    {
        LOG.info("Should retrieve model with id: " + id);
        ApplicationGroupModel model = getService().getById(id);
        LOG.info("Retrieved model: " + model);

        Iterable<RegisteredApplicationDto> applicationDtos = Iterables.transform(model.getApplications(),
                                                                        (app) -> new RegisteredApplicationDto(app));

        return new ApplicationGroupDto(model, applicationDtos);
    }

    @Override
    public void update(ApplicationGroupDto model)
    {
        return;
    }

    private Service<ApplicationGroupModel> getService()
    {
        return getGlobalGraphContext().service(ApplicationGroupModel.class);
    }

    private GraphContext getGlobalGraphContext()
    {
        return producer.getGlobalGraphContext();
    }

    private void commit()
    {
        getGlobalGraphContext().commit();
    }
}
