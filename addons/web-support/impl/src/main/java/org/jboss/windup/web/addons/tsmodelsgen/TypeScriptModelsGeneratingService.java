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
public class TypeScriptModelsGeneratingService
{

    @Inject GraphTypeManager graphTypeManager;
    
    public void generate(TypeScriptModelsGeneratorConfig config)
    {
        Set<Class<? extends WindupFrame<?>>> modelTypes = graphTypeManager.getRegisteredTypes();
        try
        {
            new TypeScriptModelsGenerator(config).generate(modelTypes);
        }
        catch (Exception ex)
        {
            throw new RuntimeException("Failed generating TypeScript models:\n\t" + ex.getMessage(), ex);
        }
    }
    
    /**
     * Returns an instance usable as configuration for the models generator.
     */
    public TypeScriptModelsGeneratorConfig createConfig()
    {
        return new TypeScriptModelsGeneratorConfig();
    }
    
}
