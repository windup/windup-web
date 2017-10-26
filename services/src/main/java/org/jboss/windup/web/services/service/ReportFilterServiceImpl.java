package org.jboss.windup.web.services.service;

import javax.persistence.EntityManager;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;
import org.jboss.windup.web.addons.websupport.services.ReportFilterService;
import org.jboss.windup.web.services.model.ReportFilter;
import org.jboss.windup.web.services.ReportFilterDTOImpl;
import org.jboss.windup.web.services.model.WindupExecution;

import java.util.Map;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class ReportFilterServiceImpl implements ReportFilterService
{
    protected EntityManager entityManager;

    public ReportFilterServiceImpl(EntityManager entityManager)
    {
        this.entityManager = entityManager;
    }

    public WindupExecution getExecution(Long id)
    {
        WindupExecution execution = this.entityManager.find(WindupExecution.class, id);

        if (execution == null)
        {
            throw new NotFoundException("Execution with id " + id + " does not exist");
        }

        return execution;
    }

    public ReportFilter getFilter(Long executionId)
    {
        WindupExecution execution = this.getExecution(executionId);
        return execution.getReportFilter();
    }

    @Override
    public ReportFilterDTO getReportFilter(Long executionId)
    {
        ReportFilter reportFilter = this.getFilter(executionId);
        return new ReportFilterDTOImpl(reportFilter);
    }


    @Override
    public ReportFilterDTO getReportFilterFromMap(Map<String, Object> map)
    {
        return ReportFilterDTOImpl.fromMap(map);
    }
}
