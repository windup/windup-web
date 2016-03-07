package org.jboss.windup.web.services.producer;

/**
 * Indicates that Furnace is about to be shut down. Beans listening to this should insure that
 * any resources depending upon Furnace are shutdown.
 * 
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class FurnaceShutdownEvent
{
}
