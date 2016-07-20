package org.jboss.windup.web.ui;

import java.net.URL;

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
    private static final String TESTS_PATH = "tests/unit-tests.html";

    @ArquillianResource
    URL contextRoot;

    @Before
    public void loadPage()
    {
        final String url = contextRoot + "/" + TESTS_PATH;
        System.out.println("Jasmine test page URL: " + url);
        getDriver().navigate().to(url);
    }

    private WebElement getTestSummaryElement()
    {
        return getDriver().findElement(By
            .xpath("//span[contains(@class, 'jasmine-bar') and (contains(@class, 'jasmine-passed') or contains(@class, 'jasmine-failed') or contains(@class, 'jasmine-skipped'))]"));
    }

    @Test
    public void checkJasmineResults() throws Exception
    {
        ExpectedCondition<Boolean> e = new ExpectedCondition<Boolean>()
        {
            public Boolean apply(WebDriver d)
            {
                WebElement durationElement = d.findElement(By.className("jasmine-duration"));
                boolean durationDisplayed = durationElement.isDisplayed();
                boolean finishedTextAvailable = durationElement.getText().contains("finished in");
                boolean testSummaryDisplayed = getTestSummaryElement().isDisplayed();
                boolean testsNotSkipped = !getTestSummaryElement().getAttribute("class").contains("jasmine-skipped");
                System.out.println("Jasmine wait condition status: " + durationDisplayed + "," + finishedTextAvailable + "," + testSummaryDisplayed + "," + testsNotSkipped);

                return durationDisplayed && finishedTextAvailable && testSummaryDisplayed;// && testsNotSkipped;
            }
        };
        Wait<WebDriver> w = new WebDriverWait(getDriver(), 60);
        w.until(e);

        WebElement testSummary = getTestSummaryElement();
        Assert.assertNotNull("Test Summary Element Missing", testSummary);
        Assert.assertTrue("Tests Failed: " + testSummary.getText(), testSummary.getText().contains(" 0 failures"));

        WebElement testFailures = getDriver().findElement(By.className("jasmine-failures"));
        Assert.assertNotNull("Test Failures Element Missing");
        Assert.assertTrue("Failures Found: " + testFailures.getText(), testFailures.getText().trim().equals(""));
    }
}
