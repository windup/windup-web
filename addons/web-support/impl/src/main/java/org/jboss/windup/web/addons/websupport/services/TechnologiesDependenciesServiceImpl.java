package org.jboss.windup.web.addons.websupport.services;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.DuplicateProjectModel;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.rules.apps.java.model.JavaClassModel;
import org.jboss.windup.rules.apps.javaee.model.EjbMessageDrivenModel;
import org.jboss.windup.rules.apps.javaee.model.JNDIResourceModel;
import org.jboss.windup.rules.apps.javaee.model.JaxRSWebServiceModel;
import org.jboss.windup.rules.apps.javaee.model.JaxWSWebServiceModel;
import org.jboss.windup.rules.apps.javaee.model.JmsDestinationModel;
import org.jboss.windup.rules.apps.javaee.model.JmsDestinationType;
import org.jboss.windup.web.addons.websupport.services.dependencies.DependenciesDTO;
import org.jboss.windup.web.addons.websupport.services.dependencies.GraphEdge;
import org.jboss.windup.web.addons.websupport.services.dependencies.GraphNode;
import org.jboss.windup.web.addons.websupport.services.dependencies.TechnologiesDependenciesService;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class TechnologiesDependenciesServiceImpl implements TechnologiesDependenciesService
{
    private GraphContext graphContext;

    private Map<ProjectModel, GraphNode> projectModels = new HashMap<>();

    private Set<GraphNode> graphNodes = new HashSet<>();

    private Set<GraphEdge> graphEdges = new HashSet<>();

    public void setGraphContext(GraphContext context)
    {
        this.graphContext = context;
    }

    public GraphNode getOrCreateProjectModelGraphNode(ProjectModel projectModel)
    {
        if (projectModel instanceof DuplicateProjectModel)
        {
            projectModel = ((DuplicateProjectModel) projectModel).getCanonicalProject();
        }

        if (!this.projectModels.containsKey(projectModel))
        {
            Map<String, Object> data = new HashMap<>();

            FileModel rootFileModel = projectModel.getRootFileModel();

            if (rootFileModel != null)
            {
                data.put("filePath", rootFileModel.getFilePath());
                data.put("fileName", rootFileModel.getFileName());
            }

            GraphNode graphNode = new GraphNode(projectModel.getName(), data, "Application");

            this.projectModels.put(projectModel, graphNode);
            this.graphNodes.add(graphNode);
        }

        return this.projectModels.get(projectModel);
    }

    @Override
    public DependenciesDTO getJMQDependencies()
    {
        Iterable<EjbMessageDrivenModel> messageDrivenModels = this.graphContext.findAll(EjbMessageDrivenModel.class);

        Map<String, Object> sources = new HashMap<>();
        Map<String, Object> targets = new HashMap<>();

        Map<String, GraphNode> graphNodes = new HashMap<>();
        Set<GraphEdge> edges = new HashSet<>();

        for (EjbMessageDrivenModel messageDrivenModel : messageDrivenModels)
        {
            JmsDestinationModel destinationModel = messageDrivenModel.getDestination();
            String destinationName = destinationModel.getJndiLocation();

            JmsDestinationType jmsDestination = destinationModel.getDestinationType();
            String destinationTypeName;

            if (jmsDestination != null) {
                destinationTypeName = jmsDestination.name();
            } else {
                destinationTypeName = "JMS";
            }


            GraphNode mqGraphNode = new GraphNode(destinationName, null, destinationTypeName);
            this.graphNodes.add(mqGraphNode);

            graphNodes.put(destinationName, mqGraphNode);

            for (ProjectModel projectModel : messageDrivenModel.getApplications())
            {
                GraphNode projectGraphNode = this.getOrCreateProjectModelGraphNode(projectModel);
                GraphEdge edge = new GraphEdge(projectGraphNode.getId(), mqGraphNode.getId(), "uses");

                edges.add(edge);
                this.graphEdges.add(edge);
            }

            targets.put(destinationName, destinationModel);
        }
        /*
         * Iterable<JmsDestinationModel> jmsQueues = this.graphContext.getQuery().type(JmsDestinationModel.class)
         * .has(JmsDestinationModel.DESTINATION_TYPE, JmsDestinationType.QUEUE.name()) .vertices(JmsDestinationModel.class);
         * 
         * Iterable<JmsDestinationModel> jmsTopics = this.graphContext.getQuery().type(JmsDestinationModel.class)
         * .has(JmsDestinationModel.DESTINATION_TYPE, JmsDestinationType.TOPIC.name()) .vertices(JmsDestinationModel.class);
         */

        Iterable<JNDIResourceModel> jndiResources = this.graphContext.findAll(JNDIResourceModel.class);

        for (JNDIResourceModel resource : jndiResources)
        {
            String location = resource.getJndiLocation();

            GraphNode mqGraphNode;

            if (!graphNodes.containsKey(location))
            {
                // todo: distinguish topic/queue
                mqGraphNode = new GraphNode(location, null, "jmq");
                graphNodes.put(location, mqGraphNode);
                this.graphNodes.add(mqGraphNode);
            }

            mqGraphNode = graphNodes.get(location);

            for (ProjectModel projectModel : resource.getApplications())
            {
                GraphNode projectGraphNode = this.getOrCreateProjectModelGraphNode(projectModel);
                GraphEdge edge = new GraphEdge(projectGraphNode.getId(), mqGraphNode.getId(), "exposes");

                edges.add(edge);
                this.graphEdges.add(edge);
            }

            sources.put(location, resource);
        }

        return null;
    }

    @Override
    public DependenciesDTO getDataSourceDependencies()
    {
        return null;
    }

    @Override
    public DependenciesDTO getWSDependencies()
    {
        Iterable<JaxRSWebServiceModel> rsWebServiceModels = this.graphContext.findAll(JaxRSWebServiceModel.class);
        Iterable<JaxWSWebServiceModel> wsWebServiceModels = this.graphContext.findAll(JaxWSWebServiceModel.class);

        Map<String, Object> sources = new HashMap<>();
        Map<String, Object> targets = new HashMap<>();

        for (JaxRSWebServiceModel webServiceModel : rsWebServiceModels)
        {
            JavaClassModel wsInterface = webServiceModel.getInterface();
            JavaClassModel implementation = webServiceModel.getImplementationClass();
            String path = webServiceModel.getPath();

            for (ProjectModel rootProjectModel : webServiceModel.getRootProjectModels()) {
                GraphNode projectModelNode = this.getOrCreateProjectModelGraphNode(rootProjectModel);
                GraphNode wsNode = new GraphNode("Web Service", null, "Web Service");
                GraphEdge edge = new GraphEdge(projectModelNode.getId(), wsNode.getId(), "exposes");


                this.graphNodes.add(wsNode);
                this.graphNodes.add(projectModelNode);
                this.graphEdges.add(edge);
            }

            sources.put(webServiceModel.getPath(), webServiceModel);
        }

        for (JaxWSWebServiceModel webServiceModel : wsWebServiceModels)
        {
            JavaClassModel wsInterface = webServiceModel.getInterface();

            for (ProjectModel rootProjectModel : webServiceModel.getRootProjectModels()) {
                GraphNode projectModelNode = this.getOrCreateProjectModelGraphNode(rootProjectModel);
                GraphNode wsNode = new GraphNode("Web Service", null, "Web Service");
                GraphEdge edge = new GraphEdge(projectModelNode.getId(), wsNode.getId(), "exposes");


                this.graphNodes.add(wsNode);
                this.graphNodes.add(projectModelNode);
                this.graphEdges.add(edge);
            }

            sources.put(webServiceModel.toPrettyString(), webServiceModel);
        }

        return null;
    }


    @Override
    public DependenciesDTO getDependencies()
    {
        this.getJMQDependencies();
        this.getDataSourceDependencies();
        this.getWSDependencies();

        DependenciesDTO dependenciesDTO = new DependenciesDTO(this.graphNodes, this.graphEdges);

        return dependenciesDTO;
    }
}
