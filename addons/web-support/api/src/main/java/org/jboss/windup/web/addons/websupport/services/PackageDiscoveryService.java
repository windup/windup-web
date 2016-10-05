package org.jboss.windup.web.addons.websupport.services;

import java.util.Map;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public interface PackageDiscoveryService
{
    public Map<String, Integer> getKnownPackages();
    public Map<String, Integer> getUnknownPackages();
}
