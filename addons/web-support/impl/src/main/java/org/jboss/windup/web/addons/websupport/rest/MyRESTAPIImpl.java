package org.jboss.windup.web.addons.websupport.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Configuration;

import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummary;
import org.jboss.windup.reporting.model.Severity;

import java.util.logging.Logger;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class MyRESTAPIImpl implements MyRESTAPI
{
    private static Logger LOG = Logger.getLogger(MyRESTAPIImpl.class.getName());

    private Configuration configuration;
    private HttpServletRequest servletRequest;

    @Override
    public void setConfiguration(Configuration configuration) {
        this.configuration = configuration;
    }

    @Override
    public void setContext(HttpServletRequest request) {
        this.servletRequest = request;
    }

    public Object pathExists()
    {
        LOG.info("Request is: " + servletRequest);
        LOG.info("Configuration is: " + configuration);
        ProblemSummary result = new ProblemSummary(1234, Severity.MANDATORY, "ruleid", "issuename", 123, 246);
        return result;
    }
}
