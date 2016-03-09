package org.jboss.windup.web.services.rest;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.annotation.Annotation;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.core.MediaType;

import org.jboss.windup.graph.model.WindupVertexFrame;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public abstract class AbstractMarshaller
{
    ObjectMapper getMapper()
    {
        MappingJsonFactory jsonFactory = new MappingJsonFactory();
        jsonFactory.disable(JsonGenerator.Feature.AUTO_CLOSE_TARGET);
        return new ObjectMapper(jsonFactory);
    }

    Map<String, PropertyDescriptor> getPropertyDescriptors(Class<?> type) throws IntrospectionException
    {
        BeanInfo info = Introspector.getBeanInfo(type);
        Map<String, PropertyDescriptor> results = new HashMap<>();

        for (PropertyDescriptor propertyDescriptor : info.getPropertyDescriptors())
            results.put(propertyDescriptor.getName(), propertyDescriptor);

        if (type.isInterface())
        {
            // we have to manually get the super-interfaces in this case
            for (Class<?> interfaceClass : type.getInterfaces())
            {
                Map<String, PropertyDescriptor> interfaceDescriptors = getPropertyDescriptors(interfaceClass);
                interfaceDescriptors.entrySet().forEach(interfaceDescriptor ->
                {
                    if (!results.containsKey(interfaceDescriptor.getKey()))
                        results.put(interfaceDescriptor.getKey(), interfaceDescriptor.getValue());
                });
            }
        }
        return results;
    }

    boolean isMarshallable(Class type, Type genericType, Annotation[] annotations, MediaType mediaType)
    {
        if (type == null)
            return false;

        boolean result = WindupVertexFrame.class.isAssignableFrom(type);
        boolean isCollection = Collection.class.isAssignableFrom(type);
        if (!result && isCollection && genericType instanceof ParameterizedType)
        {
            Class<? extends WindupVertexFrame> genericClass = getGenericTypeForCollection(genericType);
            result = genericClass != null;
        }
        return result;
    }

    Class<? extends WindupVertexFrame> getGenericTypeForCollection(Type genericType)
    {
        ParameterizedType parameterizedType = (ParameterizedType) genericType;
        if (parameterizedType.getActualTypeArguments().length > 0)
        {
            Type parameterType = parameterizedType.getActualTypeArguments()[0];
            if (parameterType instanceof Class && WindupVertexFrame.class.isAssignableFrom((Class<?>) parameterType))
                return (Class<? extends WindupVertexFrame>) parameterType;
            else
                return null;
        }
        return null;
    }
}
