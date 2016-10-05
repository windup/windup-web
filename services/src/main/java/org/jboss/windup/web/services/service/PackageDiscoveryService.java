package org.jboss.windup.web.services.service;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import org.jboss.windup.rules.apps.java.scan.operation.packagemapping.PackageNameMappingRegistry;
import org.jboss.windup.util.*;
import org.ocpsoft.logging.Logger;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class PackageDiscoveryService implements Runnable
{
    protected PackageNameMappingRegistry packageNameMappingRegistry;

    protected String inputPath;

    protected Map<String, Integer> knownPackages;
    protected Map<String, Integer> unknownPackages;

    public PackageDiscoveryService(PackageNameMappingRegistry packageNameMappingRegistry, String inputPath)
    {
        this.packageNameMappingRegistry = packageNameMappingRegistry;
        this.inputPath = inputPath;
    }

    public Map<String, Integer> getKnownPackages()
    {
        return knownPackages;
    }

    public Map<String, Integer> getUnknownPackages()
    {
        return unknownPackages;
    }

    @Override
    public void run()
    {
        final Map<String, Integer> classes = findClasses(Paths.get(this.inputPath));
        packageNameMappingRegistry.loadPackageMappings();

        Map<String, String> knownPackages = new TreeMap<>(new PackageComparator());
        PackageFrequencyTrie frequencyTrie = new PackageFrequencyTrie();

        for (String qualifiedName : classes.keySet())
        {
            String packageName = ClassNameUtil.getPackageName(qualifiedName);
            String organization = packageNameMappingRegistry.getOrganizationForPackage(packageName);

            if (organization == null)
            {
                frequencyTrie.addClass(qualifiedName);
            }
            else
            {
                knownPackages.put(packageName, organization);
            }
        }

        for (Map.Entry<String, String> organizationPackage : knownPackages.entrySet())
        {
            System.out.println(organizationPackage.getKey() + " - " + organizationPackage.getValue());
        }

        frequencyTrie.visit((trie, depth) -> {
            String packageName = trie.getPackageName();
            int recursiveClassCount = trie.getClassCount(true);

            if (depth == 0) {
                int defaultPackageClassCount = trie.getClassCount(false);
/*
                if (defaultPackageClassCount) {

                }
*/
            }


            if (depth == 1 || (depth > 1 && recursiveClassCount > 100))
            {
                System.out.println(packageName + " - Classes: " + recursiveClassCount);
            }

            if (depth == 0 && trie.getClassCount(false) > 0)
            {
                System.out.println("Default Package - Classes: " + trie.getClassCount(false));
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

    /**
     * Find all paths within the given file (or folder).
     */
    private static Collection<String> findPaths(Path path)
    {
        List<String> paths = findPaths(path, false);
        Collections.sort(paths);

        return paths;
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
                Logger.getLogger(PackageDiscoveryService.class).warn("Could not read file: " + path + " due to: " + e.getMessage());
            }
        }
        else if (Files.isRegularFile(path) && ZipUtil.endsWithZipExtension(path.toString()))
        {
            results.addAll(ZipUtil.scanZipFile(path, relativeOnly));
        }

        return results;
    }
}
