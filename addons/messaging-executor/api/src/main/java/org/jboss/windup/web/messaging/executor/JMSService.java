package org.jboss.windup.web.messaging.executor;

/**
 * Contains services that are required by the execution system for accessing underlying JMS
 * resources.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface JMSService
{
    void setServiceAdapter(JMSServiceAdapter serviceAdapter);
    JMSServiceAdapter getServiceAdapter();
}
