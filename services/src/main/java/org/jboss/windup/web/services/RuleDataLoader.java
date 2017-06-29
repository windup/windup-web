package org.jboss.windup.web.services;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.jboss.windup.config.RuleProvider;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.RuleProviderMetadata;
import org.jboss.windup.config.metadata.RuleProviderRegistry;
import org.jboss.windup.config.metadata.TechnologyReference;
import org.jboss.windup.config.phase.MigrationRulesPhase;
import org.jboss.windup.web.addons.websupport.services.IssueCategoryProviderService;
import org.jboss.windup.web.addons.websupport.services.RuleFormatterService;
import org.jboss.windup.web.addons.websupport.services.RuleProviderService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.Category;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.RuleEntity;
import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.Technology;
import org.jboss.windup.web.services.service.ConfigurationService;
import org.jboss.windup.web.services.service.TechnologyService;
import org.ocpsoft.rewrite.config.Rule;


/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
@Startup
public class RuleDataLoader
{
    private static Logger LOG = Logger.getLogger(RuleDataLoader.class.getName());

    // Copied from XMLRuleProviderLoader.
    private static final String XML_RULES_WINDUP_EXTENSION = "windup.xml";
    private static final String XML_RULES_RHAMT_EXTENSION = "rhamt.xml";

    @PersistenceContext
    private EntityManager entityManager;

//    @Resource
//    private UserTransaction userTransaction;

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private TechnologyService technologyService;

    @Inject
    @FromFurnace
    private RuleProviderService ruleProviderService;

    @Inject
    @FromFurnace
    private IssueCategoryProviderService issueCategoryProviderService;

    @Inject
    @FromFurnace
    private RuleFormatterService ruleFormatterService;

    /// =====================
    /// TODO - enable when the PR is ready!!!
    /// @Schedule(hour = "*", minute = "12")
    /// =====================
    public void loadPeriodically()
    {
        Configuration webConfiguration = configurationService.getConfiguration();
        reloadRuleData(webConfiguration);
        this.cleanupDanglingRows();
    }

    public void configurationUpdated(@Observes Configuration configuration)
    {
        LOG.info("Reloading rule data due to configuration update!");
        reloadRuleData(configuration);
    }

    public void reloadRuleData(Configuration configuration)
    {
        LOG.info("Starting reload of rule data...");
        try
        {
            this.loadRules(configuration);
        }
        catch (Exception e)
        {
            LOG.log(Level.SEVERE, "Error loading rules due to: " + e.getMessage(), e);
        }
        this.getCategories();
        LOG.info("Rule data reload complete!");
    }

