package org.jboss.windup.web.furnaceserviceprovider;

/**
 * This is just a marker to indicate that Furnace is about to shutdown.
 *
 * This can be used to cleanup any services that need to use the Furnace runtime before
 * it is shutdown.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class FurnacePreShutdownEvent
{
}
