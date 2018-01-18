package org.jboss.windup.web.addons.websupport.tsmodelgen;

import org.jboss.windup.graph.model.TypeValue;
import org.jboss.windup.graph.model.WindupFrame;

/**
 * Handles WindupFrame's.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
class FrameType implements ModelType
{
    private Class<? extends WindupFrame> frameType;

    public FrameType(Class<? extends WindupFrame> frameType)
    {
        this.frameType = frameType;
    }

    static FrameType from(Class cls)
    {
        if (WindupFrame.class.isAssignableFrom(cls))
        {
            return new FrameType(cls);
        }
        return null;
    }

    public String getFrameDiscriminator()
    {
        if (frameType.getAnnotation(TypeValue.class) == null)
        {
            throw new IllegalStateException("Missing @" + TypeValue.class.getSimpleName() + ": " + frameType.getName());
        }
        return frameType.getAnnotation(TypeValue.class).value();
    }

    @Override
    public String getTypeScriptTypeName()
    {
        return frameType.getSimpleName();
    }

    @Override
    public String toString()
    {
        return "FrameType{" + (frameType == null ? "null" : frameType.getSimpleName()) + '}';
    }
}
