package org.jboss.windup.web.addons.websupport.services;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import javax.inject.Inject;

import org.jboss.windup.rules.apps.java.scan.operation.packagemapping.PackageNameMappingRegistry;
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
    protected WebPathUtil webPathUtil;

    @Inject
    protected PackageNameMappingRegistry packageNameMappingRegistry;

    @Override
    public PackageDiscoveryResult execute(String inputPath)
    {
        return this.execute(PathUtil.getWindupRulesDir().toString(), inputPath);
    }

    @Override
    public PackageDiscoveryResult execute(String rulesPath, String inputPath)
    {
        final Map<String, Integer> classes = findClasses(Paths.get(inputPath), Paths.get(inputPath));
        packageNameMappingRegistry.loadPackageMappings(Paths.get(rulesPath));

        PackageFrequencyTrie frequencyTrie = new PackageFrequencyTrie();

        for (String qualifiedName : classes.keySet())
        {
            frequencyTrie.addClass(qualifiedName);
        }

        Map<String, Integer> knownPackagesAndClassCount = new TreeMap<>(new PackageComparator());
        Map<String, Integer> unknownPackagesAndClassCount = new TreeMap<>(new PackageComparator());
        Map<String, String> knownPackages = new TreeMap<>(new PackageComparator());

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
        Map<String, Integer> rootPackageUnknownClassCount = new TreeMap<String,Integer>();

        discoveredPackagesFrequencyTrie.visit((trie, depth) -> {
            String packageName = trie.getPackageName();

            int recursiveClassCount = trie.getClassCount(true);
            int nonRecursiveClassCount = trie.getClassCount(false);

            boolean isRootPackage = false;
            String rootPackageName = null;
            String[] packageNameHierarchy = packageName.split("[.]");
            if (packageNameHierarchy != null && packageNameHierarchy.length > 0)
            {
                rootPackageName = packageNameHierarchy[0];
                if (!rootPackageName.equals(""))
                {
                    isRootPackage = rootPackageName.equals(packageName);
                }
            }

            Map<String, Integer> resultingMap = null;
            String organization = packageNameMappingRegistry.getOrganizationForPackage(packageName);

            if (organization != null)
            {
                resultingMap = knownPackagesAndClassCount;
                knownPackages.put(packageName, organization);
            }
            else
            {
                resultingMap = unknownPackagesAndClassCount;
                if (!isRootPackage)
                {
                    if (!rootPackageUnknownClassCount.containsKey(rootPackageName))
                    {
                        rootPackageUnknownClassCount.put(rootPackageName,1);
                    }
                    else
                    {
                        rootPackageUnknownClassCount.replace(rootPackageName, (rootPackageUnknownClassCount.get(rootPackageName)) + 1);
                    }
                }
            }

            if(isRootPackage)
            {
                Integer unknownPackageCount = rootPackageUnknownClassCount.get(rootPackageName);
                if (unknownPackageCount == null || unknownPackageCount < 1)
                {
                    resultingMap = knownPackagesAndClassCount;
                    knownPackages.put(packageName, "ROOT_KNOWN_ORG");
                }
            }

            if (depth > 0)
            {
                resultingMap.put(packageName, recursiveClassCount);
            }
            else if (depth == 0 && nonRecursiveClassCount > 0)
            {
                // default package
                resultingMap.put(packageName, nonRecursiveClassCount);
            }
        });
    }

    /**
     * Recursively scan the provided path and return a list of all Java packages contained therein.
     */
    private static Map<String, Integer> findClasses(Path currentPath, Path sourceRoot)
    {
        String sourceRootPath = sourceRoot.toString();

        List<String> paths = findPaths(currentPath, true);
        Map<String, Integer> results = new HashMap<>();

        for (String subPath : paths)
        {
            if (subPath.endsWith(".java") || subPath.endsWith(".class"))
            {
                String relativePath = subPath;

                if (subPath.contains(sourceRootPath))
                {
                    relativePath = subPath.substring(sourceRoot.toString().length());
                }

                String qualifiedName = PathUtil.classFilePathToClassname(relativePath);
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
