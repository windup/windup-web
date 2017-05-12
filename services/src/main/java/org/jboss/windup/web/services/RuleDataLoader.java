package org.jboss.windup.web.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.UserTransaction;

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

    @Schedule(hour = "*", minute = "12")
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
            if (webConfiguration.getRulesPaths() == null || webConfiguration.getRulesPaths().isEmpty())
                return;

            for (RulesPath rulesPath : webConfiguration.getRulesPaths())
            {
                /*
                 * Do not reload system rules if we have already loaded them
                 */
                if (rulesPath.getRulesPathType() == RulesPath.RulesPathType.SYSTEM_PROVIDED)
                {
                    Long count = entityManager
                            .createQuery("select count(rpe) from RuleProviderEntity rpe where rpe.rulesPath = :rulesPath", Long.class)
                            .setParameter("rulesPath", rulesPath)
                            .getSingleResult();
                    if (count > 0)
                        continue;
                }
                LOG.info("Purging existing rule data for: " + rulesPath);

                logCurrentEntityCounts("1");
                {
                    // Delete the previous providers from that path
                    List<RuleProviderEntity> providers = entityManager.createNamedQuery(RuleProviderEntity.SELECT_BY_RULES_PATH, RuleProviderEntity.class)
                            .setParameter(RuleProviderEntity.RULES_PATH_PARAM, rulesPath)
                            .getResultList();
                    for(RuleProviderEntity provider : providers)
                        entityManager.remove(provider);
                    LOG.info(RuleProviderEntity.SELECT_BY_RULES_PATH + " purged RuleProviderEntity count: " + providers.size());
                }
                logCurrentEntityCounts("2");
                {
                    // Delete the previous rule providers with no path
                    List<RuleProviderEntity> providers = entityManager.createNamedQuery(RuleProviderEntity.SELECT_WITH_NULL_RULES_PATH, RuleProviderEntity.class)
                            .getResultList();
                    for(RuleProviderEntity provider : providers)
                        entityManager.remove(provider);
                    LOG.info(RuleProviderEntity.SELECT_WITH_NULL_RULES_PATH + " purged RuleProviderEntity count: " + providers.size());
                }
                logCurrentEntityCounts("3");

                rulesPath.setLoadError(null);
                try
                {
                    Path path = Paths.get(rulesPath.getPath());
                    RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(Collections.singleton(path), null);
                    boolean fileRulesOnly = rulesPath.getRulesPathType() == RulesPath.RulesPathType.USER_PROVIDED;

                    RuleProviderRegistry providerRegistry = ruleProviderService.loadRuleProviderRegistry(Collections.singleton(path), fileRulesOnly);
                    LOG.info("Providers for: " + path + " are " + providerRegistry.getProviders());

                    for (RuleProvider provider : providerRegistry.getProviders())
                    {
                        RuleProviderMetadata ruleProviderMetadata = provider.getMetadata();

                        String providerID = ruleProviderMetadata.getID();
                        String origin = ruleProviderMetadata.getOrigin();
                        RuleProviderEntity.RuleProviderType ruleProviderType = getProviderType(origin);

                        // Skip user provided rules that are
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
            for (RuleEntity ruleEntity : this.entityManager.createQuery("select re from RuleEntity re", RuleEntity.class).getResultList())
            {
                long ruleProviderCount = this.entityManager
                            .createQuery("select count(rpe) from RuleProviderEntity rpe where :ruleEntity member of rpe.rules", Long.class)
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

    /**
     * Debug purposes.
     */
    private void logCurrentEntityCounts(String logLabel)
    {
        Long rpeCount = entityManager.createQuery("SELECT COUNT(*) FROM RuleProviderEntity", Long.class).getSingleResult();
        Long reCount =  entityManager.createQuery("SELECT COUNT(*) FROM RuleEntity", Long.class).getSingleResult();
        LOG.fine(String.format("%s RuleProviderEntity: %d, RuleEntity: %d", logLabel, rpeCount, reCount));
    }
}
