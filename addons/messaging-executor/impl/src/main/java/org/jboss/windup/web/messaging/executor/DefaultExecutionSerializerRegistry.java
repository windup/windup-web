package org.jboss.windup.web.messaging.executor;

import org.apache.commons.lang3.StringUtils;
import org.jboss.forge.furnace.services.Imported;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.HashMap;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
public class DefaultExecutionSerializerRegistry implements ExecutionSerializerRegistry
{
    private Map<String, ExecutionSerializer> serializers = new HashMap<>();

    @Inject
    Imported<ExecutionSerializer> furnaceSerializers;

    @PostConstruct
    public void postConstruct()
    {
        for (ExecutionSerializer serializer : this.furnaceSerializers)
        {
            registerSerializer(serializer);
        }
    }

    @Override
    public ExecutionSerializer getDefaultSerializer()
    {
        String defaultSerializerName = System.getProperty(ExecutionSerializerRegistry.SYSTEM_PROPERTY_DEFAULT_SERIALIZER);
        if (StringUtils.isBlank(defaultSerializerName))
            defaultSerializerName = ExecutionSerializerRegistry.DEFAULT_EXECUTION_SERIALIZER;

        return getSerializer(defaultSerializerName);
    }

    @Override
    public void registerSerializer(ExecutionSerializer serializer)
    {
        String name = serializer.getName();
        if (serializers.containsKey(name))
            throw new DuplicateSerializerException("Serializer with name " + name + " already registered!");
        this.serializers.put(name, serializer);
    }

    @Override
    public ExecutionSerializer getSerializer(String name)
    {
        return this.serializers.get(name);
    }
}
