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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.jaxrs.cfg.Annotations;
import com.syncleus.ferma.AbstractElementFrame;
import com.syncleus.ferma.AbstractVertexFrame;
import com.syncleus.ferma.ElementFrame;
import com.syncleus.ferma.FramedGraph;
import com.syncleus.ferma.VertexFrame;
import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.GraphTraversal;
import org.apache.tinkerpop.gremlin.structure.Vertex;
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
        mapper.addMixIn(Object.class, CLACMixin.class);

        super.writeTo(value, type, genericType, annotations, mediaType, httpHeaders, entityStream);
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

    @JsonIgnoreProperties({"handler", "rawTraversal", "graph", "wrappedGraph"})
    private abstract class CLACMixin
    {
    }
}
