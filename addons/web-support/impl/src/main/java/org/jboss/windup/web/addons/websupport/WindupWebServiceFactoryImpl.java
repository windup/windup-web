package org.jboss.windup.web.addons.websupport;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@ApplicationScoped
public class WindupWebServiceFactoryImpl implements WindupWebServiceFactory
{
    @Inject
    private WebPathUtil webPathUtil;

    @Override
    public void destroy()
    {
    }
}
