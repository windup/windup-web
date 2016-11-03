/*
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */
package org.jboss.windup.web.tsmodelgen;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugins.annotations.Execute;
import org.apache.maven.plugins.annotations.LifecyclePhase;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.plugins.annotations.ResolutionScope;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.addons.AddonId;
import org.jboss.forge.furnace.addons.AddonRegistry;
import org.jboss.forge.furnace.impl.addons.AddonRepositoryImpl;
import org.jboss.forge.furnace.manager.impl.AddonManagerImpl;
import org.jboss.forge.furnace.manager.maven.addon.MavenAddonDependencyResolver;
import org.jboss.forge.furnace.manager.request.AddonActionRequest;
import org.jboss.forge.furnace.manager.spi.AddonDependencyResolver;
import org.jboss.forge.furnace.repositories.AddonRepositoryMode;
import org.jboss.forge.furnace.se.FurnaceFactory;
import org.jboss.forge.furnace.versions.SingleVersion;
import org.jboss.forge.furnace.versions.Version;
import org.jboss.forge.furnace.versions.Versions;
import org.jboss.windup.util.PathUtil;
import org.jboss.windup.util.exception.WindupException;
import org.jboss.windup.web.addons.websupport.tsmodelgen.TypeScriptModelsGeneratingService;
import org.jboss.windup.web.addons.websupport.tsmodelgen.TypeScriptModelsGeneratorConfig;
import org.jboss.windup.web.addons.websupport.tsmodelgen.TypeScriptModelsGeneratorConfig.AdjacencyMode;
import org.jboss.windup.web.addons.websupport.tsmodelgen.TypeScriptModelsGeneratorConfig.FileNamingStyle;

