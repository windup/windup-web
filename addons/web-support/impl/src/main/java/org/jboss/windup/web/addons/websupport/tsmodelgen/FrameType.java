package org.jboss.windup.web.addons.websupport.tsmodelgen;

import com.tinkerpop.frames.modules.typedgraph.TypeValue;
import org.jboss.windup.graph.model.WindupVertexFrame;

/**
 * Handles WindupVertexFrame's.
 * 
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
class FrameType implements ModelType
{
    private Class<? extends WindupVertexFrame> frameType;

    public FrameType(Class<? extends WindupVertexFrame> frameType) {
        this.frameType = frameType;
    }

    static FrameType from(Class cls) {
        if (WindupVertexFrame.class.isAssignableFrom(cls)) {
            return new FrameType(cls);
        }
        return null;
    }

    public String getFrameDiscriminator() {
        if (frameType.getAnnotation(TypeValue.class) == null) {
            throw new IllegalStateException("Missing @" + TypeValue.class.getSimpleName() + ": " + frameType.getName());
        }
        return frameType.getAnnotation(TypeValue.class).value();
    }

    @Override
    public String getTypeScriptTypeName() {
        return frameType.getSimpleName();
    }

}
