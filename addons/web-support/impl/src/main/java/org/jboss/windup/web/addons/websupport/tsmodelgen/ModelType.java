package org.jboss.windup.web.addons.websupport.tsmodelgen;

import org.apache.commons.lang3.ObjectUtils;

/**
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
interface ModelType
{
    String getTypeScriptTypeName();

    static ModelType from(Class cls) {
        return ObjectUtils.defaultIfNull(FrameType.from(cls), PrimitiveType.from(cls));
    }
}
