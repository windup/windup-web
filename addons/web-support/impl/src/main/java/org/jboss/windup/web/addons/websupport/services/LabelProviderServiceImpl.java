package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.config.loader.LabelLoader;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.LabelProviderRegistry;

import javax.inject.Inject;
import java.nio.file.Path;
import java.util.Collection;

/**
 * @author <a href="mailto:carlosthe19916@gmail.com">Carlos Feria</a>
 */
public class LabelProviderServiceImpl implements LabelProviderService
{

    @Inject
    private LabelLoader labelLoader;

    @Override
    public LabelProviderRegistry loadLabelProviderRegistry(Collection<Path> labelPaths, boolean fileLabelsOnly)
    {
        RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(labelPaths, null);
        if (fileLabelsOnly)
            ruleLoaderContext.setFileBasedRulesOnly();
        return labelLoader.loadConfiguration(ruleLoaderContext);
    }
}
