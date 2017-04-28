package org.jboss.windup.web.services.service;

import java.util.GregorianCalendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.jboss.windup.web.services.model.WindupSchemaVersion;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
@Startup
public class WindupSchemaVersionManager
{
    public static int CURRENT_VERSION = 1;
    private static Logger LOG = Logger.getLogger(WindupSchemaVersionManager.class.getName());

    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    public void upgrade()
    {
        WindupSchemaVersion currentVersion = getCurrentVersion();
        try
        {
            if (currentVersion == null)
            {
                currentVersion = migrateFromNullToVersion1();
            }
        }
        catch (Exception e)
        {
            LOG.log(Level.SEVERE, "Error, unable to migrate schema versions... database functions may have issues.", e);
        }
    }

    private WindupSchemaVersion migrateFromNullToVersion1()
    {
        LOG.info("Migrating database from unversioned state, to version 1");
        /*
         * Old versions sometimes filled this with extraneous bad data.
         *
         * Purge all of it here.
         */
        this.entityManager.createQuery("delete from RuleProviderEntity ").executeUpdate();
        this.entityManager.createQuery("delete from RuleEntity").executeUpdate();

        WindupSchemaVersion newVersion = new WindupSchemaVersion();
        newVersion.setSchemaVersion(1);
        newVersion.setDateModified(new GregorianCalendar());
        entityManager.persist(newVersion);

        LOG.info("Migration complete");

        return newVersion;
    }

    private WindupSchemaVersion getCurrentVersion()
    {
        /*
         * There should be only one, but if there are more than one, then make sure to get the latest and purge any older ones.
         */
        List<WindupSchemaVersion> versions = this.entityManager
                    .createQuery("select wsv from WindupSchemaVersion wsv order by wsv.schemaVersion desc", WindupSchemaVersion.class)
                    .getResultList();
        WindupSchemaVersion current = versions.isEmpty() ? null : versions.get(0);

        // Remove the previous ones
        versions.stream().skip(1).forEach(version -> this.entityManager.remove(version));
        return current;
    }
}
