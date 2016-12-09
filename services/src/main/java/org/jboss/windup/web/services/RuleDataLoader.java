package org.jboss.windup.web.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
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

import org.jboss.windup.config.RuleProvider;
import org.jboss.windup.config.RuleUtils;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.RuleProviderMetadata;
import org.jboss.windup.config.metadata.RuleProviderRegistry;
import org.jboss.windup.config.metadata.TechnologyReference;
import org.jboss.windup.config.phase.MigrationRulesPhase;
import org.jboss.windup.web.addons.websupport.services.IssueCategoryProviderService;
import org.jboss.windup.web.addons.websupport.services.RuleProviderService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.Category;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.RuleEntity;
import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.Tag;
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

    @Schedule(hour = "*", minute = "12")
    public void loadPeriodically()
    {
        reloadRuleData();
        getCategories();
    }

    public void configurationUpdated(@Observes Configuration configuration)
    {
        LOG.info("Reloading rule data due to configuration update!");
        reloadRuleData();
        getCategories();
    }

    public void reloadRuleData()
    {
        LOG.info("Loading all rule data...");
        Configuration webConfiguration = configurationService.getConfiguration();
        if (webConfiguration.getRulesPaths() == null || webConfiguration.getRulesPaths().isEmpty())
            return;

        for (RulesPath rulesPath : webConfiguration.getRulesPaths())
        {
            LOG.info("Purging existing rule data for: " + rulesPath);
            // Delete the previous ones
            entityManager
                        .createNamedQuery(RuleProviderEntity.DELETE_BY_RULES_PATH)
                        .setParameter(RuleProviderEntity.RULES_PATH_PARAM, rulesPath)
                        .executeUpdate();

            rulesPath.setLoadError(null);
            try
            {
                Path path = Paths.get(rulesPath.getPath());
                RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(Collections.singleton(path), null);
                RuleProviderRegistry providerRegistry = ruleProviderService.loadRuleProviderRegistry(Collections.singleton(path));

                HashMap<String, Tag> tagHashMap = new HashMap<>();

                for (RuleProvider provider : providerRegistry.getProviders())
                {
                    RuleProviderMetadata ruleProviderMetadata = provider.getMetadata();

                    String providerID = ruleProviderMetadata.getID();
                    String origin = ruleProviderMetadata.getOrigin();

                    RuleProviderEntity ruleProviderEntity = new RuleProviderEntity();
                    ruleProviderEntity.setProviderID(providerID);
                    ruleProviderEntity.setDateLoaded(new GregorianCalendar());
                    ruleProviderEntity.setDescription(ruleProviderMetadata.getDescription());
                    ruleProviderEntity.setOrigin(origin);
                    ruleProviderEntity.setTags(this.getTags(ruleProviderMetadata.getTags(), tagHashMap));
                    entityManager.persist(ruleProviderEntity);

                    setFileMetaData(rulesPath, ruleProviderEntity);

                    ruleProviderEntity.setSources(technologyReferencesToTechnologyList(ruleProviderMetadata.getSourceTechnologies()));
                    ruleProviderEntity.setTargets(technologyReferencesToTechnologyList(ruleProviderMetadata.getTargetTechnologies()));

                    String phase = MigrationRulesPhase.class.getSimpleName().toUpperCase();
                    if (ruleProviderMetadata.getPhase() != null)
                        phase = ruleProviderMetadata.getPhase().getSimpleName().toUpperCase();

                    ruleProviderEntity.setPhase(phase);

                    ruleProviderEntity.setRuleProviderType(getProviderType(origin));

                    List<RuleEntity> ruleEntities = new ArrayList<>();

                    for (Rule rule : provider.getConfiguration(ruleLoaderContext).getRules())
                    {
                        String ruleID = rule.getId();
                        String ruleString = RuleUtils.ruleToRuleContentsString(rule, 0);

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

    private Collection<Category> getCategories()
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

    private Set<Tag> getTags(Collection<String> stringTags, HashMap<String, Tag> tagHashMap)
    {
        Set<Tag> resultTags = new HashSet<>();

        for (String tag : stringTags)
        {
            if (!tagHashMap.containsKey(tag))
            {
                Tag tagEntity = new Tag(tag);
                tagHashMap.put(tag, tagEntity);

                this.entityManager.persist(tagEntity);
            }

            resultTags.add(tagHashMap.get(tag));
        }

        return resultTags;
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

    private void setFileMetaData(RulesPath rulesPath, RuleProviderEntity ruleProviderEntity)
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

                // Now also find it in the user defined paths
                ruleProviderEntity.setRulesPath(rulesPath);

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
}
