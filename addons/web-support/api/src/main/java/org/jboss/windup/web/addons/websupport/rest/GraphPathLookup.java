package org.jboss.windup.web.addons.websupport.rest;

import java.nio.file.Path;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface GraphPathLookup
{
    Path getByExecutionID(long executionID);
}
