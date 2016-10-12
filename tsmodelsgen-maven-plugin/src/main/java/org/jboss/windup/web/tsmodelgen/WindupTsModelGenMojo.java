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
import java.nio.file.Paths;
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
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.exec.configuration.options.OverwriteOption;
import org.jboss.windup.util.PathUtil;
import org.jboss.windup.util.exception.WindupException;
import org.jboss.windup.web.addons.tsmodelsgen.TypescriptModelsGeneratingService;

/**
 * Generates the Typescript models for Windup web.
 * The models are based on the Frames models available to Furnace from the addons added after starting Furnace.
 * 
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Mojo(name = "tsmodelgen", requiresDependencyResolution = ResolutionScope.COMPILE, aggregator = true)
@Execute(phase = LifecyclePhase.GENERATE_SOURCES)
public class WindupTsModelGenMojo extends AbstractMojo
{
    private static final String VERSION_DEFINITIONS_FILE = "META-INF/versions.properties";


    @Parameter(defaultValue = "${project.build.directory}")
    private String buildDirectory;

    /**
     * Location of the generated report files.
     */
    @Parameter( alias = "outputDir", property = "outputDir", required = false, defaultValue = "${project.build.directory}/tsModels")
    private String outputDirectory;

    /**
     * Location of the input file application.
     */
    @Parameter( alias = "inputDir",  property = "inputDir", required = false, defaultValue = "" )
    private String inputDirectory;

    /**
     * 
     */
    @Parameter( alias = "adjacencyMode", property = "adjacencyMode", required = false, defaultValue = "MATERIALIZED")
    private String adjacencyMode;

    @Parameter( alias = "overwrite",     property = "overwrite", required = false, defaultValue = "true" )
    private Boolean overwrite;

    @Parameter( alias = "windupVersion", property = "windupVersion", required = false )
    private String windupVersion;

    

    private static final String WINDUP_RULES_GROUP_ID = "org.jboss.windup.rules";
    private static final String WINDUP_RULES_ARTIFACT_ID = "windup-rulesets";


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

        final String furnaceVersion = versions.getProperty("version.furnace");
        if(furnaceVersion == null)
            throw new MojoExecutionException("Version of Furnace was not defined in 'version.furnace'.");

        final String forgeVersion = versions.getProperty("version.forge");
        if(forgeVersion == null)
            throw new MojoExecutionException("Version of Forge was not defined in 'version.forge'.");

        final String windupVersion_ = versions.getProperty("version.windup");
        if(null != windupVersion_)
            this.windupVersion = windupVersion_;
        if(null == this.windupVersion)
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
            TypescriptModelsGeneratingService generatingService = addonRegistry.getServices(TypescriptModelsGeneratingService.class).get();
            generatingService.generate(Paths.get(outputDirectory));
            
            getLog().info(
                "\n\n=========================================================================================================================="
              + "\n\n    Windup TypeScript models created in " + outputDirectory + ""
              + "\n\n==========================================================================================================================\n");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

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


    private AddonId pickLatestAddonVersion(AddonDependencyResolver resolver, String addonCoordinates, Version runtimeAPIVersion, AddonId addon) throws IllegalArgumentException
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

    private Properties loadVersions(String path) throws IOException {
        final InputStream propsFile = WindupTsModelGenMojo.class.getClassLoader().getResourceAsStream(path);
        Properties props = new Properties();
        props.load(propsFile);
        return props;
    }

}
