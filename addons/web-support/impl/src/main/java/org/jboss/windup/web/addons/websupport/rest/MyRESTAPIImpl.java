package org.jboss.windup.web.addons.websupport.rest;

import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummary;
import org.jboss.windup.reporting.model.Severity;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class MyRESTAPIImpl implements MyRESTAPI
{
    public Object pathExists()
    {
        ProblemSummary result = new ProblemSummary(1234, Severity.MANDATORY, "ruleid", "issuename", 123, 246);
        return result;
    }
}
