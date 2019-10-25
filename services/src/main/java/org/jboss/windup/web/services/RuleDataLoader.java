package org.jboss.windup.web.services;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.AccessTimeout;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.io.FileUtils;
import org.jboss.windup.config.LabelProvider;
import org.jboss.windup.config.RuleProvider;
import org.jboss.windup.config.loader.LabelProviderLoader;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.*;
import org.jboss.windup.config.phase.MigrationRulesPhase;
import org.jboss.windup.web.addons.websupport.services.IssueCategoryProviderService;
import org.jboss.windup.web.addons.websupport.services.LabelProviderService;
import org.jboss.windup.web.addons.websupport.services.RuleFormatterService;
import org.jboss.windup.web.addons.websupport.services.RuleProviderService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.*;
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
    private static final String XML_RULES_WINDUP_EXTENSION = "windup.xml";
    private static final String XML_RULES_RHAMT_EXTENSION = "rhamt.xml";
    private static final String[] SUPPORTED_RULE_EXTENSIONS = {
                XML_RULES_WINDUP_EXTENSION,
                XML_RULES_RHAMT_EXTENSION
    };

    private static final String XML_LABELS_WINDUP_EXTENSION = "windup.label.xml";
    private static final String XML_LABELS_RHAMT_EXTENSION = "rhamt.label.xml";
    private static final String[] SUPPORTED_LABEL_EXTENSIONS = {
            XML_LABELS_WINDUP_EXTENSION,
            XML_LABELS_RHAMT_EXTENSION
    };

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
    private LabelProviderService labelProviderService;

    @Inject
    @FromFurnace
    private IssueCategoryProviderService issueCategoryProviderService;

    @Inject
    @FromFurnace
    private RuleFormatterService ruleFormatterService;

    @Schedule(hour = "*", minute = "12")
    @AccessTimeout(value = 3, unit = TimeUnit.MINUTES)
    public void loadPeriodically()
    {
        LOG.info("Periodic reload of rules and labels data");
        try
        {
            configurationService.getAllConfigurations().forEach(webConfiguration -> {
                reloadRuleData(webConfiguration);
                reloadLabelData(webConfiguration);
            });
            this.cleanupDanglingRows();
        }
        catch (Throwable t)
        {
            LOG.log(Level.WARNING, "Periodic reload failed due to: " + t.getMessage(), t);
        }
    }

    @AccessTimeout(value = 3, unit = TimeUnit.MINUTES)
    public void configurationUpdated(@Observes Configuration configuration)
    {
        LOG.info("Reloading rule and label data due to configuration update!");
        reloadRuleData(configuration);
        reloadLabelData(configuration);
    }

    /*
     * This prevents timeouts in the case that this is called concurrently.
     *
     * The value specified here should be long enough for the previous run to complete.
     *
     */
    @AccessTimeout(value = 3, unit = TimeUnit.MINUTES)
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

    /*
     * This prevents timeouts in the case that this is called concurrently.
     *
     * The value specified here should be long enough for the previous run to complete.
     *
     */
    @AccessTimeout(value = 3, unit = TimeUnit.MINUTES)
    public void reloadLabelData(Configuration configuration)
    {
        LOG.info("Starting reload of label data...");
        try
        {
            this.loadLabels(configuration);
        }
        catch (Exception e)
        {
            LOG.log(Level.SEVERE, "Error loading labels due to: " + e.getMessage(), e);
        }
        this.getCategories();
        LOG.info("Label data reload complete!");
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
                loadRulesForRulesPath(rulesPath);
            }
        }
        finally
        {
            this.commit();
        }
    }

    private void loadLabels(Configuration webConfiguration)
    {
        this.begin();
        try
        {
            if (webConfiguration.getLabelsPaths() == null || webConfiguration.getLabelsPaths().isEmpty())
                return;

            for (LabelsPath labelsPath : webConfiguration.getLabelsPaths())
            {
                loadLabelsForLabelsPath(labelsPath);
            }
        }
        finally
        {
            this.commit();
        }
    }

    private void loadRulesForRulesPath(RulesPath rulesPath)
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
                return;
        }
        LOG.info("Purging existing rule data for: " + rulesPath);
        // Delete the previous ones
        entityManager
                    .createNamedQuery(RuleProviderEntity.DELETE_BY_RULES_PATH)
                    .setParameter(RuleProviderEntity.RULES_PATH_PARAM, rulesPath)
                    .executeUpdate();

        rulesPath.setLoadError(null);
        try
        {
            Path initialPath = Paths.get(rulesPath.getPath());
            boolean isSystemProvided = rulesPath.getRulesPathType() == RulesPath.RulesPathType.SYSTEM_PROVIDED;
            boolean scanRecursively = isSystemProvided || rulesPath.isScanRecursively();

            /*
             * If it is just a single file, just scan that file instead of searching.
             *
             * Also, it is more efficient to scan recursively, so scan system provided rules that way in all cases.
             */
            if (isSystemProvided || Files.isRegularFile(initialPath))
            {
                loadRules(rulesPath, initialPath);
            }
            else
            {
                final Set<Path> pathsToScan = FileUtils.listFiles(
                            initialPath.toFile(),
                            SUPPORTED_RULE_EXTENSIONS, scanRecursively)
                            .stream()
                            .map(File::toPath)
                            .collect(Collectors.toSet());
                for (Path path : pathsToScan)
                {
                    loadRules(rulesPath, path);
                }
            }

        }
        catch (Exception e)
        {
            rulesPath.setLoadError("Failed to load rules due to: " + e.getMessage());
            LOG.log(Level.SEVERE, "Could not load rule information due to: " + e.getMessage(), e);
        }
    }

    private void loadLabelsForLabelsPath(LabelsPath labelsPath)
    {
        /*
         * Do not reload system rules if we have already loaded them
         */
        if (labelsPath.getLabelsPathType() == LabelsPath.LabelsPathType.SYSTEM_PROVIDED)
        {
            Long count = entityManager
                    .createQuery("select count(lpe) from LabelProviderEntity lpe where lpe.labelsPath = :labelsPath", Long.class)
                    .setParameter("labelsPath", labelsPath)
                    .getSingleResult();
            if (count > 0)
                return;
        }
        LOG.info("Purging existing label data for: " + labelsPath);
        // Delete the previous ones
        entityManager
                .createNamedQuery(LabelProviderEntity.DELETE_BY_LABELS_PATH)
                .setParameter(LabelProviderEntity.LABELS_PATH_PARAM, labelsPath)
                .executeUpdate();

        labelsPath.setLoadError(null);
        try
        {
            Path initialPath = Paths.get(labelsPath.getPath());
            boolean isSystemProvided = labelsPath.getLabelsPathType() == LabelsPath.LabelsPathType.SYSTEM_PROVIDED;
            boolean scanRecursively = isSystemProvided || labelsPath.isScanRecursively();

            /*
             * If it is just a single file, just scan that file instead of searching.
             *
             * Also, it is more efficient to scan recursively, so scan system provided rules that way in all cases.
             */
            if (isSystemProvided || Files.isRegularFile(initialPath))
            {
                loadLabels(labelsPath, initialPath);
            }
            else
            {
                final Set<Path> pathsToScan = FileUtils.listFiles(
                        initialPath.toFile(),
                        SUPPORTED_LABEL_EXTENSIONS, scanRecursively)
                        .stream()
                        .map(File::toPath)
                        .collect(Collectors.toSet());
                for (Path path : pathsToScan)
                {
                    loadLabels(labelsPath, path);
                }
            }

        }
        catch (Exception e)
        {
            labelsPath.setLoadError("Failed to load labels due to: " + e.getMessage());
            LOG.log(Level.SEVERE, "Could not load label information due to: " + e.getMessage(), e);
        }
    }

    private void loadRules(RulesPath rulesPath, Path path)
    {
        boolean fileRulesOnly = rulesPath.getRulesPathType() == RulesPath.RulesPathType.USER_PROVIDED;

        RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(Collections.singleton(path), null);

        RuleProviderRegistry providerRegistry;
        try
        {
            providerRegistry = ruleProviderService.loadRuleProviderRegistry(Collections.singleton(path), fileRulesOnly);
        }
        catch (Exception e)
        {
            RuleProviderEntity ruleProviderEntity = new RuleProviderEntity();
            ruleProviderEntity.setProviderID("ERROR");
            ruleProviderEntity.setDateLoaded(new GregorianCalendar());
            ruleProviderEntity.setOrigin(path.toString());
            ruleProviderEntity.setRulesPath(rulesPath);
            ruleProviderEntity.setLoadError(e.getMessage());
            entityManager.persist(ruleProviderEntity);
            return;
        }
        LOG.info("Providers for: " + path + " are " + providerRegistry.getProviders());

        for (RuleProvider provider : providerRegistry.getProviders())
        {
            RuleProviderMetadata ruleProviderMetadata = provider.getMetadata();

            String providerID = ruleProviderMetadata.getID();
            String origin = ruleProviderMetadata.getOrigin();
            RuleProviderEntity.RuleProviderType ruleProviderType = getProviderType(origin);

            // Skip user provided rules that are Java
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

    private void loadLabels(LabelsPath labelsPath, Path path)
    {
        boolean fileRulesOnly = labelsPath.getLabelsPathType() == LabelsPath.LabelsPathType.USER_PROVIDED;

        RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(Collections.singleton(path), null);

        LabelProviderRegistry labelProviderRegistry;
        try
        {
            labelProviderRegistry = labelProviderService.loadLabelProviderRegistry(Collections.singleton(path), fileRulesOnly);
        }
        catch (Exception e)
        {
            LabelProviderEntity labelProviderEntity = new LabelProviderEntity();
            labelProviderEntity.setProviderID("ERROR");
            labelProviderEntity.setDateLoaded(new GregorianCalendar());
            labelProviderEntity.setOrigin(path.toString());
            labelProviderEntity.setLabelsPath(labelsPath);
            labelProviderEntity.setLoadError(e.getMessage());
            entityManager.persist(labelProviderEntity);
            return;
        }
        LOG.info("Providers for: " + path + " are " + labelProviderRegistry.getProviders());

        for (LabelProvider provider : labelProviderRegistry.getProviders())
        {
            LabelProviderMetadata labelProviderMetadata = provider.getMetadata();
            LabelProviderData data = provider.getData();

            String providerID = labelProviderMetadata.getID();
            String origin = labelProviderMetadata.getOrigin();

            LabelProviderEntity labelProviderEntity = new LabelProviderEntity();
            labelProviderEntity.setProviderID(providerID);
            labelProviderEntity.setDateLoaded(new GregorianCalendar());
            labelProviderEntity.setDescription(labelProviderMetadata.getDescription());
            labelProviderEntity.setOrigin(origin);
            labelProviderEntity.setLabelsPath(labelsPath);
            entityManager.persist(labelProviderEntity);

            setFileMetaData(labelProviderEntity);

            labelProviderEntity.setLabelProviderType(LabelProviderEntity.LabelProviderType.XML);

            List<LabelEntity> labelEntities = new ArrayList<>();

            List<Label> labels = data.getLabels();
            for (Object obj : labels)
            {
                String labelID;
                String labelString;

                // TODO replace this once ClassCastException is solved
                try {
                    Class<?> aClass = obj.getClass();
                    labelID = (String) aClass.getMethod("getId").invoke(obj);
                    labelString = (String) aClass.getMethod("getLabelString").invoke(obj);
                } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                    throw new IllegalStateException(e);
                }

                LabelEntity labelEntity = new LabelEntity();
                labelEntity.setLabelID(labelID);
                labelEntity.setLabelContents(labelString);
                labelEntities.add(labelEntity);
            }

            labelProviderEntity.setLabels(labelEntities);

            entityManager.persist(labelProviderEntity);
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

    private void setFileMetaData(LabelProviderEntity labelProviderEntity)
    {
        if (labelProviderEntity.getOrigin() == null)
            return;

        try
        {
            String filePathString = labelProviderEntity.getOrigin();

            if (filePathString.startsWith("file:"))
                filePathString = filePathString.substring(5);

            Path filePath = Paths.get(filePathString);
            if (!Files.isRegularFile(filePath))
                return;

            FileTime lastModifiedTime = Files.getLastModifiedTime(Paths.get(filePathString));
            GregorianCalendar lastModifiedCalendar = new GregorianCalendar();
            lastModifiedCalendar.setTimeInMillis(lastModifiedTime.toMillis());
            labelProviderEntity.setDateModified(lastModifiedCalendar);

            if (labelProviderEntity.getLabelsPath() != null)
            {
                filePath = Paths.get(labelProviderEntity.getLabelsPath().getPath()).relativize(Paths.get(filePathString));
                labelProviderEntity.setOrigin(filePath.toString());
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
        else if (origin.startsWith("file:") && Arrays.stream(SUPPORTED_RULE_EXTENSIONS).parallel().anyMatch(extension -> origin.endsWith(extension)))
            return RuleProviderEntity.RuleProviderType.XML;
        else if (origin.startsWith("file:") && origin.endsWith(".windup.groovy"))
            return RuleProviderEntity.RuleProviderType.GROOVY;
        else
            return RuleProviderEntity.RuleProviderType.JAVA;
    }

    private void begin()
    {
        // try
        // {
        // this.userTransaction.begin();
        // }
        // catch (Exception e)
        // {
        // throw new RuntimeException(e);
        // }
    }

    private void commit()
    {
        // try
        // {
        // this.userTransaction.commit();
        // }
        // catch (Exception e)
        // {
        // throw new RuntimeException(e);
        // }
    }
}
