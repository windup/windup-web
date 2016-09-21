package org.jboss.windup.web.addons.websupport.services;

import com.tinkerpop.blueprints.Vertex;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface WebGraphService
{
    Iterable<Vertex> getVerticesByType(String path, String vertexType);
}
