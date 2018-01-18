package org.jboss.windup.web.addons.websupport.tsmodelgen.test;

import com.syncleus.ferma.annotations.Incidence;
import org.apache.tinkerpop.gremlin.structure.Direction;
import org.jboss.windup.graph.Adjacency;
import org.jboss.windup.graph.model.TypeValue;
import org.jboss.windup.graph.model.WindupVertexFrame;

/**
 * Has relations to an unacceptable type (not a model).
 * 
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@TypeValue(TestWrongRelTypeModel.TYPE)
public interface TestWrongRelTypeModel extends WindupVertexFrame
{
    String TYPE = "TestWrongRelType";
    String ADJ = "adj";
    String INC = "inc";


    @Adjacency(label = ADJ, direction = Direction.OUT)
    java.util.Formatter getBogusModel();

    @Adjacency(label = ADJ, direction = Direction.OUT)
    void setBogusModel(java.util.Formatter anything);

    @Incidence(label = INC, direction = Direction.OUT)
    Iterable<java.util.Formatter> getArchives();

    @Incidence(label = INC, direction = Direction.OUT)
    TestWrongRelTypeModel addArchiveModel(java.util.Formatter archiveModel);
}
