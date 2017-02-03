package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;

/**
 * Contains messages that apply at the application level.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class ApplicationMessageDTO
{
    String message;
    String ruleID;

    public ApplicationMessageDTO()
    {
    }

    public ApplicationMessageDTO(String message, String ruleID)
    {
        this.message = message;
        this.ruleID = ruleID;
    }

    /**
     * Contains the message text.
     */
    public String getMessage()
    {
        return message;
    }

    /**
     * Contains the id of the rule that generated this message.
     */
    public String getRuleID()
    {
        return ruleID;
    }
}
