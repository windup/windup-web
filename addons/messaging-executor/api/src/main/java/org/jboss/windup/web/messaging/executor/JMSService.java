package org.jboss.windup.web.messaging.executor;

/**
 * Contains services that are required by the execution system for accessing underlying JMS
 * resources. This will be configured differently, depending upon the deployment environment.
 *
 * For example, Java SE deployments will behave differently than if run in a Java EE container.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface JMSService
{
    /**
     * Sets the {@link JMSServiceAdapter} that will be used for this session.
     */
    void setServiceAdapter(JMSServiceAdapter serviceAdapter);

    /**
     * Gets the currently configured {@link JMSServiceAdapter}.
     */
    JMSServiceAdapter getServiceAdapter();
}
