package org.jboss.windup.web.messaging.executor;

/**
 * Contains a registry of serializers and deserializers. These handle the process of
 * communicating execution configuration data and results.
 *
 * {@link ExecutionSerializer}s from within the Furnace addons will be registered automatically. If
 * any are implemented outside of Furnace, they will need to be registered manually.
 *
 * This should be implemented as a Singleton.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface ExecutionSerializerRegistry
{
    /**
     * This system property can be used to control which serialization approach is used.
     */
    String SYSTEM_PROPERTY_DEFAULT_SERIALIZER = "messaging.serializer";

    /**
     * This approach uses AMQ large messages to send files between the executor system and the services.
     */
    String AMQ_LARGE_MESSAGE_SERIALIZER = "amq.largemessage";

    /**
     * This approach uses http to transport the file data.
     */
    String HTTP_POST_SERIALIZER = "http.post.serializer";

    /**
     * This approach uses a shared storage volume to share data between the executors and the main system.
     * This is the default configuration.
     */
    String SHARED_STORAGE_SERIALIZER = "shared.storage";

    /**
     * This sets the default to the shared storage approach.
     */
    String DEFAULT_EXECUTION_SERIALIZER = SHARED_STORAGE_SERIALIZER;

    /**
     * This returns the default serializer based upon what is set in the {@link ExecutionSerializerRegistry#SYSTEM_PROPERTY_DEFAULT_SERIALIZER}
     * property. If no property is specified, then it will use the {@link ExecutionSerializerRegistry#DEFAULT_EXECUTION_SERIALIZER_REGISTRY}.
     */
    ExecutionSerializer getDefaultSerializer();

    /**
     * Register the given serializer with the given name. This will throw a {@link DuplicateSerializerException}
     * if another has already been registered with this name.
     */
    void registerSerializer(ExecutionSerializer serializer);

    /**
     * Gets the {@link ExecutionSerializer} with the given name. If none exists with the given name,
     * then this will return null.
     */
    ExecutionSerializer getSerializer(String name);
}
