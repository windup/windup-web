package org.jboss.windup.web.addons.websupport.model;

import com.tinkerpop.frames.Property;
import com.tinkerpop.frames.modules.typedgraph.TypeValue;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@TypeValue(RegisteredApplicationModel.TYPE)
public interface RegisteredApplicationModel extends WindupWebSupportVertexFrame
{
    String TYPE = TYPE_PREFIX + "RegisteredApplicationModel";

    String INPUT_PATH = "inputPath";
    String INPUT_FILENAME = "inputFilename";
    String OUTPUT_PATH = "outputPath";

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
