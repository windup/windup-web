package org.jboss.windup.web.services.service;

import org.jboss.windup.web.services.SourceTargetTechnologies;
import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.jboss.windup.web.services.model.RuleProviderEntity_;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.Technology;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Stateless
public class RulesPathService {

    @PersistenceContext
    private EntityManager entityManager;

    public List<RuleProviderEntity> getRuleProviderEntitiesByRulesPath(RulesPath rulesPath)
    {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<RuleProviderEntity> criteriaQuery = builder.createQuery(RuleProviderEntity.class);
        Root<RuleProviderEntity> root = criteriaQuery.from(RuleProviderEntity.class);
        criteriaQuery.where(builder.equal(root.get(RuleProviderEntity_.rulesPath), rulesPath));

        return entityManager.createQuery(criteriaQuery).getResultList();
    }

    public SourceTargetTechnologies getSourceTargetTechnologies(Collection<RulesPath> rulesPaths) {
        List<RuleProviderEntity> ruleProviderEntities = rulesPaths.stream()
                .flatMap(rulesPath -> getRuleProviderEntitiesByRulesPath(rulesPath).stream())
                .collect(Collectors.toList());

        Set<String> sources = ruleProviderEntities.stream()
                .flatMap(ruleProviderEntity -> ruleProviderEntity.getSources().stream())
                .map(Technology::getName)
                .collect(Collectors.toSet());
        Set<String> targets = ruleProviderEntities.stream()
                .flatMap(ruleProviderEntity -> ruleProviderEntity.getTargets().stream())
                .map(Technology::getName)
                .collect(Collectors.toSet());

        SourceTargetTechnologies result = new SourceTargetTechnologies();
        result.setSources(sources);
        result.setTargets(targets);

        return result;
    }

}
