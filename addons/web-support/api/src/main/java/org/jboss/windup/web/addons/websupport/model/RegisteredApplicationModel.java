package org.jboss.windup.web.addons.websupport.model;

import com.tinkerpop.frames.Property;
import com.tinkerpop.frames.modules.typedgraph.TypeValue;
import org.jboss.windup.graph.Indexed;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@TypeValue(RegisteredApplicationModel.TYPE)
public interface RegisteredApplicationModel extends WindupWebSupportVertexFrame
{
    String TYPE = TYPE_PREFIX + "RegisteredApplicationModel/";

    String INPUT_PATH = TYPE + "inputPath";
    String INPUT_FILENAME = TYPE + "inputFilename";
    String OUTPUT_PATH = TYPE + "outputPath";

    @Indexed
    @Property(INPUT_PATH)
    String getInputPath();

    @Property(INPUT_PATH)
    void setInputPath(String path);

    @Property(INPUT_FILENAME)
    String getInputFilename();

    @Property(INPUT_FILENAME)
    void setInputFilename(String filename);

    @Property(OUTPUT_PATH)
    String getOutputPath();

    @Property(OUTPUT_PATH)
    void setOutputPath(String path);

}
