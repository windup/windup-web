package org.jboss.windup.web.addons.tsmodelsgen;

import java.nio.file.Path;
import java.util.Set;
import javax.inject.Inject;
import org.jboss.windup.graph.GraphTypeManager;
import org.jboss.windup.graph.model.WindupFrame;

/**
 * The service to generate the typescript models.
 * 
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public class TypescriptModelsGeneratingService {

    @Inject GraphTypeManager graphTypeManager;
    
    public void generate(Path destDirPath){
        Set<Class<? extends WindupFrame<?>>> modelTypes = graphTypeManager.getRegisteredTypes();
        try
        {
            destDirPath.toFile().mkdirs();
            new TypeScriptModelsGenerator(destDirPath).generate(modelTypes, TypeScriptModelsGenerator.AdjacentMode.MATERIALIZED);
        }
        catch (Exception ex)
        {
            throw new RuntimeException("Failed generating TypeScript models:\n\t" + ex.getMessage(), ex);
        }
    }
    
}
