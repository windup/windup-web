package org.jboss.windup.web.addons.websupport.tsmodelgen.test;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.regex.Pattern;
import org.apache.commons.io.FileUtils;
import org.jboss.windup.graph.model.DuplicateArchiveModel;
import org.jboss.windup.graph.model.DuplicateProjectModel;
import org.jboss.windup.graph.model.ProjectDependencyModel;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.WindupEdgeFrame;

import org.jboss.windup.graph.model.WindupFrame;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.reporting.model.source.SourceReportToProjectEdgeModel;
import org.jboss.windup.rules.apps.java.dependencyreport.DependenciesReportModel;
import org.jboss.windup.rules.apps.java.dependencyreport.DependencyReportDependencyGroupModel;
import org.jboss.windup.rules.apps.java.dependencyreport.DependencyReportToArchiveEdgeModel;
import org.jboss.windup.rules.apps.javaee.model.JmsDestinationModel;
import org.jboss.windup.web.addons.websupport.tsmodelgen.TypeScriptModelsGenerator;
import org.jboss.windup.web.addons.websupport.tsmodelgen.TypeScriptModelsGeneratorConfig;
import org.junit.Assert;
import org.junit.Test;

/**
 * Tests how {@link TsModelGen} generates the classes.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public class TypeScriptModelsGeneratorTest
{
    private static final Path OUTPUT_DIR = Paths.get("target/tsGenTestOutput");

    @Test
    public void testGenerateTsModel() throws IOException
    {
        FileUtils.deleteQuietly(OUTPUT_DIR.toFile());

        TypeScriptModelsGeneratorConfig config = new TypeScriptModelsGeneratorConfig()
                .setAdjacencyMode(TypeScriptModelsGeneratorConfig.AdjacencyMode.DECORATED)
                .setFileNamingStyle(TypeScriptModelsGeneratorConfig.FileNamingStyle.CAMELCASE)
                .setImportPathToWebapp(Paths.get("../somePath"))
                .setOutputPath(OUTPUT_DIR);

        List<Class<? extends WindupFrame<?>>> models = Arrays.asList(new Class[]{
            DuplicateProjectModel.class,
            DuplicateArchiveModel.class,
            DependenciesReportModel.class,
            // Still has inconsistent get/set getProject[Model]
            ProjectModel.class,
            // @Incidence
            ProjectDependencyModel.class,
            // Observable<any>
            DependencyReportDependencyGroupModel.class,
            // WindupEdgeFrame's
            SourceReportToProjectEdgeModel.class,
            DependencyReportToArchiveEdgeModel.class,
            // Getter returning void getDestinationName(String)
            JmsDestinationModel.class,
        });

        // These should not be generated.
        List<Class<? extends WindupFrame<?>>> notModels = Arrays.asList(new Class[]{
            WindupFrame.class,
        });

        Set<Class<? extends WindupFrame<?>>> typesToScan = new HashSet<>();
        typesToScan.addAll(models);
        typesToScan.addAll(notModels);

        // A ghost classes of these two are generated so the other can refer to them.
        models = new ArrayList<>(models);
        models.add(WindupVertexFrame.class);
        models.add(WindupEdgeFrame.class);


        TypeScriptModelsGenerator gen = new TypeScriptModelsGenerator(config);
        gen.generate(typesToScan);

        Assert.assertTrue(OUTPUT_DIR.toFile().exists());
        models.forEach((model) -> {
            Path modelPath = OUTPUT_DIR.resolve(model.getSimpleName() + ".ts");
            Assert.assertTrue("Model file should be generated: " + modelPath.toString(), modelPath.toFile().exists());
        });
        notModels.forEach((model) -> {
            Path modelPath = OUTPUT_DIR.resolve(model.getSimpleName() + ".ts");
            Assert.assertFalse("Model file should not generated: " + modelPath.toString(), modelPath.toFile().exists());
        });

        // Check that there's no "import {any} from './any';"
        Path modelPath = OUTPUT_DIR.resolve("DependencyReportDependencyGroupModel.ts");
        try(Scanner scanner = new Scanner(modelPath))
        {
            Assert.assertNull(scanner.findWithinHorizon(Pattern.quote("{any}"), 0));
        }

        // Non-WindupFrame relations.
        typesToScan.clear();
        typesToScan.add(TestWrongRelTypeModel.class);
        try
        {
            gen.generate(typesToScan);
            Assert.fail("Should have failed when processing " +TestWrongRelTypeModel.class.getSimpleName()+ " which has non-WindupFrame relations.");
        }
        catch (Exception ex) { }

        // Wrong getter.
        typesToScan.clear();
        typesToScan.add(TestWrongGetMethodModel.class);
        try
        {
            gen.generate(typesToScan);
            Assert.fail("Should have failed when processing " +TestWrongGetMethodModel.class.getSimpleName()+ " which has wrong getter.");
        }
        catch (Exception ex) { }
    }
}
