package org.jboss.windup.web.addons.websupport.tsmodelgen;

import java.nio.file.Path;

/**
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public class TypeScriptModelsGeneratorConfig
{
    public static enum AdjacencyMode { PROXIED, MATERIALIZED, MIXED, DECORATED; }
    public static enum FileNamingStyle { CAMELCASE, LOWERCASE_DASHES, LOWERCASE_DOTS; }


    private Path outputPath;
    private Path importPathToWebapp;
    private AdjacencyMode adjacencyMode;
    private FileNamingStyle fileNamingStyle;


    /**
     * Location of the generated report files.
     */
    public Path getOutputPath()
    {
        return outputPath;
    }

    /**
     * Location of the generated report files.
     */
    public TypeScriptModelsGeneratorConfig setOutputPath(Path outputPath)
    {
        this.outputPath = outputPath;
        return this;
    }

    /**
     * Path the webapp/ dir which will be used for the generated TS models imports.
     * E.g. <code>import {...} from '$importPathToWebapp';</code>
     */
    public Path getImportPathToWebapp()
    {
        return importPathToWebapp;
    }

    /**
     * Path the webapp/ dir which will be used for the generated TS models imports.
     * E.g. <code>import {...} from '$importPathToWebapp';</code>
     */
    public TypeScriptModelsGeneratorConfig setImportPathToWebapp(Path importPathToWebapp)
    {
        this.importPathToWebapp = importPathToWebapp;
        return this;
    }

    /**
     * How adjacency is handled - plain arrays ('MATERIALIZED') or proxied methods ('PROXIED').
     */
    public AdjacencyMode getAdjacencyMode()
    {
        return adjacencyMode;
    }

    /**
     * How adjacency is handled - plain arrays ('MATERIALIZED') or proxied methods ('PROXIED').
     */
    public TypeScriptModelsGeneratorConfig setAdjacencyMode(AdjacencyMode adjacencyMode)
    {
        this.adjacencyMode = adjacencyMode;
        return this;
    }

    /**
     * FooModel.ts vs foo.model.ts vs foo-model.ts.
     */
    public FileNamingStyle getFileNamingStyle()
    {
        return fileNamingStyle;
    }

    /**
     * FooModel.ts vs foo.model.ts vs foo-model.ts.
     */
    public TypeScriptModelsGeneratorConfig setFileNamingStyle(FileNamingStyle fileNamingStyle)
    {
        this.fileNamingStyle = fileNamingStyle;
        return this;
    }

}
