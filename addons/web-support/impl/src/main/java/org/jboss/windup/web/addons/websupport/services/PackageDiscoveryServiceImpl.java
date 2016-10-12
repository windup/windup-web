package org.jboss.windup.web.addons.websupport.services;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.inject.Inject;

import org.jboss.windup.rules.apps.java.scan.operation.packagemapping.PackageNameMappingRegistry;
import org.jboss.windup.util.ClassNameUtil;
import org.jboss.windup.util.PackageComparator;
import org.jboss.windup.util.PackageFrequencyTrie;
import org.jboss.windup.util.PathUtil;
import org.jboss.windup.util.ZipUtil;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.ocpsoft.logging.Logger;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class PackageDiscoveryServiceImpl implements PackageDiscoveryService
{
    @Inject
    private WebPathUtil webPathUtil;

    @Inject
    private PackageNameMappingRegistry packageNameMappingRegistry;

    @Override
    public PackageDiscoveryResult execute(String rulesPath, String inputPath)
    {
        final Map<String, Integer> classes = findClasses(Paths.get(inputPath));
        packageNameMappingRegistry.loadPackageMappings(Paths.get(rulesPath));

        Map<String, String> knownPackages = new TreeMap<>(new PackageComparator());
        PackageFrequencyTrie frequencyTrie = new PackageFrequencyTrie();

        for (String qualifiedName : classes.keySet())
        {
            String packageName = ClassNameUtil.getPackageName(qualifiedName);
            String organization = packageNameMappingRegistry.getOrganizationForPackage(packageName);

            frequencyTrie.addClass(qualifiedName);

            if (organization != null)
            {
                knownPackages.put(packageName, organization);
            }
        }

        Map<String, Integer> knownPackagesAndClassCount = new TreeMap<>(new PackageComparator());
        Map<String, Integer> unknownPackagesAndClassCount = new TreeMap<>(new PackageComparator());

        this.qualifyDiscoveredPackages(knownPackages, frequencyTrie, knownPackagesAndClassCount, unknownPackagesAndClassCount);

        return new PackageDiscoveryResult(knownPackagesAndClassCount, unknownPackagesAndClassCount);
    }

    /**
     * Qualifies if discovered package is known or unknown package and places it into corresponding map
     *
     * @param knownPackages Map of known packages and their vendors
     * @param discoveredPackagesFrequencyTrie Trie containing all discovered packages
     * @param knownPackagesAndClassCount Output map for known packages
     * @param unknownPackagesAndClassCount Output map for unknown packages
     */
    private void qualifyDiscoveredPackages(Map<String, String> knownPackages, PackageFrequencyTrie discoveredPackagesFrequencyTrie,
                Map<String, Integer> knownPackagesAndClassCount, Map<String, Integer> unknownPackagesAndClassCount)
    {
        discoveredPackagesFrequencyTrie.visit((trie, depth) -> {
            String packageName = trie.getPackageName();

            int recursiveClassCount = trie.getClassCount(true);
            int nonRecursiveClassCount = trie.getClassCount(false);

            Map<String, Integer> resultingMap = null;

            if (knownPackages.containsKey(packageName))
            {
                resultingMap = knownPackagesAndClassCount;
            }
            else
            {
                resultingMap = unknownPackagesAndClassCount;
            }

            if (depth == 1 || (depth > 1 && recursiveClassCount > 100))
            {
                resultingMap.put(packageName, recursiveClassCount);
            }
            else if (depth == 0 && nonRecursiveClassCount > 0)
            {
                resultingMap.put(packageName, nonRecursiveClassCount);
            }
        });
    }

    /**
     * Recursively scan the provided path and return a list of all Java packages contained therein.
     */
    private static Map<String, Integer> findClasses(Path path)
    {
        List<String> paths = findPaths(path, true);
        Map<String, Integer> results = new HashMap<>();
        for (String subPath : paths)
        {
            if (subPath.endsWith(".java") || subPath.endsWith(".class"))
            {
                String qualifiedName = PathUtil.classFilePathToClassname(subPath);
                addClassToMap(results, qualifiedName);
            }
        }

        return results;
    }

    private static void addClassToMap(Map<String, Integer> map, String className)
    {
        Integer count = map.get(className);

        if (count == null)
        {
            map.put(className, 1);
        }
        else
        {
            map.put(className, count + 1);
        }
    }

    private static List<String> findPaths(Path path, boolean relativeOnly)
    {
        List<String> results = new ArrayList<>();
        results.add(path.normalize().toAbsolutePath().toString());

        if (Files.isDirectory(path))
        {
            try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(path))
            {
                for (Path child : directoryStream)
                {
                    results.addAll(findPaths(child, relativeOnly));
                }
            }
            catch (IOException e)
            {
                Logger.getLogger(PackageDiscoveryServiceImpl.class).warn("Could not read file: " + path + " due to: " + e.getMessage());
            }
        }
        else if (Files.isRegularFile(path) && ZipUtil.endsWithZipExtension(path.toString()))
        {
            results.addAll(ZipUtil.scanZipFile(path, relativeOnly));
        }

        return results;
    }
}
