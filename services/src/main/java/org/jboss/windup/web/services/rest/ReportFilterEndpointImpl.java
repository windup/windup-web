package org.jboss.windup.web.services.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.Category;
import org.jboss.windup.web.services.model.FilterApplication;
import org.jboss.windup.web.services.model.ReportFilter;
import org.jboss.windup.web.services.model.Tag;
import org.jboss.windup.web.services.model.WindupExecution;
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
                .map(FilterApplication::getId)
                .collect(Collectors.toSet());
        newFilter.clearSelectedApplications();

        Collection<FilterApplication> applications = this.getAllApplicationsByIds(selectedApplicationIds);
        applications.forEach(newFilter::addSelectedApplication);

        newFilter.setApplicationGroup(group);
        this.entityManager.merge(newFilter);

        return newFilter;
    }

    Collection<FilterApplication> getAllApplicationsByIds(Set<Long> ids)
    {
        return entityManager
                .createQuery("select a from " + FilterApplication.class.getSimpleName() + " a WHERE a.id IN (:ids)", FilterApplication.class)
                .setParameter("ids", ids)
                .getResultList();
    }

    @Override
    public ReportFilter clearFilter(Long groupId)
    {
        ApplicationGroup group = this.applicationGroupService.getApplicationGroup(groupId);

        ReportFilter filter = group.getReportFilter();
        filter.clear();
        this.entityManager.merge(filter);

        return filter;
    }

    @Override
    public Collection<Tag> getTags()
    {
        return this.entityManager.createQuery("SELECT t FROM Tag t", Tag.class)
                .getResultList();
    }

    @Override
    public Collection<Category> getCategories()
    {
        return this.entityManager.createQuery("SELECT c FROM Category  c", Category.class)
                .getResultList();
    }

    @Override
    public Collection<FilterApplication> getApplications(Long executionId)
    {
        if (executionId == null)
        {
            throw new BadRequestException("ExecutionId parameter cannot be null");
        }

        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionId);

        if (execution == null)
        {
            throw new NotFoundException("WindupExecution not found");
        }

        return execution.getFilterApplications();
    }
}
