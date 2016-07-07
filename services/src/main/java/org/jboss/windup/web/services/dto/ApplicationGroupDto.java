package org.jboss.windup.web.services.dto;

import org.jboss.windup.web.addons.websupport.model.ApplicationGroupModel;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ApplicationGroupDto
{
    private ApplicationGroupModel group;
    private Iterable<RegisteredApplicationDto> registeredApplications;

    public ApplicationGroupDto()
    {
    }

    public ApplicationGroupDto(ApplicationGroupModel group)
    {
        this.group = group;
    }

    public ApplicationGroupDto(ApplicationGroupModel group, Iterable<RegisteredApplicationDto> registeredApplications)
    {
        this.group = group;
        this.registeredApplications = registeredApplications;
    }

    public ApplicationGroupModel getGroup()
    {
        return group;
    }

    public void setGroup(ApplicationGroupModel group)
    {
        this.group = group;
    }

    public Iterable<RegisteredApplicationDto> getRegisteredApplications()
    {
        return registeredApplications;
    }

    public void setRegisteredApplications(Iterable<RegisteredApplicationDto> registeredApplications)
    {
        this.registeredApplications = registeredApplications;
    }
}
