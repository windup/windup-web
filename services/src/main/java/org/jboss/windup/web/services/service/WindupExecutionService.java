package org.jboss.windup.web.services.service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.model.WindupExecution;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class WindupExecutionService
{
    @PersistenceContext
    private EntityManager entityManager;

    public WindupExecution get(Long id)
    {
        WindupExecution execution = this.entityManager.find(WindupExecution.class, id);

        if (execution == null)
        {
            throw new NotFoundException("Execution with id " + id + " does not exist");
        }

        return execution;
    }
}
