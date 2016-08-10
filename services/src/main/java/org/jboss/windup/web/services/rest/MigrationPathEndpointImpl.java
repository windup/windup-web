package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.MigrationPath;
import org.jboss.windup.web.services.service.MigrationPathService;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.util.Collection;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class MigrationPathEndpointImpl implements MigrationPathEndpoint
{
    @Inject
    private MigrationPathService migrationPathService;

    @Override
    public Collection<MigrationPath> getAvailablePaths()
    {
        return migrationPathService.findAll();
    }
}
