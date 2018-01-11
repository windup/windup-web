package org.jboss.windup.web.services;

import org.jboss.arquillian.junit.Arquillian;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.service.ConfigurationService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;


/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class RuleDataLoaderTest extends AbstractTest
{
    public static final String CUSTOM_WINDUP_RULESPATH = "target/test-classes/custom-rulesets-data/custom-ruleset.windup.xml";
    public static final String CUSTOM_RHAMT_RULESPATH = "target/test-classes/custom-rulesets-data/custom-ruleset.rhamt.xml";

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private RuleDataLoader ruleDataLoader;

    @Test
    public void testDataLoader()
    {

        Configuration configuration = this.configurationService.getConfiguration();
        configuration.getRulesPaths().add(new RulesPath(CUSTOM_WINDUP_RULESPATH, RulesPath.RulesPathType.USER_PROVIDED));
        configuration.getRulesPaths().add(new RulesPath(CUSTOM_RHAMT_RULESPATH, RulesPath.RulesPathType.USER_PROVIDED));
        configuration = this.configurationService.saveConfiguration(configuration);
        ruleDataLoader.reloadRuleData(configuration);

        @SuppressWarnings("unchecked")
        List<RuleProviderEntity> ruleProviderEntities = entityManager.createNamedQuery(RuleProviderEntity.FIND_ALL).getResultList();

        Assert.assertTrue(ruleProviderEntities.size() > 10);

        int rulesFound = 0;
        int pathsFound = 0;
        boolean customWindupRulesetFound = false;
        boolean customRHAMTRulesetFound = false;
        for (RuleProviderEntity ruleProviderEntity : ruleProviderEntities)
        {
            rulesFound += ruleProviderEntity.getRules().size();
            if (ruleProviderEntity.getRulesPath() != null)
            {
                pathsFound++;
                if (!customWindupRulesetFound && ruleProviderEntity.getRulesPath().getPath().equals(CUSTOM_WINDUP_RULESPATH)) customWindupRulesetFound = true;
                if (!customRHAMTRulesetFound && ruleProviderEntity.getRulesPath().getPath().equals(CUSTOM_RHAMT_RULESPATH)) customRHAMTRulesetFound = true;
                System.out.println("Rule provider path: " + ruleProviderEntity.getRulesPath());
            }
        }

        System.out.println("Rules found: " + rulesFound);
        // arbitrary numbers... basically just high enough to insure that we did find some
        Assert.assertTrue(rulesFound > 100);
        Assert.assertTrue(pathsFound > 10);
        Assert.assertTrue(customWindupRulesetFound);
        Assert.assertTrue(customRHAMTRulesetFound);
    }
}
