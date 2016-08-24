package org.jboss.windup.web.services;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.jboss.windup.config.RuleProvider;
import org.jboss.windup.config.RuleUtils;
import org.jboss.windup.config.metadata.RuleProviderRegistry;
import org.jboss.windup.config.metadata.TechnologyReference;
import org.jboss.windup.config.phase.MigrationRulesPhase;
import org.jboss.windup.web.addons.websupport.services.RuleProviderService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.furnaceserviceprovider.WebProperties;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.RuleEntity;
import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.jboss.windup.web.services.model.Technology;
import org.jboss.windup.web.services.service.ConfigurationService;
import org.jboss.windup.web.services.service.TechnologyService;
import org.ocpsoft.rewrite.config.Rule;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

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

    @Inject @FromFurnace
    private RuleProviderService ruleProviderService;

    @PostConstruct
    public void loadOnStartup()
    {
        reloadRuleData();
    }

    @Schedule(hour = "*", minute = "12")
    public void loadPeriodically()
    {
        reloadRuleData();
    }

    public void reloadRuleData()
    {

        List<Path> userRulePaths = new ArrayList<>();
        userRulePaths.add(WebProperties.getInstance().getRulesRepository());

        Configuration webConfiguration = configurationService.getConfiguration();
        if (webConfiguration != null)
        {
            for (String userRulesPath : webConfiguration.getUserRulePaths())
            {
                userRulePaths.add(Paths.get(userRulesPath));
            }
        }

        RuleProviderRegistry providerRegistry = ruleProviderService.loadRuleProviderRegistry(userRulePaths);

        try
        {

            // Delete the previous ones
            entityManager.createNamedQuery(RuleProviderEntity.DELETE_ALL).executeUpdate();

            for (RuleProvider provider : providerRegistry.getProviders())
            {
                String providerID = provider.getMetadata().getID();
                String origin = provider.getMetadata().getOrigin();

                RuleProviderEntity ruleProviderEntity = new RuleProviderEntity();
                ruleProviderEntity.setProviderID(providerID);
                ruleProviderEntity.setDateLoaded(new GregorianCalendar());
                ruleProviderEntity.setDescription(provider.getMetadata().getDescription());
                ruleProviderEntity.setOrigin(origin);
                entityManager.persist(ruleProviderEntity);

                try
                {
                    if (Files.isRegularFile(Paths.get(origin)))
                    {
                        FileTime lastModifiedTime = Files.getLastModifiedTime(Paths.get(origin));
                        GregorianCalendar lastModifiedCalendar = new GregorianCalendar();
                        lastModifiedCalendar.setTimeInMillis(lastModifiedTime.toMillis());
                        ruleProviderEntity.setDateModified(lastModifiedCalendar);
                    }
                } catch (Exception e)
                {
                    // not a file path... ignore
                }

                ruleProviderEntity.setSources(technologyReferencesToTechnologyList(provider.getMetadata().getSourceTechnologies()));
                ruleProviderEntity.setTargets(technologyReferencesToTechnologyList(provider.getMetadata().getTargetTechnologies()));

                String phase = MigrationRulesPhase.class.getSimpleName().toUpperCase();
                if (provider.getMetadata().getPhase() != null)
                    phase = provider.getMetadata().getPhase().getSimpleName().toUpperCase();

                ruleProviderEntity.setPhase(phase);

                List<RuleEntity> ruleEntities = new ArrayList<>();
                for (Rule rule : provider.getConfiguration(null).getRules())
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
        } catch (Exception e)
        {
            LOG.log(Level.SEVERE, "Could not load rule information due to: " + e.getMessage(), e);
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
}
