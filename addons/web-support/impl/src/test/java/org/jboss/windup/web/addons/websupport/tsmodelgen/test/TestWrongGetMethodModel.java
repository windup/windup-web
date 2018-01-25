package org.jboss.windup.web.addons.websupport.tsmodelgen.test;

import org.jboss.windup.graph.Property;
import org.jboss.windup.graph.model.TypeValue;
import org.jboss.windup.graph.model.WindupVertexFrame;

/**
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@TypeValue(TestWrongGetMethodModel.TYPE)
public interface TestWrongGetMethodModel extends WindupVertexFrame
{
    String TYPE = "testWrongGetMethod";
    String PROP = "prop";

    @Property(PROP)
    void getBogusModel(String anything);

    @Property(PROP)
    void setBogusModel(String anything);
}
