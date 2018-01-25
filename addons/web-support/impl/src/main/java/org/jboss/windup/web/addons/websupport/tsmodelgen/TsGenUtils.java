package org.jboss.windup.web.addons.websupport.tsmodelgen;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.lang.reflect.TypeVariable;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import com.syncleus.ferma.ClassInitializer;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public class TsGenUtils
{
    private static final Logger LOG = Logger.getLogger(TsGenUtils.class.getName());

    static String methodIdent(Method method)
    {
        //String[] params = (String[]) Arrays.asList(method.getParameterTypes()).stream().map((x) -> x.getSimpleName()).toArray();
        String params = Arrays.asList(method.getParameterTypes()).stream().map((x) -> x.getSimpleName()).collect(Collectors.joining(", "));

        return String.format("%s %s(%s) -> %s",
            method.getDeclaringClass().getSimpleName(),
            method.getName(),
            params,
            method.getReturnType().getSimpleName()
        );
    }

    /**
     * Returns the in or out type of given method, which is assumably implementing a bean property.
     * For getters, returns the return type. For setters, returns
     * the single (first) parameter. If the type is an Iterable&lt;T&gt;, returns T.
     */
    static Class getPropertyTypeFromMethod(Method method)
    {
        Class type = null;
        boolean setter = false;
        if (method.getName().startsWith("get") || method.getName().startsWith("is"))
            type = method.getReturnType();
        if (method.getName().startsWith("set") || method.getName().startsWith("add") || method.getName().startsWith("remove"))
        {
            setter = true;
            if (method.getParameterCount() == 2 && method.getParameterTypes()[1].isAssignableFrom(ClassInitializer.class))
            {
                // Ignore this case
            }
            else if (method.getParameterCount() != 1)
            {
                LOG.severe("Expected setter/adder/remover to have 1 parameter: " + method.toString());
            }
            if (method.getParameterCount() == 0)
                LOG.severe("Setter/adder/remover has no parameters: " + method.toString());
            else
            {
                final Class<?>[] parameterTypes = method.getParameterTypes();
                if (parameterTypes.length == 0)
                {
                    LOG.severe("Setter/adder/remover has no parameters: " + method.toString());
                    return null;
                }
                type = parameterTypes[0];
            }
        }
        if (type == null)
        {
            LOG.severe("Unknown kind of method (not get/set/add/remove): " + method.toString());
            return null;
        }
        if (Iterable.class.isAssignableFrom(type))
            return typeOfIterable(method, setter);
        else
            return type;
    }

    /**
     * Assuming the given method returns or takes an <code>Iterable&lt;T></code>, this determines the type T. T may or may not extend
     * WindupVertexFrame.
     */
    private static Class typeOfIterable(Method method, boolean setter)
    {
        Type type;
        if (setter)
        {
            Type[] types = method.getGenericParameterTypes();
            // The first parameter to the method expected to be Iterable<...> .
            if (types.length == 0)
                throw new IllegalArgumentException("Given method has 0 params: " + method);
            type = types[0];
        }
        else
        {
            type = method.getGenericReturnType();
        }
        // Now get the parametrized type of the generic.
        if (!(type instanceof ParameterizedType))
            throw new IllegalArgumentException("Given method's 1st param type is not parametrized generic: " + method);
        ParameterizedType pType = (ParameterizedType) type;
        final Type[] actualArgs = pType.getActualTypeArguments();
        if (actualArgs.length == 0)
            throw new IllegalArgumentException("Given method's 1st param type is not parametrized generic: " + method);

        Type t = actualArgs[0];
        if (t instanceof Class)
            return (Class<?>) t;
        if (t instanceof TypeVariable)
        {
            TypeVariable tv = (TypeVariable) actualArgs[0];
            // AnnotatedType[] annotatedBounds = tv.getAnnotatedBounds();
            // GenericDeclaration genericDeclaration = tv.getGenericDeclaration();
            return (Class) tv.getAnnotatedBounds()[0].getType();
        }
        throw new IllegalArgumentException("Unknown kind of type: " + t.getTypeName());
    }

    static String removePrefixAndSetMethodPresence(String name, String prefix, EnumSet<ModelMember.BeanMethodType> methodsPresent,
                ModelRelation.BeanMethodType flagToSetIfPrefixFound)
    {
        String name2 = StringUtils.removeStart(name, prefix);
        if (!name2.equals(name))
            methodsPresent.add(flagToSetIfPrefixFound);
        return name2;
    }

    static void quoteIfNotNull(StringBuilder sb, String val)
    {
        if (val == null)
            sb.append("null");
        else
            sb.append("'").append(val).append("'");
    }

    static String quoteIfNotNull(String val)
    {
        return (val == null) ? "null" : new StringBuilder("'").append(val).append("'").toString();
    }

    static String escapeJSandQuote(String str)
    {
        return String.format("'%s'", StringEscapeUtils.escapeEcmaScript(str));
    }

    static StringBuilder format(StringBuilder sb, String format, Serializable... args)
    {
        return sb.append(String.format(format, args));
    }

}
