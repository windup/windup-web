package org.jboss.windup.web.ui;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import org.apache.commons.io.FileUtils;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.importer.ZipImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.jboss.shrinkwrap.resolver.api.maven.PomEquippedResolveStage;
import org.jboss.windup.web.tests.authentication.KeycloakAuthenticationHelper;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.events.AbstractWebDriverEventListener;
import org.openqa.selenium.support.events.EventFiringWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.base.Predicate;
import java.nio.file.Path;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public abstract class AbstractUITest
{
    public static final String SPLASH_PAGE_LOGIN_BUTTON_ID = "btnLogin";
    private static final String SERVICES_WAR_ARTIFACT_ID = "org.jboss.windup.web:windup-web-services:war:3.0.0-SNAPSHOT";
    private static final String PACKAGE = "org.jboss.windup.web.ui";
    private static final String WEBAPP_SRC = "src/main/webapp";
    private static final String COMPILED_WEBAPP_SRC = "target/windup-web/";
    private static Logger LOG = Logger.getLogger(AbstractUITest.class.getSimpleName());

    @Drone
    private WebDriver browser;

    @ArquillianResource
    private URL contextRoot;

    private AngularJSEventHandler listener;

    @Deployment(name = "windup-web-services", order = 1)
    public static WebArchive createServicesDeployment()
    {
        WebArchive war = ShrinkWrap.create(WebArchive.class, "windup-web-services.war");
        File servicesWarFile = Maven.resolver().resolve(SERVICES_WAR_ARTIFACT_ID).withoutTransitivity().asSingleFile();
        war.merge(ShrinkWrap.create(GenericArchive.class).as(ZipImporter.class).importFrom(servicesWarFile).as(GenericArchive.class));
        war.merge(ShrinkWrap.create(ExplodedImporter.class).importDirectory("src/test/resources/WEB-INF").as(GenericArchive.class), "/WEB-INF");
        return war;
    }

    @Deployment(order = 2)
    public static WebArchive createDeployment()
    {
        WebArchive war = ShrinkWrap.create(WebArchive.class, "windup-web.war");
        PomEquippedResolveStage pom = Maven.resolver().loadPomFromFile("pom.xml");
        File[] files = pom.importRuntimeDependencies().resolve().withTransitivity().asFile();
        war.addAsLibraries(files);

        war.addPackages(true, PACKAGE);
        war.addPackages(true, AbstractUITest.class.getPackage());
        war.merge(ShrinkWrap.create(GenericArchive.class).as(ExplodedImporter.class).importDirectory(WEBAPP_SRC).as(GenericArchive.class), "/");
        war.merge(ShrinkWrap.create(GenericArchive.class).as(ExplodedImporter.class).importDirectory(COMPILED_WEBAPP_SRC).as(GenericArchive.class),
                    "/");
        return war;
    }

    protected static Path takeScreenshot(String testName, WebDriver driver)
    {
        if (driver instanceof TakesScreenshot)
        {
            File tempFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            try
            {
                File outputFile = new File("target/screenshots/" + testName + "_shot_" + System.currentTimeMillis() + ".png");
                System.err.println("Copying file: " + tempFile + " to " + outputFile);
                FileUtils.copyFile(tempFile, outputFile);
                return outputFile.toPath();
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }
        }
        return null;
    }

    public URL getContextRoot()
    {
        try
        {
            // HACK - Use localhost as the security policies assume this (rather than 127.0.0.1).
            if (contextRoot.toString().contains("127.0.0.1"))
                contextRoot = new URL(contextRoot.toString().replace("127.0.0.1", "localhost"));
        }
        catch (MalformedURLException e)
        {
            e.printStackTrace();
        }
        return contextRoot;
    }

    @Before
    public void before() throws Exception
    {
        WebDriverWait wait = new WebDriverWait(getDriver(), 20);

        Predicate<WebDriver> pageLoadedPredicate = (webdriver) -> ((JavascriptExecutor) webdriver).executeScript("return document.readyState")
                    .equals("complete");

        Predicate<WebDriver> loginButtonIsAvailable = (webdriver) -> {
            try
            {
                return webdriver.findElement(By.id(SPLASH_PAGE_LOGIN_BUTTON_ID)).isDisplayed();
            }
            catch (NoSuchElementException e)
            {
                return false;
            }
        };

        getDriver().navigate().to(getContextRoot());
        Thread.sleep(5000);
        printBrowserLogs();

        wait.withTimeout(10, TimeUnit.SECONDS).until(loginButtonIsAvailable);
        WebElement loginElement = getDriver().findElement(By.id(SPLASH_PAGE_LOGIN_BUTTON_ID));
        loginElement.click();

        wait.withTimeout(10, TimeUnit.SECONDS).until(pageLoadedPredicate);

        WebElement usernameElement = getDriver().findElement(By.id("username"));
        usernameElement.sendKeys(KeycloakAuthenticationHelper.DEFAULT_USER);
        WebElement passwordElement = getDriver().findElement(By.id("password"));
        passwordElement.sendKeys(KeycloakAuthenticationHelper.DEFAULT_PASSWORD);
        WebElement formSubmitElement = getDriver().findElement(By.id("kc-login"));

        String previousUrl = getDriver().getCurrentUrl();
        formSubmitElement.click();

        wait.withTimeout(20, TimeUnit.SECONDS).until(
                    (Predicate<WebDriver>) (webdriver) -> !loginButtonIsAvailable.apply(webdriver) && !webdriver.getCurrentUrl().equals(previousUrl));
    }

    @After
    public void after()
    {
        printBrowserLogs();

        getDriver().close();
    }

    private void printBrowserLogs()
    {
        StringBuilder builder = new StringBuilder("Browser Logs: " + System.lineSeparator());
        getDriver().manage().logs().get("browser").forEach(entry -> {
            builder.append("\t").append(entry.getLevel()).append(": ").append(entry.getMessage()).append(System.lineSeparator());
        });
        LOG.info(builder.toString());
    }

    protected WebDriver getDriver()
    {
        if (listener == null)
        {
            EventFiringWebDriver driver = new EventFiringWebDriver(browser);
            this.listener = new AngularJSEventHandler();
            driver.register(listener);
            this.browser = driver;
        }
        return browser;
    }

    public static class AngularJSEventHandler extends AbstractWebDriverEventListener
    {
        @Override
        public void afterNavigateTo(String url, WebDriver driver)
        {
            waitForLoad(driver);
        }

        @Override
        public void afterNavigateBack(WebDriver driver)
        {
            waitForLoad(driver);
        }

        @Override
        public void afterNavigateForward(WebDriver driver)
        {
            waitForLoad(driver);
        }

        @Override
        public void afterClickOn(WebElement element, WebDriver driver)
        {
            waitForLoad(driver);
        }

        @Override
        public void afterChangeValueOf(WebElement element, WebDriver driver)
        {
            waitForLoad(driver);
        }

        @Override
        public void afterFindBy(By by, WebElement element, WebDriver driver)
        {
        }

        private void waitForLoad(WebDriver driver)
        {
            String entryURL = driver.getCurrentUrl();
            try
            {
                JavascriptExecutor executor = (JavascriptExecutor) driver;
                Object isMainApp = executor.executeScript("return window['mainApp']");

                if (!(isMainApp instanceof Boolean) || !(Boolean)isMainApp)
                    return;

                System.out.println("||||||||||||||||");
                System.out.println("URL: " + isMainApp + "," + driver.getCurrentUrl());
                System.out.println("||||||||||||||||");

                executor.executeAsyncScript(
                            "var callback = arguments[arguments.length - 1]; " +
                                        "if (!window['mainApp']) callback();" +
                                        "window['windupAppInitialized'] = function(app, ngzone) {" +
                                        "ngzone.onStable.subscribe(function () { console.log('on event done received'); callback(); });" +
                                        "};");
            }
            catch (Throwable t)
            {
                String currentUrl = driver.getCurrentUrl();
                if (!currentUrl.equals(entryURL)) {
                    // the page was unloaded, which broke our waiting process... wait again
                    waitForLoad(driver);
                    return;
                }

                System.out.println("Error calling async script... current URL: " + driver.getCurrentUrl() + " entry url: " + entryURL);
                t.printStackTrace();
            }
        }
    }
}