/**
 * Generates the Typescript models for Windup web. The models are based on the Frames models available to Furnace from the addons added after starting
 * Furnace.
 *
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Mojo(name = "tsmodelgen", requiresDependencyResolution = ResolutionScope.COMPILE, aggregator = false)
@Execute(phase = LifecyclePhase.GENERATE_SOURCES)
public class WindupTsModelGenMojo extends AbstractMojo
{
    private static final String VERSION_DEFINITIONS_FILE = "META-INF/versions.properties";

    @Parameter(defaultValue = "${project.build.directory}")
    private String buildDirectory;

    /**
     * Location of the generated report files.
     */
    @Parameter(alias = "outputDir", property = "outputDir", required = false, defaultValue = "${project.build.directory}/tsModels")
    private String outputDirectory;

    /**
     * Path the webapp/ dir which will be used for the imports in the generated models. I.e. <code>import {...} from '$importPathToWebapp';</code>
     * Needs to be the relative path from the final TS models dir to the graph package dir.
     */
    @Parameter(alias = "importPathToWebapp", property = "importPathToWebapp", required = false, defaultValue = "../..")
    private String importPathToWebapp;

    /**
     * How adjacency is handled - plain arrays ('MATERIALIZED') or proxied methods ('PROXIED').
     */
    @Parameter(alias = "adjacencyMode", property = "adjacencyMode", required = false, defaultValue = "MATERIALIZED")
    private String adjacencyMode;

    /**
     * How the file names look like:
     * 
     * <pre>
     * CAMELCASE        FooModel.ts
     * LOWERCASE_DASHES foo-model.ts
     * LOWERCASE_DOTS   foo.model.ts
     * </pre>
     * 
     * Currently only CAMELCASE is supported.
     */
    @Parameter(alias = "fileNamingStyle", property = "fileNamingStyle", required = false, defaultValue = "CAMELCASE")
    private String fileNamingStyle;

    /**
     * Fails if false and the output dir exists (regardless of the content).
     */
    @Parameter(alias = "overwrite", property = "overwrite", required = false, defaultValue = "true")
    private Boolean overwrite;

    /**
     * Windup version to use to generate the models from. If not set, default are loaded from within the plugin.
     */
    @Parameter(alias = "windupVersion", property = "windupVersion", required = false)
    private String windupVersion;

    private static Furnace createAndStartFurnace()
    {
        // Create a Furnace instance. NOTE: This must be called only once
        Furnace furnace = FurnaceFactory.getInstance();
        // Add repository containing addons specified in pom.xml
        furnace.addRepository(AddonRepositoryMode.MUTABLE, new File("target/addons"));

        // Start Furnace in another thread
        System.setProperty("INTERACTIVE", "false");
        Future<Furnace> future = furnace.startAsync();
        try
        {
            // Wait until Furnace is started and return
            return future.get();
        }
        catch (InterruptedException | ExecutionException ex)
        {
            throw new WindupException("Failed to start Furnace: " + ex.getMessage(), ex);
        }
    }

    public void execute() throws MojoExecutionException
    {
        System.setProperty(PathUtil.WINDUP_HOME, Paths.get(buildDirectory, "winduphome").toString());

        Properties versions;
        try
        {
            versions = loadVersions(VERSION_DEFINITIONS_FILE);
        }
        catch (IOException ex)
        {
            final String msg = "Can't load the version definitions from classpath: " + VERSION_DEFINITIONS_FILE;
            throw new MojoExecutionException(msg, ex);
        }

        TypeScriptModelsGeneratorConfig config = new TypeScriptModelsGeneratorConfig();
        config.setImportPathToWebapp(Paths.get(importPathToWebapp));

        // Options validation
        try
        {
            Path outputDirectory_ = Paths.get(outputDirectory);
            if (outputDirectory_.toFile().exists() && !overwrite)
                throw new MojoExecutionException("Output path exists and overwriting not set: " + outputDirectory_);
            outputDirectory_.toFile().mkdirs();
            config.setOutputPath(outputDirectory_);

            try
            {
                AdjacencyMode adjacencyMode_ = AdjacencyMode.valueOf(adjacencyMode.trim().toUpperCase());
                config.setAdjacencyMode(adjacencyMode_);
            }
            catch (Exception ex)
            {
                throw new MojoExecutionException("Invalid adjacencyMode value: " + adjacencyMode
                            + "\nMust be one of: " + Arrays.asList(AdjacencyMode.values())
                            + "\n    " + ex.getMessage());
            }

            try
            {
                FileNamingStyle fileNamingStyle_ = FileNamingStyle.valueOf(fileNamingStyle.trim().toUpperCase());
                config.setFileNamingStyle(fileNamingStyle_);
            }
            catch (Exception ex)
            {
                throw new MojoExecutionException("Invalid fileNamingStyle value: " + fileNamingStyle
                            + "\nMust be one of: " + Arrays.asList(FileNamingStyle.values())
                            + "\n    " + ex.getMessage());
            }

        }
        catch (Exception ex)
        {
            throw new MojoExecutionException("Invalid input:\n    " + ex.getMessage(), ex);
        }

        final String furnaceVersion = versions.getProperty("version.furnace");
        if (furnaceVersion == null)
            throw new MojoExecutionException("Version of Furnace was not defined in 'version.furnace'.");

        final String forgeVersion = versions.getProperty("version.forge");
        if (forgeVersion == null)
            throw new MojoExecutionException("Version of Forge was not defined in 'version.forge'.");

        final String windupVersion_ = versions.getProperty("version.windup");
        if (null != windupVersion_)
            this.windupVersion = windupVersion_;
        if (null == this.windupVersion)
            throw new MojoExecutionException("Version of Windup which should be used was not defined in 'version.windup'.");

        try
        {
            Furnace furnace = createAndStartFurnace();
            install("org.jboss.forge.furnace.container:simple," + furnaceVersion, furnace); // :simple instead of :cdi
            install("org.jboss.forge.addon:core," + forgeVersion, furnace);
            install("org.jboss.windup:windup-tooling," + this.windupVersion, furnace);
            install("org.jboss.windup.rules.apps:windup-rules-java-project," + this.windupVersion, furnace);
            // This addon contains the TsGen service.
            install("org.jboss.windup.web.addons:windup-web-support," + this.windupVersion, furnace);

            AddonRegistry addonRegistry = furnace.getAddonRegistry();
            TypeScriptModelsGeneratingService generatingService = addonRegistry.getServices(TypeScriptModelsGeneratingService.class).get();

            generatingService.generate(config);

            getLog().info(
                        "\n\n=========================================================================================================================="
                                    + "\n\n    Windup TypeScript models created in " + config.getOutputPath().toFile().getAbsolutePath() + ""
                                    + "\n\n==========================================================================================================================\n");

            furnace.stop();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    /**
     * TODO: Copied from Windup. Refactor.
     */
    private void install(String addonCoordinates, Furnace furnace)
    {
        Version runtimeAPIVersion = AddonRepositoryImpl.getRuntimeAPIVersion();
        try
        {
            AddonDependencyResolver resolver = new MavenAddonDependencyResolver();
            AddonManagerImpl addonManager = new AddonManagerImpl(furnace, resolver);

            AddonId addon = null;
            // This allows windup --install maven
            if (addonCoordinates.contains(","))
                addon = AddonId.fromCoordinates(addonCoordinates);
            else
                addon = pickLatestAddonVersion(resolver, addonCoordinates, runtimeAPIVersion, addon);

            if (addon == null)
                throw new IllegalArgumentException("No compatible addon API version found for " + addonCoordinates + " for API " + runtimeAPIVersion);

            AddonActionRequest request = addonManager.install(addon);
            getLog().info("Requesting to install: " + request.toString());
            request.perform();
            getLog().info("Installation completed successfully.\n");
        }
        catch (Exception e)
        {
            getLog().error(e);
            getLog().error("> Forge version [" + runtimeAPIVersion + "]");
        }
    }

    private AddonId pickLatestAddonVersion(AddonDependencyResolver resolver, String addonCoordinates, Version runtimeAPIVersion, AddonId addon)
                throws IllegalArgumentException
    {
        AddonId[] versions = resolver.resolveVersions(addonCoordinates).get();
        if (versions.length == 0)
            throw new IllegalArgumentException("No Artifact version found for " + addonCoordinates);
        for (int i = versions.length - 1; i >= 0; i--)
        {
            String apiVersion = resolver.resolveAPIVersion(versions[i]).get();
            if (apiVersion != null && Versions.isApiCompatible(runtimeAPIVersion, SingleVersion.valueOf(apiVersion)))
                return versions[i];
        }
        return null;
    }

    private Properties loadVersions(String path) throws IOException
    {
        final InputStream propsFile = WindupTsModelGenMojo.class.getClassLoader().getResourceAsStream(path);
        Properties props = new Properties();
        props.load(propsFile);
        return props;
    }

}
