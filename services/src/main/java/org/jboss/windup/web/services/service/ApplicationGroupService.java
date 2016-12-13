package org.jboss.windup.web.services.service;

import org.jboss.windup.web.services.model.ApplicationGroup;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class ApplicationGroupService
{
    @PersistenceContext
    private EntityManager entityManager;

    public ApplicationGroup getApplicationGroup(Long groupID)
    {
        ApplicationGroup applicationGroup = this.entityManager.find(ApplicationGroup.class, groupID);

        if (applicationGroup == null)
        {
            throw new NotFoundException("ApplicationGroup with id: " + groupID + " not found");
        }

        return applicationGroup;
    }
}
