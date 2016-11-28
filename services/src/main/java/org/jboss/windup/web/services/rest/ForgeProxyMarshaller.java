package org.jboss.windup.web.services.rest;

import java.io.IOException;
import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Iterator;

import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.Provider;

import org.hibernate.proxy.pojo.javassist.JavassistLazyInitializer;
import org.jboss.forge.furnace.proxy.ClassLoaderAdapterCallback;
import org.jboss.forge.furnace.proxy.ClassLoaderInterceptor;
import org.jboss.forge.furnace.proxy.Proxies;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;

/**
 * This prevents Forge Proxies of the specified types from having their handler method serialized. In many cases this is necessary to prevent cyclic
 * properties.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Provider
@Produces("application/json")
public class ForgeProxyMarshaller extends JacksonJsonProvider
{
    @Override
    public void writeTo(Object value, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType,
                MultivaluedMap<String, Object> httpHeaders, OutputStream entityStream) throws IOException
    {
        ObjectMapper mapper = locateMapper(type, mediaType);
        // Suppress handler properties in JSON output
        mapper.addMixIn(JavassistLazyInitializer.class, CLACMixin.class);
        mapper.addMixIn(ClassLoaderAdapterCallback.class, CLACMixin.class);
        mapper.addMixIn(ClassLoaderInterceptor.class, CLACMixin.class);

        addMapperForProxyType(type, genericType, value, mapper);
        if (value instanceof Iterable)
        {
            Iterator<?> iterator = ((Iterable) value).iterator();
            if (iterator.hasNext())
                addMapperForProxyType(null, genericType, iterator.next(), mapper);
        }

        super.writeTo(value, type, genericType, annotations, mediaType, httpHeaders, entityStream);
    }

    private void addMapperForProxyType(Class<?> clazz, Type genericType, Object value, ObjectMapper mapper)
    {
        if (Proxies.isForgeProxy(value))
        {
            mapper.addMixIn(Proxies.unwrapProxyTypes(value.getClass()), CLACMixin.class);
            if (clazz != null)
                addMixin(mapper, clazz);

            if (genericType instanceof ParameterizedType)
            {
                for (Type type : ((ParameterizedType) genericType).getActualTypeArguments())
                {
                    if (type instanceof Class)
                        addMixin(mapper, (Class) type);
                }
            }
        }
    }

    private void addMixin(ObjectMapper mapper, Class<?> clazz)
    {
        if (clazz == null)
            return;

        mapper.addMixIn(clazz, CLACMixin.class);
        try
        {
            // try to make sure we have one from the local classloader too (could be the wrong classloader otherwise)
            Class<?> localClass = getClass().getClassLoader().loadClass(clazz.getName());
            mapper.addMixIn(localClass, CLACMixin.class);
        }
        catch (Throwable t)
        {
            // ignore
        }
    }

    private abstract class CLACMixin
    {
        @JsonIgnore
        public abstract ClassLoaderAdapterCallback getHandler();
    }
}
