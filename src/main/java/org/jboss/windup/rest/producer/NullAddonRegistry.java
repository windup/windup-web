package org.jboss.windup.rest.producer;

import java.util.Set;

import org.jboss.forge.furnace.addons.Addon;
import org.jboss.forge.furnace.addons.AddonFilter;
import org.jboss.forge.furnace.addons.AddonId;
import org.jboss.forge.furnace.addons.AddonRegistry;
import org.jboss.forge.furnace.repositories.AddonRepository;
import org.jboss.forge.furnace.services.Imported;

public class NullAddonRegistry implements AddonRegistry
{

    @Override
    public String getName()
    {
        return null;
    }

    @Override
    public void dispose()
    {

    }

    @Override
    public Addon getAddon(AddonId id)
    {
        return null;
    }

    @Override
    public Set<Addon> getAddons()
    {
        return null;
    }

    @Override
    public Set<Addon> getAddons(AddonFilter filter)
    {
        return null;
    }

    @Override
    public Set<AddonRepository> getRepositories()
    {
        return null;
    }

    @Override
    public <T> Imported<T> getServices(Class<T> clazz)
    {
        return null;
    }

    @Override
    public <T> Imported<T> getServices(String clazz)
    {
        return null;
    }

    @Override
    public Set<Class<?>> getExportedTypes()
    {
        return null;
    }

    @Override
    public <T> Set<Class<T>> getExportedTypes(Class<T> type)
    {
        return null;
    }

    @Override
    public long getVersion()
    {
        return 0;
    }

}
