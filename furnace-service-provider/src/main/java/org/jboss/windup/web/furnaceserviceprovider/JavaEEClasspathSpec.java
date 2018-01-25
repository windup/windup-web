package org.jboss.windup.web.furnaceserviceprovider;

import java.util.HashSet;
import java.util.Set;

import org.jboss.forge.furnace.impl.modules.providers.AbstractModuleSpecProvider;
import org.jboss.modules.ModuleIdentifier;

/**
 * This module indicates to Forge that it should use the following set of classes from the parent classloader,
 * instead of from inside of an addon.
 *
 * The primary purpose is to provide direct access to unproxied classes from the Java EE server (eg, RESTEasy
 * and related context classes).
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class JavaEEClasspathSpec extends AbstractModuleSpecProvider
{
    public static final ModuleIdentifier ID = ModuleIdentifier.create("furnace.javaee.api");

    public static Set<String> paths = new HashSet<>();

    static
    {
        /*
         * Used by the graph
         */
        paths.add("com/sun/nio/file");

        /*
         *  Add the paths that we need from the Java EE server.
         */
        paths.add("javax/servlet");
        paths.add("javax/servlet/http");
        paths.add("javax/ws/rs/core");
        paths.add("javax/ws/rs");
        paths.add("META-INF/services");
    }

    @Override
    public ModuleIdentifier getId()
    {
        return ID;
    }

    @Override
    protected Set<String> getPaths()
    {
        return paths;
    }
}