    private void loadRules(Configuration webConfiguration)
    {
        this.begin();
        try
        {
            Set<RulesPath> rulesPaths = webConfiguration.getRulesPaths();
            if (rulesPaths == null || rulesPaths.isEmpty())
                return;

            // Expand the directories which are non-recursive into individual paths.
            // This is kind of hack. It should rather be in individual RuleProviderLoader's.
            // But for UI (where this class is), we only support XML rules anyway.
            final Set<RulesPath> rulesPaths2 = new HashSet<>();
            Iterator<RulesPath> it = rulesPaths.iterator();
            while( it.hasNext() ){
                RulesPath rulesPath = it.next();
                File file = FileUtils.getFile(rulesPath.getPath());
                if (file.isDirectory() && !rulesPath.isScanRecursively()) {
                    final Collection<File> filesInThisDir = FileUtils.listFiles(file, new String[]{XML_RULES_WINDUP_EXTENSION, XML_RULES_RHAMT_EXTENSION}, false);
                    filesInThisDir.stream().forEach(
                        xmlFile -> {
                            // Check if there is an existing one.
                            List<RulesPath> existing = entityManager.createQuery("FROM RulesPath rp WHERE rp.path = :path", RulesPath.class).setParameter("path", file.getAbsolutePath()).getResultList();
                            if (existing.size() > 0)
                            {
                                LOG.info("RulePath already existed for: " + file.getAbsolutePath());
                                Iterator<RulesPath> itDuplicates = existing.iterator();
                                rulesPaths2.add(itDuplicates.next());
                                while (itDuplicates.hasNext())
                                    entityManager.remove(itDuplicates.next());
                            }
                            else
                            {
                                // Create if not.
                                LOG.info("RulePath created for: " + file.getAbsolutePath());
                                RulesPath replacement = new RulesPath();
                                replacement.setScanRecursively(false);
                                replacement.setPath(xmlFile.getPath());
                                replacement.setShortPath(rulesPath.getShortPath());
                                replacement.setRulesPathType(rulesPath.getRulesPathType());
                                replacement.setRegistrationType(rulesPath.getRegistrationType());
                                entityManager.persist(replacement);
                                rulesPaths2.add(replacement);
                            }
                        }
                    );
                    entityManager.remove(rulesPath);
                    LOG.info("Replaced path to scan non-recursively" + rulesPath.getPath() + "\n   with " + filesInThisDir.size() + " directly contained XML rule providers.");
                }
                else
                    rulesPaths2.add(rulesPath);
            }
            rulesPaths = rulesPaths2;

            for (RulesPath rulesPath : rulesPaths)
            {
                /*
                 * Do not reload system rules if we have already loaded them
                 */
                if (rulesPath.getRulesPathType() == RulesPath.RulesPathType.SYSTEM_PROVIDED)
                {
                    Long count = entityManager
                            .createQuery("SELECT COUNT(rpe) FROM RuleProviderEntity rpe WHERE rpe.rulesPath = :rulesPath", Long.class)
                            .setParameter("rulesPath", rulesPath)
                            .getSingleResult();
                    if (count > 0)
                        continue;
                }

                LOG.info("Purging existing rule data for: " + rulesPath);
                // Delete the previous RuleProviderEntity's
                deleteRuleProviderEntitiesOf(rulesPath);

                // do not process again failed rulesPath
                if (rulesPath.getLoadError() != null)
                    continue;

                rulesPath.setLoadError(null);
                try
                {
                    Path path = Paths.get(rulesPath.getPath());
                    RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(Collections.singleton(path), null);
                    boolean fileRulesOnly = rulesPath.getRulesPathType() == RulesPath.RulesPathType.USER_PROVIDED;

                    RuleProviderRegistry providerRegistry =
                            ruleProviderService.loadRuleProviderRegistry(Collections.singleton(path), fileRulesOnly, rulesPath.isScanRecursively());
                    LOG.info("\nProviders for: " + path + "\n  are \n    "
                            + StringUtils.join(providerRegistry.getProviders(), "\n    "));

                    for (RuleProvider provider : providerRegistry.getProviders())
                    {
                        RuleProviderMetadata ruleProviderMetadata = provider.getMetadata();

                        String providerID = ruleProviderMetadata.getID();
                        String origin = ruleProviderMetadata.getOrigin();
                        RuleProviderEntity.RuleProviderType ruleProviderType = getProviderType(origin);

                        // Skip user provided Java based rules.
                        if (rulesPath.getRulesPathType() == RulesPath.RulesPathType.USER_PROVIDED &&
                                    ruleProviderType == RuleProviderEntity.RuleProviderType.JAVA)
                            continue;

                        RuleProviderEntity ruleProviderEntity = new RuleProviderEntity();
                        ruleProviderEntity.setProviderID(providerID);
                        ruleProviderEntity.setDateLoaded(new GregorianCalendar());
                        ruleProviderEntity.setDescription(ruleProviderMetadata.getDescription());
                        ruleProviderEntity.setOrigin(origin);
                        ruleProviderEntity.setRulesPath(rulesPath);
                        entityManager.persist(ruleProviderEntity);

                        setFileMetaData(ruleProviderEntity);

                        ruleProviderEntity.setSources(technologyReferencesToTechnologyList(ruleProviderMetadata.getSourceTechnologies()));
                        ruleProviderEntity.setTargets(technologyReferencesToTechnologyList(ruleProviderMetadata.getTargetTechnologies()));

                        String phase = MigrationRulesPhase.class.getSimpleName().toUpperCase();
                        if (ruleProviderMetadata.getPhase() != null)
                            phase = ruleProviderMetadata.getPhase().getSimpleName().toUpperCase();

                        ruleProviderEntity.setPhase(phase);

                        ruleProviderEntity.setRuleProviderType(ruleProviderType);

                        List<RuleEntity> ruleEntities = new ArrayList<>();

                        for (Rule rule : provider.getConfiguration(ruleLoaderContext).getRules())
                        {
                            String ruleID = rule.getId();
                            String ruleString = this.ruleFormatterService.ruleToRuleContentsString(rule);

                            RuleEntity ruleEntity = new RuleEntity();
                            ruleEntity.setRuleID(ruleID);
                            ruleEntity.setRuleContents(ruleString);
                            ruleEntities.add(ruleEntity);
                        }

                        ruleProviderEntity.setRules(ruleEntities);

                        entityManager.persist(ruleProviderEntity);
                    }
                }
                catch (Exception e)
                {
                    rulesPath.setLoadError("Failed to load rules due to: " + e.getMessage());
                    LOG.log(Level.SEVERE, "Could not load rule information due to: " + e.getMessage(), e);
                }
            }
        }
        finally
        {
            this.commit();
        }
    }

