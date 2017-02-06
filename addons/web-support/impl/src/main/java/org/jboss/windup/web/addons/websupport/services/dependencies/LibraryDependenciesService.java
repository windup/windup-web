package org.jboss.windup.web.addons.websupport.services.dependencies;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.DuplicateProjectModel;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.WindupConfigurationService;
import org.jboss.windup.rules.apps.java.archives.model.ArchiveCoordinateModel;
import org.jboss.windup.rules.apps.java.archives.model.IdentifiedArchiveModel;

/**
 * Gets dependencies between applications and libraries
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class LibraryDependenciesService implements DependenciesService
{
    public enum Type
    {
        Application,
        Dependency,
        KnownLibrary
    }

    private GraphContext graphContext;

    @Override
    public void setGraphContext(GraphContext graphContext)
    {
        this.graphContext = graphContext;
    }

    @Override
    public DependenciesDTO getDependencies()
    {
        Iterable<IdentifiedArchiveModel> identifiedArchiveModels = graphContext.findAll(IdentifiedArchiveModel.class);

        Map<ProjectModel, GraphNode> projectModelGraphNodeHashMap = new HashMap<>();
        Set<GraphEdge> edges = new HashSet<>();

        for (IdentifiedArchiveModel identifiedArchive : identifiedArchiveModels)
        {
            this.addIdentifiedArchive(identifiedArchive, projectModelGraphNodeHashMap);
        }

        for (FileModel inputPath : WindupConfigurationService.getConfigurationModel(graphContext).getInputPaths())
        {
            ProjectModel rootProjectModel = inputPath.getProjectModel();

            if (rootProjectModel == null)
            {
                continue;
            }

            GraphNode projectGraphNode = new GraphNode(
                        this.getProjectName(rootProjectModel),
                        this.getData(rootProjectModel, true),
                        Type.Application.name());

            projectModelGraphNodeHashMap.put(rootProjectModel, projectGraphNode);

            this.addChilds(rootProjectModel, projectModelGraphNodeHashMap, edges);
        }

        DependenciesDTO reportData = new DependenciesDTO(projectModelGraphNodeHashMap.values(), edges);
        return reportData;
    }

    protected void addIdentifiedArchive(IdentifiedArchiveModel identifiedArchiveModel, Map<ProjectModel, GraphNode> projectsMap)
    {
        Map<String, Object> data = new HashMap<>();

        Map<String, Object> mavenData = new HashMap<>();
        ArchiveCoordinateModel coordinate = identifiedArchiveModel.getCoordinate();

        String name;

        if (coordinate != null)
        {
            name = coordinate.getArtifactId();

            mavenData.put("artifactId", coordinate.getArtifactId());
            mavenData.put("groupId", coordinate.getGroupId());
            mavenData.put("version", coordinate.getVersion());
            mavenData.put("packaging", coordinate.getPackaging());

            data.put("maven", mavenData);
        }
        else
        {
            name = identifiedArchiveModel.getFileName();
        }

        data.put("isIdentified", true);

        this.addFileInfo(identifiedArchiveModel, data, false);

        GraphNode graphNode = new GraphNode(
                    name,
                    data,
                    Type.KnownLibrary.name());

        ProjectModel projectModel = identifiedArchiveModel.getProjectModel();

        if (projectModel instanceof DuplicateProjectModel)
        {
            projectModel = ((DuplicateProjectModel) projectModel).getCanonicalProject();
        }

        projectsMap.put(projectModel, graphNode);
    }

    protected String getProjectName(ProjectModel projectModel)
    {
        FileModel fileModel = projectModel.getRootFileModel();

        if (fileModel != null)
        {
            return fileModel.getFileName();
        }

        return projectModel.getName();
    }

    protected GraphNode addChilds(ProjectModel parentNode, Map<ProjectModel, GraphNode> projectsMap, Set<GraphEdge> edges)
    {
        GraphNode parentGraphNode;

        if (!projectsMap.containsKey(parentNode))
        {
            parentGraphNode = new GraphNode(this.getProjectName(parentNode), this.getData(parentNode), Type.Dependency.name());
            projectsMap.put(parentNode, parentGraphNode);
        }

        parentGraphNode = projectsMap.get(parentNode);

        for (ProjectModel child : parentNode.getChildProjects())
        {
            if (child instanceof DuplicateProjectModel)
            {
                child = ((DuplicateProjectModel) child).getCanonicalProject();
            }

            GraphNode childGraphNode = this.addChilds(child, projectsMap, edges);
            edges.add(new GraphEdge(parentGraphNode.getId(), childGraphNode.getId()));
        }

        return parentGraphNode;
    }

    protected Map<String, Object> getData(Object model)
    {
        return this.getData(model, false);
    }

    protected Map<String, Object> getData(Object model, boolean isRootProject)
    {
        Map<String, Object> data = new HashMap<>();

        if (model instanceof ProjectModel)
        {
            ProjectModel projectModel = (ProjectModel) model;

            FileModel rootFileModel = projectModel.getRootFileModel();

            if (rootFileModel != null)
            {
                this.addFileInfo(rootFileModel, data, isRootProject);
            }
        }

        return data;
    }

    protected Map<String, Object> addFileInfo(FileModel fileModel, Map<String, Object> data, boolean isRootProject)
    {
        if (isRootProject)
        {
            data.put("filePath", fileModel.getFileName());
        }
        else
        {
            Path graphPath = this.graphContext.getGraphDirectory().getParent().resolve("archives");
            String filePath = fileModel.getFilePath().replace(graphPath.toString() + "/", "");
            data.put("filePath", filePath);
        }

        data.put("fileName", fileModel.getFileName());

        return data;
    }
}
