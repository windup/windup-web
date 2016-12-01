package org.jboss.windup.web.services.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.ReportFilter;
import org.jboss.windup.web.services.service.ApplicationGroupService;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Stateless
public class ReportFilterEndpointImpl implements ReportFilterEndpoint
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private ApplicationGroupService applicationGroupService;

    @Override
    public ReportFilter getFilter(Long groupId)
    {
        ApplicationGroup group = this.applicationGroupService.getApplicationGroup(groupId);
        return group.getReportFilter();
    }

    @Override
    public ReportFilter setFilter(Long groupId, ReportFilter newFilter)
    {
        ApplicationGroup group = this.applicationGroupService.getApplicationGroup(groupId);

        ReportFilter oldFilter = group.getReportFilter();
        oldFilter.clear();

        Set<Long> selectedApplicationIds = newFilter.getSelectedApplications().stream()
                .map(RegisteredApplication::getId)
                .collect(Collectors.toSet());
        newFilter.clearSelectedApplications();

        Collection<RegisteredApplication> applications = this.getAllApplicationsByIds(selectedApplicationIds);
        applications.forEach(newFilter::addSelectedApplication);

        newFilter.setApplicationGroup(group);
        this.entityManager.merge(newFilter);

        group.setReportFilter(newFilter);
        this.entityManager.merge(group);
//        this.entityManager.merge(newFilter);

        return newFilter;
    }

    Collection<RegisteredApplication> getAllApplicationsByIds(Set<Long> ids)
    {
        return entityManager
                .createQuery("select a from " + RegisteredApplication.class.getSimpleName() + " a WHERE a.id IN (:ids)", RegisteredApplication.class)
                .setParameter("ids", ids)
                .getResultList();
    }

    @Override
    public void clearFilter(Long groupId)
    {
        ApplicationGroup group = this.applicationGroupService.getApplicationGroup(groupId);

        ReportFilter filter = group.getReportFilter();
        filter.clear();
        this.entityManager.merge(filter);
    }
}
