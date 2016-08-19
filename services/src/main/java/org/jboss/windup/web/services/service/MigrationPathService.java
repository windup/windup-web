package org.jboss.windup.web.services.service;


import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.jboss.windup.web.services.model.MigrationPath;
import org.jboss.windup.web.services.model.Technology;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Contains methods for managing {@link MigrationPath}s within Windup.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
@Startup
public class MigrationPathService
{
    public static final String CONFIG_XML_PATH = "/migration-paths/migration-paths.xml";

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private TechnologyService technologyService;

    @PostConstruct
    public void init()
    {
        // Get all from the DB
        @SuppressWarnings("unchecked")
        Collection<MigrationPath> fromDBList = findAll();


        // Load the ones from the xml file
        Collection<MigrationPath> fromConfigurationList = loadFromConfiguration();

        // Merge any into the DB that don't already exist there
        for (MigrationPath fromConfiguration : fromConfigurationList)
        {
            if (!fromDBList.contains(fromConfiguration))
                entityManager.persist(fromConfiguration);
        }
    }

    /**
     * Returns all entries of {@link MigrationPath} from the database.
     */
    public Collection<MigrationPath> findAll()
    {
        return entityManager.createNamedQuery(MigrationPath.FIND_ALL).getResultList();
    }

    private Collection<MigrationPath> loadFromConfiguration()
    {
        try (InputStream configIS = getClass().getResourceAsStream(CONFIG_XML_PATH))
        {
            List<MigrationPath> results = new ArrayList<>();

            SAXReader saxReader = new SAXReader();
            Document document = saxReader.read(configIS);
            for (Element element : (List<Element>)document.getRootElement().elements("path"))
            {
                Long id = Long.parseLong(element.attribute("id").getValue());
                String name = element.element("name").getText();

                Element sourceElement = element.element("source");
                Technology source = technologyService.getOrCreate(sourceElement);

                Element targetElement = element.element("target");
                Technology target = technologyService.getOrCreate(targetElement);

                MigrationPath migrationPath = new MigrationPath();
                migrationPath.setId(id);
                migrationPath.setName(name);
                migrationPath.setSource(source);
                migrationPath.setTarget(target);

                results.add(migrationPath);
            }
            return results;
        } catch (IOException | DocumentException e)
        {
            throw new RuntimeException("Could not load path configuration due to: " + e.getMessage());
        }
    }
}
