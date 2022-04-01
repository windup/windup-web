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
import java.util.HashSet;
import java.util.List;
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
        SourceTargetTechnologies result = new SourceTargetTechnologies();
        result.setSources(new HashSet<>());
        result.setTargets(new HashSet<>());

        rulesPaths.stream()
                .flatMap(rulesPath -> getRuleProviderEntitiesByRulesPath(rulesPath).stream())
                .forEach(ruleProviderEntity -> {
                    result.getSources().addAll(ruleProviderEntity.getSources().stream().map(Technology::getName).collect(Collectors.toSet()));
                    result.getTargets().addAll(ruleProviderEntity.getTargets().stream().map(Technology::getName).collect(Collectors.toSet()));
                });
        return result;
    }

}
