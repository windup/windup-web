package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.config.metadata.LabelProviderRegistry;

import java.nio.file.Path;
import java.util.Collection;

/**
 * @author <a href="mailto:carlosthe19916@gmail.com">Carlos Feria</a>
 */
public interface LabelProviderService
{
    LabelProviderRegistry loadLabelProviderRegistry(
            Collection<Path> labelPaths,
            boolean labelRulesOnly);
}
