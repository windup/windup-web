package org.jboss.windup.rest.producer;

import java.util.Set;
import java.util.concurrent.Future;

import org.jboss.forge.furnace.addons.Addon;
import org.jboss.forge.furnace.addons.AddonDependency;
import org.jboss.forge.furnace.addons.AddonId;
import org.jboss.forge.furnace.addons.AddonStatus;
import org.jboss.forge.furnace.event.EventManager;
import org.jboss.forge.furnace.repositories.AddonRepository;
import org.jboss.forge.furnace.spi.ServiceRegistry;

final class NullAddon implements Addon
{
    @Override
    public AddonStatus getStatus()
    {
        return null;
    }

    @Override
    public ServiceRegistry getServiceRegistry()
    {
        return null;
    }

    @Override
    public AddonRepository getRepository()
    {
        return null;
    }

    @Override
    public AddonId getId()
    {
        return null;
    }

    @Override
    public Future<Void> getFuture()
    {
        return null;
    }

    @Override
    public EventManager getEventManager()
    {
        return null;
    }

    @Override
    public Set<AddonDependency> getDependencies()
    {
        return null;
    }

    @Override
    public ClassLoader getClassLoader()
    {
        return null;
    }
}