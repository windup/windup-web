package org.jboss.windup.web.addons.websupport.services;

import java.util.Map;

/**
 * Service for discovering packages in application.
 * Could run on java archives (.jar, .ear, .war) or directory
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public interface PackageDiscoveryService
{
    /**
     * Executes the package discovery service
     * @param rulesPath Path to the main windup rules (system rules)
     * @param inputPath Input path to java archive or directory
     * @return Package discovery result object with discovered packages
     */
    PackageDiscoveryResult execute(String rulesPath, String inputPath);

    /**
     * Package discovery result object
     */
    class PackageDiscoveryResult
    {
        protected Map<String, Integer> knownPackages;
        protected Map<String, Integer> unknownPackages;

        protected PackageDiscoveryResult()
        {}

        public PackageDiscoveryResult(Map<String, Integer> knownPackages, Map<String, Integer> unknownPackages)
        {
            this.knownPackages = knownPackages;
            this.unknownPackages = unknownPackages;
        }

        /**
         * Gets map of known packages (usually some vendor packages)
         *
         * @return Map of known packages and count of classes in them
         */
        public Map<String, Integer> getKnownPackages()
        {
            return this.knownPackages;
        }

        /**
         * Gets map of unknown packages
         *
         * @return Map of unknown packages and count of classes in them
         */
        public Map<String, Integer> getUnknownPackages()
        {
            return this.unknownPackages;
        }
    }

}
