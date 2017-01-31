package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.config.RuleUtils;
import org.ocpsoft.rewrite.config.Rule;

/**
 * This class exists so that the services.war can access the formatting utilities without having to make static calls.
 *
 * Basically, it is just insuring that the calls into the Windup runtime inside of Forge happen directly from a Forge
 * service, which works around some classloading issues.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class RuleFormatterService
{
    /**
     * Returns a String representation of the given rule. This will return the literal XML if it is originally
     * an XML rule.
     */
    public String ruleToRuleContentsString(Rule rule)
    {
        return RuleUtils.ruleToRuleContentsString(rule, 0);
    }
}
