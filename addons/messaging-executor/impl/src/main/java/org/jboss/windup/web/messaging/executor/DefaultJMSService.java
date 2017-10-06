package org.jboss.windup.web.messaging.executor;

import javax.inject.Singleton;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
public class DefaultJMSService implements JMSService
{
    private JMSServiceAdapter serviceAdapter;

    @Override
    public JMSServiceAdapter getServiceAdapter()
    {
        return this.serviceAdapter;
    }

    @Override
    public void setServiceAdapter(JMSServiceAdapter serviceAdapter)
    {
        this.serviceAdapter = serviceAdapter;
    }
}
