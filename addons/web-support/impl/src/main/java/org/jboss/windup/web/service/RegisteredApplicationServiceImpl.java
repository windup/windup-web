package org.jboss.windup.web.service;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.commons.lang.RandomStringUtils;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

import com.tinkerpop.blueprints.GraphQuery;
import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.frames.structures.FramedVertexIterable;

/**
 * Provides methods for creating and managed {@link RegisteredApplicationModel} vertices.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class RegisteredApplicationServiceImpl extends GraphService<RegisteredApplicationModel> implements RegisteredApplicationService
{
    private static final String REPORT_DIR = "reports";

    private final WebPathUtil webPathUtil;

    public RegisteredApplicationServiceImpl(GraphContext context, WebPathUtil webPathUtil)
    {
        super(context, RegisteredApplicationModel.class);
        this.webPathUtil = webPathUtil;
    }

    @Override
    public RegisteredApplicationModel getOrCreate(String inputPath)
    {
        RegisteredApplicationModel result = getByInputPath(inputPath);
        if (result == null)
        {
            result = create();
            inputPath = normalizePath(inputPath);
            result.setInputPath(inputPath);
            result.setInputFilename(Paths.get(inputPath).getFileName().toString());
            result.setOutputPath(getDefaultOutputPath(inputPath));

        }
        getGraphContext().getFramed().getBaseGraph().getBaseGraph().commit();
        return result;
    }

    @Override
    public RegisteredApplicationModel getByInputPath(String inputPath)
    {
        if (inputPath == null)
        {
            GraphQuery query = getGraphContext().getFramed().query().hasNot(RegisteredApplicationModel.INPUT_PATH);
            return getUnique(query);
        }
        inputPath = normalizePath(inputPath);
        return getUniqueByProperty(RegisteredApplicationModel.INPUT_PATH, inputPath);
    }

    @Override
    public void deleteAll()
    {
        for (Vertex v : getTypedQuery().vertices())
        {
            v.remove();
        }
    }

    @Override
    public void delete(RegisteredApplicationModel application)
    {
        // refresh based on the input path and delete it
        getByInputPath(application.getInputPath()).asVertex().remove();
    }

    private String getDefaultOutputPath(String inputPath)
    {
        Path reportBasePath = webPathUtil.getGlobalWindupDataPath().resolve(REPORT_DIR);
        String dirName = Paths.get(inputPath).getFileName().toString() + "." + RandomStringUtils.randomAlphabetic(12) + ".report";

        Path outputPath = reportBasePath.resolve(dirName);
        return outputPath.toString();
    }

    private String normalizePath(String path)
    {
        if (path == null)
            return null;

        return Paths.get(path).toAbsolutePath().normalize().toString();
    }

    @Override
    public Iterable<RegisteredApplicationModel> getAllRegisteredApplications()
    {
        return new FramedVertexIterable<>(getGraphContext().getFramed(), findAllQuery().vertices(), RegisteredApplicationModel.class);
    }

}
