package org.jboss.windup.web.addons.websupport.tsmodelgen;

import org.jboss.windup.util.exception.WindupException;

/**
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
interface ModelType
{
    static ModelType from(Class cls)
    {
        ModelType type = FrameType.from(cls);

        if (type == null)
            type = PrimitiveType.from(cls);

        if (type == null)
            throw new WindupException("Type was not recognized as a known frame model nor a primitive: " + cls.getName());
        
        return type;
    }

    String getTypeScriptTypeName();
}
