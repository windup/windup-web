package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.HashMap;
import java.util.Map;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.web.addons.websupport.services.dependencies.DependenciesDTO;
import org.jboss.windup.web.addons.websupport.services.dependencies.LibraryDependenciesService;
import org.jboss.windup.web.addons.websupport.services.dependencies.TechnologiesDependenciesService;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class DependenciesReportResourceImpl extends AbstractGraphResource implements DependenciesReportResource
{
    @Inject
    LibraryDependenciesService libraryDependenciesService;

    @Inject
    Instance<TechnologiesDependenciesService> technologiesDependenciesService;

    @Override
    public Object getDependencies(Long executionId)
    {
        GraphContext graphContext = this.getGraph(executionId);
        this.libraryDependenciesService.setGraphContext(graphContext);

        return this.getResult(this.libraryDependenciesService.getDependencies());
    }

    @Override
    public Object getTechnologiesDependencies(Long executionId)
    {
        GraphContext graphContext = this.getGraph(executionId);
        TechnologiesDependenciesService technologiesDependenciesService = this.technologiesDependenciesService.get();
        technologiesDependenciesService.setGraphContext(graphContext);

        return this.getResult(technologiesDependenciesService.getDependencies());
    }

    /**
     * This method exists because JAX-RS was returning some metadata which were not supposed to be there.
     * It might be something related to DI container, class loading or whatever.
     * It was returning handler, delegate and initialCallingLoader.
     * And also throwing com.fasterxml.jackson.databind.JsonMappingException: Direct self-reference leading to cycle
     *
     * @param dependenciesDTO Dependencies data object
     * @return Result map
     */
    protected Map<String, Object> getResult(DependenciesDTO dependenciesDTO)
    {
        Map<String, Object> resultMap = new HashMap<>();

        resultMap.put("nodes", dependenciesDTO.getNodes());
        resultMap.put("edges", dependenciesDTO.getEdges());

        return resultMap;
    }
}
