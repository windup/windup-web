package org.jboss.windup.web.furnaceserviceprovider;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.spi.CreationalContext;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Default;
import javax.enterprise.inject.spi.AfterBeanDiscovery;
import javax.enterprise.inject.spi.Bean;
import javax.enterprise.inject.spi.BeanManager;
import javax.enterprise.inject.spi.Extension;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.enterprise.inject.spi.InjectionTarget;
import javax.enterprise.util.AnnotationLiteral;

import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.addons.Addon;
import org.jboss.forge.furnace.addons.AddonStatus;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class FurnaceExtension implements Extension
{
    private static Logger LOG = Logger.getLogger(FurnaceExtension.class.getName());

    public static final String WINDUP_WEB_SUPPORT = "windup-web-support";
    public static final String PACKAGE_PREFIX = "org.jboss.windup.web";

    private FurnaceProducer furnaceProducer;

    public FurnaceExtension() {
    }

    private FurnaceProducer getFurnaceProducer()
    {
        if (furnaceProducer == null)
        {
            synchronized (FurnaceExtension.class)
            {
                FurnaceProducer furnaceProducer = new FurnaceProducer();
                furnaceProducer.setup(WebProperties.getInstance().getAddonRepository());
                this.furnaceProducer = furnaceProducer;
            }
        }
        return furnaceProducer;
    }

    public void afterBeanDiscovery(@Observes AfterBeanDiscovery abd, BeanManager beanManager)
    {
        FurnaceProducer furnaceProducer = getFurnaceProducer();
        addFurnace(abd, beanManager, furnaceProducer);

        HashSet<String> duplicateCheck = new HashSet<>();
        for (Addon addon : furnaceProducer.getFurnace().getAddonRegistry().getAddons())
        {
            if (addon.getId() == null || !addon.getId().toString().contains(WINDUP_WEB_SUPPORT))
                continue;

            awaitAddonStart(addon);

            if (addon.getStatus() == AddonStatus.STARTED)
            {
                // Copy them to prevent concurrent modification
                Set<Class<?>> exportedTypes = new HashSet<>(addon.getServiceRegistry().getExportedTypes());

                for (Class<?> exportedType : exportedTypes)
                {
                    addService(duplicateCheck, abd, beanManager, exportedType);
                }
            }
        }
    }

    private void awaitAddonStart(Addon addon) {
        long timeStarted = System.currentTimeMillis();
        while (isStarting(addon))
        {
            long timeDiff = System.currentTimeMillis() - timeStarted;
            if (timeDiff > 60000L)
                break;

            try
            {
                Thread.sleep(100L);
            } catch (InterruptedException e)
            {
                // Ignore the exception and move on
                break;
            }
        }
    }

    private boolean isStarting(Addon addon)
    {
        return addon.getStatus() == AddonStatus.LOADED || addon.getStatus() == AddonStatus.NEW;
    }

    private <T> void addService(final Set<String> duplicateCheck, final AfterBeanDiscovery abd, final BeanManager beanManager, final Class<T> incomingType)
    {
        final FurnaceProducer furnaceProducer = getFurnaceProducer();
        if (incomingType.getPackage() == null || !incomingType.getPackage().getName().startsWith(PACKAGE_PREFIX))
            return;

        if (duplicateCheck.contains(incomingType.getCanonicalName()))
            return;

        duplicateCheck.add(incomingType.getCanonicalName());

        final Class<T> type;
        boolean registerWithWeld = true;

        // Try to make sure that we are using the one from the local classloader instead of a Furnace addon classloader
        if (incomingType.getClassLoader().equals(FurnaceExtension.class.getClassLoader()))
        {
            type = incomingType;
        }
        else
        {
            Class<?> localType = incomingType;
            try
            {
                localType = getClass().getClassLoader().loadClass(incomingType.getCanonicalName());
            }
            catch (Throwable t)
            {
                LOG.fine("Failed to load: " + incomingType.getCanonicalName() + " due to: " + t.getMessage());
                registerWithWeld = false;
            }
            type = (Class<T>)localType;
        }

        if (registerWithWeld)
        {
            LOG.info("Registering type: " + type.getCanonicalName() + " Package: " + type.getPackage().getName());
            try
            {
                final InjectionTarget<T> it = new InjectionTarget<T>()
                {
                    @Override
                    public void inject(T instance, CreationalContext<T> ctx)
                    {
                    }

                    @Override
                    public void postConstruct(Object instance)
                    {

                    }

                    @Override
                    public void preDestroy(Object instance)
                    {

                    }

                    @Override
                    public T produce(CreationalContext<T> ctx)
                    {
                        return furnaceProducer.getFurnace().getAddonRegistry().getServices(type).iterator().next();
                    }

                    @Override
                    public void dispose(Object instance)
                    {
                    }

                    @Override
                    public Set<InjectionPoint> getInjectionPoints()
                    {
                        return Collections.emptySet();
                    }

                    @Override
                    public String toString()
                    {
                        return "InjectionTarget: " + type.getCanonicalName();
                    }
                };

                abd.addBean(new Bean<T>()
                {
                    @Override
                    public Class<?> getBeanClass()
                    {
                        return type;
                    }

                    @Override
                    public Set<InjectionPoint> getInjectionPoints()
                    {
                        return it.getInjectionPoints();
                    }

                    @Override
                    public boolean isNullable()
                    {
                        return false;
                    }

                    @Override
                    public Set<Type> getTypes()
                    {
                        return Collections.singleton(type);
                    }

                    @Override
                    public Set<Annotation> getQualifiers()
                    {
                        Set<Annotation> qualifiers = new HashSet<>();
                        qualifiers.add(new AnnotationLiteral<FromFurnace>(){});
                        return qualifiers;
                    }

                    @Override
                    public Class<? extends Annotation> getScope()
                    {
                        return ApplicationScoped.class;
                    }

                    @Override
                    public String getName()
                    {
                        String name = type.getSimpleName();
                        return name.substring(0, 1).toLowerCase() + name.substring(1);
                    }

                    @Override
                    public Set<Class<? extends Annotation>> getStereotypes()
                    {
                        return Collections.emptySet();
                    }

                    @Override
                    public boolean isAlternative()
                    {
                        return false;
                    }

                    @Override
                    public T create(CreationalContext<T> creationalContext)
                    {
                        T instance = it.produce(creationalContext);
                        it.inject(instance, creationalContext);
                        it.postConstruct(instance);
                        return instance;
                    }

                    @Override
                    public void destroy(T instance, CreationalContext<T> creationalContext)
                    {
                        it.preDestroy(instance);
                        it.dispose(instance);
                        creationalContext.release();
                    }

                    @Override
                    public String toString()
                    {
                        return "Bean: type = " + type.getCanonicalName();
                    }
                });
            }
            catch (Throwable t)
            {
                t.printStackTrace();
            }
        }

        if (type.getInterfaces() != null)
        {
            for (Class<?> iface : type.getInterfaces())
            {
                addService(duplicateCheck, abd, beanManager, iface);
            }
        }
    }

    private void addFurnace(AfterBeanDiscovery abd, BeanManager beanManager, FurnaceProducer furnaceProducer)
    {
        try
        {
            final InjectionTarget<Furnace> it = new InjectionTarget<Furnace>()
            {
                @Override
                public void inject(Furnace instance, CreationalContext<Furnace> ctx)
                {
                }

                @Override
                public void postConstruct(Furnace instance)
                {

                }

                @Override
                public void preDestroy(Furnace instance)
                {

                }

                @Override
                public Furnace produce(CreationalContext<Furnace> ctx)
                {
                    return furnaceProducer.getFurnace();
                }

                @Override
                public void dispose(Furnace instance)
                {
                    furnaceProducer.destroy(beanManager);
                }

                @Override
                public Set<InjectionPoint> getInjectionPoints()
                {
                    return Collections.emptySet();
                }

                @Override
                public String toString()
                {
                    return "FurnaceInjectionTarget";
                }
            };

            abd.addBean(new Bean<Furnace>()
            {
                @Override
                public Class<?> getBeanClass()
                {
                    return Furnace.class;
                }

                @Override
                public Set<InjectionPoint> getInjectionPoints()
                {
                    return it.getInjectionPoints();
                }

                @Override
                public boolean isNullable()
                {
                    return false;
                }

                @Override
                public Set<Type> getTypes()
                {
                    return Collections.singleton(Furnace.class);
                }

                @Override
                public Set<Annotation> getQualifiers()
                {
                    Set<Annotation> qualifiers = new HashSet<>();
                    qualifiers.add(new AnnotationLiteral<Default>()
                    {
                    });
                    qualifiers.add(new AnnotationLiteral<Any>()
                    {
                    });
                    return qualifiers;
                }

                @Override
                public Class<? extends Annotation> getScope()
                {
                    return ApplicationScoped.class;
                }

                @Override
                public String getName()
                {
                    return "furnace";
                }

                @Override
                public Set<Class<? extends Annotation>> getStereotypes()
                {
                    return Collections.emptySet();
                }

                @Override
                public boolean isAlternative()
                {
                    return false;
                }

                @Override
                public Furnace create(CreationalContext<Furnace> creationalContext)
                {
                    Furnace instance = it.produce(creationalContext);
                    it.inject(instance, creationalContext);
                    it.postConstruct(instance);
                    return instance;
                }

                @Override
                public void destroy(Furnace instance, CreationalContext<Furnace> creationalContext)
                {
                    it.preDestroy(instance);
                    it.dispose(instance);
                    creationalContext.release();
                }

                @Override
                public String toString()
                {
                    return "FurnaceBean";
                }
            });
        }
        catch (Throwable t)
        {
            t.printStackTrace();
        }
    }
}
