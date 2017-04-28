package org.jboss.windup.web.services;

import org.jboss.arquillian.junit.Arquillian;
import org.jboss.windup.web.services.model.RuleProviderEntity;
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
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private RuleDataLoader ruleDataLoader;

    @Test
    public void testDataLoader()
    {

        ruleDataLoader.reloadRuleData(this.configurationService.getConfiguration());

        @SuppressWarnings("unchecked")
        List<RuleProviderEntity> ruleProviderEntities = entityManager.createNamedQuery(RuleProviderEntity.FIND_ALL).getResultList();

        Assert.assertTrue(ruleProviderEntities.size() > 10);

        int rulesFound = 0;
        int pathsFound = 0;
        for (RuleProviderEntity ruleProviderEntity : ruleProviderEntities)
        {
            rulesFound += ruleProviderEntity.getRules().size();
            if (ruleProviderEntity.getRulesPath() != null)
            {
                pathsFound++;
                System.out.println("Rule provider path: " + ruleProviderEntity.getRulesPath());
            }
        }

        System.out.println("Rules found: " + rulesFound);
        // arbitrary numbers... basically just high enough to insure that we did find some
        Assert.assertTrue(rulesFound > 100);
        Assert.assertTrue(pathsFound > 10);
    }
}
