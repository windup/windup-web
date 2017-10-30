import org.junit.Assert;
import org.junit.Test;

/**
 * This test file is just workaround for maven-failsafe plugin
 *
 * It needs to have some tests to execute, so here is always passing test-suite.
 * Real work is done in maven-exec plugin, which needs to run in integration-test phase.
 * But if there are no tests, maven-failsafe plugin would stop maven before executing that.
 */
public class ITTestProtractorIT
{

    @Test
    public void passingTest()
    {
        Assert.assertTrue(true);
    }
/*
    @Test
    public void protractorTest()
    {
        String workingDirectory = System.getProperty("workingDirectory");
        String protractorPath = System.getProperty("protractor.path");

        System.setProperty("user.dir", workingDirectory);

        String[] protractorArgs = System.getProperty("protractor.args").split(" ");
        String logFilePath = System.getProperty("logFile");

        List<String> protractorWithArgs = new ArrayList<>();
        protractorWithArgs.add(Paths.get(workingDirectory, protractorPath).toString());
        protractorWithArgs.addAll(Arrays.asList(protractorArgs));

        Logger.getLogger(ITTestProtractorIT.class.getName()).warning("Protractor path: " + protractorPath);

        protractorWithArgs.forEach(arg -> Logger.getLogger(this.getClass().getName()).warning(arg));

        ProcessBuilder processBuilder = new ProcessBuilder(protractorWithArgs);
        processBuilder.redirectOutput(new File(logFilePath));

        try
        {
            Process process = processBuilder.start();
            process.waitFor();
            Assert.assertEquals(0, process.exitValue());
        }
        catch (IOException e)
        {
            e.printStackTrace();
            Assert.fail("IO Exception");
        }
        catch (InterruptedException e)
        {
            e.printStackTrace();
        }
    }
*/
}