    private void deleteRuleProviderEntitiesOf(RulesPath rulesPath)
    {
        entityManager
                .createNamedQuery(RuleProviderEntity.DELETE_BY_RULES_PATH)
                .setParameter(RuleProviderEntity.RULES_PATH_PARAM, rulesPath)
                .executeUpdate();
    }

    /**
     * Clean up any stale rows (dangling rows from reloading rules).
     */
    private void cleanupDanglingRows()
    {
        try
        {
            this.begin();
            this.entityManager.createNamedQuery(RuleProviderEntity.DELETE_WITH_NULL_RULES_PATH).executeUpdate();
            this.commit();

            this.begin();
            // Remove RuleEntity's which is not contained in any RuleProviderEntity.
            for (RuleEntity ruleEntity : this.entityManager.createQuery("SELECT re FROM RuleEntity re", RuleEntity.class).getResultList())
            {
                long ruleProviderCount = this.entityManager
                            .createQuery("SELECT COUNT(rpe) FROM RuleProviderEntity rpe WHERE :ruleEntity MEMBER OF rpe.rules", Long.class)
                            .setParameter("ruleEntity", ruleEntity)
                            .getSingleResult();
                if (ruleProviderCount == 0)
                {
                    this.entityManager.remove(ruleEntity);
                }
            }
        }
        catch (Throwable t)
        {
            LOG.warning("Rule provider data cleanup failed due to: " + t.getMessage());
        }
        finally
        {
            this.commit();
        }
    }

    private Collection<Category> getCategories()
    {
        this.begin();
        try
        {
            List<Category> existingCategoriesList = this.entityManager.createQuery("SELECT c FROM Category c", Category.class)
                        .getResultList();

            Set<String> existingCategoriesAsString = existingCategoriesList.stream()
                        .map(Category::getName)
                        .collect(Collectors.toSet());

            Map<String, Integer> categoriesWithPriority = this.issueCategoryProviderService.getCategoriesWithPriority();

            List<Category> categories = categoriesWithPriority
                        .entrySet().stream()
                        .filter(category -> !existingCategoriesAsString.contains(category.getKey()))
                        .map(category -> new Category(category.getKey(), category.getValue()))
                        .collect(Collectors.toList());

            categories.forEach(category -> this.entityManager.persist(category));

            return categories;
        }
        finally
        {
            this.commit();
        }
    }

    private Set<Technology> technologyReferencesToTechnologyList(Collection<TechnologyReference> technologyReferences)
    {
        Set<Technology> results = new HashSet<>();
        for (TechnologyReference technologyReference : technologyReferences)
        {
            Technology technology = technologyService.getOrCreate(technologyReference.getId(), technologyReference.getVersionRangeAsString());
            results.add(technology);
        }

        return results;
    }

    private void setFileMetaData(RuleProviderEntity ruleProviderEntity)
    {
        if (ruleProviderEntity.getOrigin() == null)
            return;

        try
        {
            String filePathString = ruleProviderEntity.getOrigin();

            if (filePathString.startsWith("file:"))
                filePathString = filePathString.substring(5);

            Path filePath = Paths.get(filePathString);
            if (!Files.isRegularFile(filePath))
                return;

            FileTime lastModifiedTime = Files.getLastModifiedTime(Paths.get(filePathString));
            GregorianCalendar lastModifiedCalendar = new GregorianCalendar();
            lastModifiedCalendar.setTimeInMillis(lastModifiedTime.toMillis());
            ruleProviderEntity.setDateModified(lastModifiedCalendar);

            if (ruleProviderEntity.getRulesPath() != null)
            {
                filePath = Paths.get(ruleProviderEntity.getRulesPath().getPath()).relativize(Paths.get(filePathString));
                ruleProviderEntity.setOrigin(filePath.toString());
            }
        }
        catch (Exception e)
        {
            // not a file path... ignore
        }
    }

    private RuleProviderEntity.RuleProviderType getProviderType(String origin)
    {
        if (origin == null)
            return RuleProviderEntity.RuleProviderType.JAVA;
        else if (origin.startsWith("file:") && origin.endsWith(".windup.xml"))
            return RuleProviderEntity.RuleProviderType.XML;
        else if (origin.startsWith("file:") && origin.endsWith(".windup.groovy"))
            return RuleProviderEntity.RuleProviderType.GROOVY;
        else
            return RuleProviderEntity.RuleProviderType.JAVA;
    }

    private void begin()
    {
//        try
//        {
//            this.userTransaction.begin();
//        }
//        catch (Exception e)
//        {
//            throw new RuntimeException(e);
//        }
    }

    private void commit()
    {
//        try
//        {
//            this.userTransaction.commit();
//        }
//        catch (Exception e)
//        {
//            throw new RuntimeException(e);
//        }
    }
}
