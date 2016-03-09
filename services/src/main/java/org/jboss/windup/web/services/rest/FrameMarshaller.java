package org.jboss.windup.web.services.rest;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;

import org.apache.commons.lang3.StringUtils;
import org.jboss.windup.graph.model.WindupVertexFrame;

import com.tinkerpop.frames.Property;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Provider
@Produces("application/json")
public class FrameMarshaller extends AbstractMarshaller implements MessageBodyWriter
{
    @Override
    public boolean isWriteable(Class type, Type genericType, Annotation[] annotations, MediaType mediaType)
    {
        return isMarshallable(type, genericType, annotations, mediaType);
    }

    @Override
    @Deprecated
    public long getSize(Object o, Class type, Type genericType, Annotation[] annotations, MediaType mediaType)
    {
        return -1;
    }

    @Override
    public void writeTo(Object o, Class type, Type genericType, Annotation[] annotations, MediaType mediaType, MultivaluedMap httpHeaders,
                OutputStream entityStream) throws IOException, WebApplicationException
    {
        Object mapped = mapObject(o, type, genericType, annotations, mediaType, httpHeaders, entityStream);
        getMapper().writeValue(entityStream, mapped);
    }

    private Object mapObject(Object o, Class type, Type genericType, Annotation[] annotations, MediaType mediaType, MultivaluedMap httpHeaders,
                OutputStream entityStream) throws IOException
    {
        if (Collection.class.isAssignableFrom(type))
            return mapCollection(o, type, genericType, annotations, mediaType, httpHeaders, entityStream);
        else if (WindupVertexFrame.class.isAssignableFrom(type))
            return mapFrame(o, type, genericType, annotations, mediaType, httpHeaders, entityStream);
        else
            throw new UnsupportedOperationException("Unsupported deserialization requested for type: " + type);
    }

    private Object mapCollection(Object o, Class type, Type genericType, Annotation[] annotations, MediaType mediaType,
                MultivaluedMap httpHeaders, OutputStream entityStream) throws IOException
    {
        Collection<?> collection = (Collection<?>) o;
        List mappedList = new ArrayList<>(collection.size());

        for (Object collectionItem : collection)
        {
            mappedList.add(mapObject(collectionItem, collectionItem.getClass(), null, annotations, mediaType, httpHeaders, entityStream));
        }
        return mappedList;
    }

    private Object mapFrame(Object o, Class type, Type genericType, Annotation[] annotations, MediaType mediaType,
                MultivaluedMap httpHeaders, OutputStream entityStream) throws IOException
    {
        if (o == null)
            return null;

        try
        {
            Map<String, Object> value = new HashMap<>();

            for (PropertyDescriptor propertyDescriptor : getPropertyDescriptors(type).values())
            {
                String propertyName = propertyDescriptor.getName();

                Method readMethod = propertyDescriptor.getReadMethod();
                if (readMethod == null)
                    continue;

                Property propertyAnnotation = getAnnotation(readMethod, Property.class);
                if (propertyAnnotation == null)
                    continue;

                Object propertyValue = readMethod.invoke(o);
                value.put(propertyName, propertyValue);
            }

            return value;
        }
        catch (IntrospectionException | InvocationTargetException | IllegalAccessException e)
        {
            throw new WebApplicationException("Failed to serialize entity: " + o + " due to: " + e.getMessage(), e);
        }
    }

    private <A extends Annotation> A getAnnotation(Method method, Class<A> annotationType)
    {
        A annotation = method.getAnnotation(annotationType);
        if (annotation != null)
            return annotation;

        Class<?> declaringClass = method.getDeclaringClass();
        return getAnnotation(declaringClass, method, annotationType);
    }

    private <A extends Annotation> A getAnnotation(Class<?> clazz, Method originalMethod, Class<A> annotationType)
    {
        if (clazz == null)
            return null;

        for (Method method : clazz.getMethods())
        {
            if (StringUtils.equals(method.getName(), originalMethod.getName()) && method.getReturnType().equals(originalMethod.getReturnType())
                        && equalParamTypes(method.getParameterTypes(), originalMethod.getParameterTypes()))
            {
                A annotation = method.getAnnotation(annotationType);
                if (annotation != null)
                    return annotation;
            }
        }

        for (Class<?> iface : clazz.getInterfaces())
        {
            A annotation = getAnnotation(iface, originalMethod, annotationType);
            if (annotation != null)
                return annotation;
        }

        A annotation = getAnnotation(clazz.getSuperclass(), originalMethod, annotationType);
        return annotation;
    }

    boolean equalParamTypes(Class<?>[] params1, Class<?>[] params2)
    {
        /* Avoid unnecessary cloning */
        if (params1.length == params2.length)
        {
            for (int i = 0; i < params1.length; i++)
            {
                if (params1[i] != params2[i])
                    return false;
            }
            return true;
        }
        return false;
    }
}
