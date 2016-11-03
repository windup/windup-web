package org.jboss.windup.web.addons.websupport.tsmodelgen;

/**
 * Generates TypeScript models based on the Tinkerpop Frames models
 * according to the provided configuration.
 * 
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public interface TypeScriptModelsGeneratingService
{
    /**
     *  Generates typescript models based upon the provided configuration.
     */
    void generate(TypeScriptModelsGeneratorConfig config);
}
