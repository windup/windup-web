package org.jboss.windup.web.services.rest;

import java.util.List;

import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.jboss.windup.web.services.model.RuleProviderEntity_;
import org.jboss.windup.web.services.model.RulesPath;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.ws.rs.NotFoundException;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class RuleEndpointImpl implements RuleEndpoint
{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<RuleProviderEntity> getAllProviders()
    {
        return entityManager.createNamedQuery(RuleProviderEntity.FIND_ALL).getResultList();
    }

    @Override
    public List<RuleProviderEntity> getByRulesPath(Long rulesPathID)
    {
        RulesPath rulesPath = getRulesPath(rulesPathID);
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<RuleProviderEntity> criteriaQuery = builder.createQuery(RuleProviderEntity.class);
        Root<RuleProviderEntity> root = criteriaQuery.from(RuleProviderEntity.class);
        criteriaQuery.where(builder.equal(root.get(RuleProviderEntity_.rulesPath), rulesPath));

        return entityManager.createQuery(criteriaQuery).getResultList();
    }

    private RulesPath getRulesPath(Long rulesPathID)
    {
        RulesPath rulesPath = entityManager.find(RulesPath.class, rulesPathID);

        if (rulesPath == null)
        {
            throw new NotFoundException("RulesPath with id " + rulesPathID + " not found");
        }

        return rulesPath;
    }
}
