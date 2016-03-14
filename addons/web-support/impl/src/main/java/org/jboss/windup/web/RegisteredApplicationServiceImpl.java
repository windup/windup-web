package org.jboss.windup.web;

import java.nio.file.Path;
import java.nio.file.Paths;

import com.tinkerpop.blueprints.Vertex;
import org.apache.commons.lang.RandomStringUtils;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

import com.tinkerpop.frames.structures.FramedVertexIterable;

/**
 * Provides methods for creating and managed {@link RegisteredApplicationModel} vertices.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class RegisteredApplicationServiceImpl extends GraphService<RegisteredApplicationModel> implements RegisteredApplicationService
{
    private static final String REPORT_DIR = "reports";

    public RegisteredApplicationServiceImpl(GraphContext context)
    {
        super(context, RegisteredApplicationModel.class);
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

    private String getDefaultOutputPath(String inputPath)
    {
        Path reportBasePath = WebPathUtil.getGlobalWindupDataPath().resolve(REPORT_DIR);
        String dirName = Paths.get(inputPath).getFileName().toString() + "." + RandomStringUtils.randomAlphabetic(12) + ".report";

        Path outputPath = reportBasePath.resolve(dirName);
        return outputPath.toString();
    }

    private String normalizePath(String path)
    {
        return Paths.get(path).toAbsolutePath().normalize().toString();
    }

    @Override
    public Iterable<RegisteredApplicationModel> getAllRegisteredApplications()
    {
        return new FramedVertexIterable<>(getGraphContext().getFramed(), findAllQuery().vertices(), RegisteredApplicationModel.class);
    }

}
