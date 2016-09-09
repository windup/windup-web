package org.jboss.windup.web.ui;

import java.net.URL;
import java.util.logging.Logger;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
@RunAsClient
public class JasmineTest extends AbstractUITest
{
    private static Logger LOG = Logger.getLogger(JasmineTest.class.getName());

    private static final String TESTS_PATH = "tests/unit-tests.html";

    @Before
    public void loadPage()
    {
        getDriver().navigate().to(getContextRoot() + "/" + TESTS_PATH);
    }

    private WebElement getTestSummaryElement()
    {
        return getDriver().findElement(By
                    .xpath("//span[contains(@class, 'jasmine-bar') and (contains(@class, 'jasmine-passed') or contains(@class, 'jasmine-failed') or contains(@class, 'jasmine-skipped'))]"));
    }

    @Test
    public void checkJasmineResults() throws Exception
    {
        ExpectedCondition<Boolean> e = (webDriver) -> {
            WebElement durationElement = webDriver.findElement(By.className("jasmine-duration"));
            boolean durationDisplayed = durationElement.isDisplayed();
            boolean finishedTextAvailable = durationElement.getText().contains("finished in");
            boolean testSummaryDisplayed = getTestSummaryElement().isDisplayed();
            boolean testsNotSkipped = !getTestSummaryElement().getAttribute("class").contains("jasmine-skipped");
            LOG.info("Check Jasmine Status: " + durationDisplayed + "," + finishedTextAvailable + "," + testSummaryDisplayed + "," + testsNotSkipped);

            return durationDisplayed && finishedTextAvailable && testSummaryDisplayed && testsNotSkipped;
        };
        Wait<WebDriver> w = new WebDriverWait(getDriver(), 60);
        w.until(e);
        takeScreenshot(getDriver());

        WebElement testSummary = getTestSummaryElement();
        Assert.assertNotNull("Test Summary Element Missing", testSummary);
        Assert.assertTrue("Tests Failed: " + testSummary.getText(), testSummary.getText().contains(" 0 failures"));

        WebElement testFailures = getDriver().findElement(By.className("jasmine-failures"));
        Assert.assertNotNull("Test Failures Element Missing");
        Assert.assertTrue("Failures Found: " + testFailures.getText(), testFailures.getText().trim().equals(""));
    }
}
