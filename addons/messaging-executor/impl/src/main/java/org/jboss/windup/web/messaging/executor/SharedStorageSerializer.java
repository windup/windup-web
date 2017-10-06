package org.jboss.windup.web.messaging.executor;

/**
 * This serializer relies on the sender and the receiver having access to a shared persistence volume that is mounted on the same path on both
 * systems.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class SharedStorageSerializer extends AbstractSerializer implements ExecutionSerializer
{
    @Override
    public String getName()
    {
        return ExecutionSerializerRegistry.SHARED_STORAGE_SERIALIZER;
    }
}
