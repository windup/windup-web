package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.config.metadata.RuleProviderRegistry;

import java.nio.file.Path;
import java.util.Collection;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface RuleProviderService
{
    RuleProviderRegistry loadRuleProviderRegistry(Collection<Path> rulePaths);
}
