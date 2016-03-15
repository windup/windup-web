package org.jboss.windup.web.services.rest;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.io.IOException;
import java.io.InputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Proxy;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyReader;
import javax.ws.rs.ext.Provider;

import org.jboss.windup.graph.FramedElementInMemory;
import org.jboss.windup.graph.model.InMemoryVertexFrame;
import org.jboss.windup.graph.model.WindupVertexFrame;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tinkerpop.frames.VertexFrame;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Provider
@Consumes("application/json")
public class FrameUnmarshaller extends AbstractMarshaller implements MessageBodyReader
{
    private static Logger LOG = Logger.getLogger(FrameUnmarshaller.class.getSimpleName());

    @Override
    public boolean isReadable(Class type, Type genericType, Annotation[] annotations, MediaType mediaType)
    {
        return isMarshallable(type, genericType, annotations, mediaType);
    }

    @Override
    public Object readFrom(Class type, Type genericType, Annotation[] annotations, MediaType mediaType, MultivaluedMap httpHeaders,
                InputStream entityStream) throws IOException, WebApplicationException
    {
        if (Collection.class.isAssignableFrom(type))
            return deserializeCollection(genericType, entityStream);
        else if (WindupVertexFrame.class.isAssignableFrom(type))
            return deserializeFrame(type, entityStream);
        else
            throw new UnsupportedOperationException("Unsupported deserialization requested for type: " + type);
    }

    private Object deserializeCollection(Type genericType, InputStream inputStream) throws IOException
    {
        ObjectMapper objectMapper = getMapper();
        Collection<?> deserializedValues = objectMapper.readValue(inputStream, Collection.class);
        List<WindupVertexFrame> result = new ArrayList<>(deserializedValues.size());
        Class<? extends WindupVertexFrame> genericClass = getGenericTypeForCollection(genericType);
        if (genericClass == null)
            throw new UnsupportedOperationException("Unsupported demarshalling as generic type could not be determined!");



        for (Object value : deserializedValues)
        {
            if (!(value instanceof Map))
                throw new UnsupportedOperationException("Unsupported collection value: " + value);

            Map<?, ?> valueMap = (Map<?, ?>) value;

            WindupVertexFrame frame = deserializeFrame(genericClass, valueMap);
            result.add(frame);
        }

        return result;
    }

    private Object deserializeFrame(Class<? extends WindupVertexFrame> genericClass, InputStream inputStream) throws IOException
    {
        ObjectMapper objectMapper = getMapper();
        Map<?, ?> deserializedValues = objectMapper.readValue(inputStream, Map.class);
        return deserializeFrame(genericClass, deserializedValues);
    }

    private WindupVertexFrame deserializeFrame(Class<? extends WindupVertexFrame> genericClass, Map<?, ?> valueMap)
    {
        Map<String, PropertyDescriptor> propertyDescriptorMap;
        try
        {
            propertyDescriptorMap = getPropertyDescriptors(genericClass);
        }
        catch (IntrospectionException e)
        {
            throw new UnsupportedOperationException("Unable to introspect bean: " + genericClass + " due to: " + e.getMessage(), e);
        }

        Class<?>[] resolvedTypes = new Class<?>[] { VertexFrame.class, InMemoryVertexFrame.class, genericClass };
        WindupVertexFrame frame = (WindupVertexFrame) Proxy.newProxyInstance(genericClass.getClassLoader(), resolvedTypes,
                    new FramedElementInMemory<>(genericClass));

        for (Map.Entry<?, ?> entry : valueMap.entrySet())
        {
            if (!(entry.getKey() instanceof String))
                continue;

            String propertyName = (String) entry.getKey();
            Object propertyValue = entry.getValue();

            PropertyDescriptor propertyDescriptor = propertyDescriptorMap.get(propertyName);
            if (propertyDescriptor == null || propertyDescriptor.getWriteMethod() == null)
                continue;

            try
            {
                propertyDescriptor.getWriteMethod().invoke(frame, propertyValue);
            }
            catch (IllegalAccessException | InvocationTargetException e)
            {
                LOG.warning("Failed to set property: " + propertyName + " due to: " + e.getMessage());
            }
        }
        return frame;
    }
}
