package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;

import java.util.Map;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public interface ReportFilterService
{
    ReportFilterDTO getReportFilter(Long executionId);

    ReportFilterDTO getReportFilterFromMap(Map<String, Object> map);
}
