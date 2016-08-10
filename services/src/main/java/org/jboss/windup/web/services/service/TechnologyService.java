package org.jboss.windup.web.services.service;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.apache.commons.lang3.StringUtils;
import org.dom4j.Element;
import org.jboss.windup.web.services.model.Technology;
import org.jboss.windup.web.services.model.Technology_;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class TechnologyService
{
    @PersistenceContext
    private EntityManager entityManager;

    public Technology getOrCreate(Element element)
    {
        if (element == null)
            return null;

        String id = element.attributeValue("id");
        String versionRange = element.attributeValue("version-range");
        return getOrCreate(id, versionRange);
    }

    public Technology getOrCreate(String name, String versionRange)
    {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Technology> criteriaQuery = builder.createQuery(Technology.class);
        Root<Technology> root = criteriaQuery.from(Technology.class);

        criteriaQuery.where(builder.equal(root.get(Technology_.name), name));
        if (StringUtils.isNotBlank(versionRange))
            criteriaQuery.where(builder.equal(root.get(Technology_.versionRange), versionRange));

        try
        {
            return entityManager.createQuery(criteriaQuery).getSingleResult();
        }
        catch (NoResultException e)
        {
            Technology technology = new Technology();
            technology.setName(name);
            technology.setVersionRange(versionRange);
            entityManager.persist(technology);
            return technology;
        }
    }
}
