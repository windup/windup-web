package org.jboss.windup.web.services.service;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import org.jboss.windup.web.services.model.Configuration;

/**
 * Contains the global configuration for Windup server.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class ConfigurationService
{
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Gets the global configuration for Windup.
     */
    public Configuration getConfiguration()
    {
        try
        {
            return (Configuration) entityManager.createQuery("select configuration from Configuration configuration").getSingleResult();
        }
        catch (NoResultException t)
        {
            return null;
        }
    }
}
