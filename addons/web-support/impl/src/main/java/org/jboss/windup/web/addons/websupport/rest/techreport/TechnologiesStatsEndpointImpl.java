package org.jboss.windup.web.addons.websupport.rest.techreport;

import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Singleton;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.rules.apps.javaee.model.stats.TechnologiesStatsModel;
import org.jboss.windup.rules.apps.javaee.model.stats.TechnologiesStatsService;
//import org.jboss.windup.web.services.rest.graph.AbstractGraphResource;
import org.jboss.windup.web.addons.websupport.rest.graph.AbstractGraphResource;


/**
 * Contains methods for managing technologies statistics.
 *
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Singleton
public class TechnologiesStatsEndpointImpl extends AbstractGraphResource implements TechnologiesStatsEndpoint
{
    private static Logger LOG = Logger.getLogger(TechnologiesStatsEndpointImpl.class.getSimpleName());


    @Override
    public boolean computeTechStats(long executionId) {
        final GraphContext graphContext = this.getGraph(executionId);
        TechnologiesStatsService technologiesStatsService = new TechnologiesStatsService(graphContext);
        TechnologiesStatsModel stats = technologiesStatsService.computeStats();
        return true;
    }
}
