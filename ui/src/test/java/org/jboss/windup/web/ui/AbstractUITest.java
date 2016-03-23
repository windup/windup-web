package org.jboss.windup.web.ui;

import java.io.File;
import java.util.logging.Logger;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.importer.ZipImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.junit.After;
import org.junit.runner.RunWith;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.events.AbstractWebDriverEventListener;
import org.openqa.selenium.support.events.EventFiringWebDriver;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public abstract class AbstractUITest
{
    private static final String PACKAGE = "org.jboss.windup.web.ui";
    private static final String WEBAPP_SRC = "src/main/webapp";
    private static final String COMPILED_WEBAPP_SRC = "target/windup-web/";
    private static final String NODE_MODULES = "node_modules";
    private static Logger LOG = Logger.getLogger(AbstractUITest.class.getSimpleName());
    @Drone
    private WebDriver browser;
    private AngularJSEventHandler listener;

    @Deployment(name = "windup-web-services", order = 1)
    public static WebArchive createServicesDeployment()
    {
        WebArchive war = ShrinkWrap.create(WebArchive.class, "windup-web-services.war");
        File servicesWarFile = Maven.resolver().resolve("org.jboss.windup.web:windup-web-services:war:3.0.0-SNAPSHOT").withoutTransitivity().asSingleFile();
        war.merge(ShrinkWrap.create(GenericArchive.class).as(ZipImporter.class).importFrom(servicesWarFile).as(GenericArchive.class));
        return war;
    }

    @Deployment(order = 2)
    public static WebArchive createDeployment()
    {
        WebArchive war = ShrinkWrap.create(WebArchive.class, "windup-web.war");
        // File[] files = Maven.resolver().loadPomFromFile("pom.xml").importRuntimeDependencies().resolve().withTransitivity().asFile();
        // war.addAsLibraries(files);
        war.addPackages(true, PACKAGE);
        war.addPackages(true, AbstractUITest.class.getPackage());
        war.merge(ShrinkWrap.create(GenericArchive.class).as(ExplodedImporter.class).importDirectory(WEBAPP_SRC).as(GenericArchive.class), "/");
        war.merge(ShrinkWrap.create(GenericArchive.class).as(ExplodedImporter.class).importDirectory(COMPILED_WEBAPP_SRC).as(GenericArchive.class),
                    "/");
        war.merge(ShrinkWrap.create(GenericArchive.class).as(ExplodedImporter.class).importDirectory(NODE_MODULES).as(GenericArchive.class),
                    "/" + NODE_MODULES);
        return war;
    }

    @After
    public void after()
    {
        StringBuilder builder = new StringBuilder("Browser Logs: " + System.lineSeparator());
        getDriver().manage().logs().get("browser").forEach(entry -> {
            builder.append("\t").append(entry.getLevel()).append(": ").append(entry.getMessage()).append(System.lineSeparator());
        });
        LOG.info(builder.toString());

        getDriver().close();
    }

    WebDriver getDriver()
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

        private void waitForLoad(WebDriver driver)
        {
            JavascriptExecutor executor = (JavascriptExecutor) driver;
            executor.executeAsyncScript(
                        "var callback = arguments[arguments.length - 1]; " +
                                    "if (!window['mainApp']) callback();" +
                                    "window['windupAppInitialized'] = function(app, ngzone) {" +
                                    "MainNgZone.overrideOnEventDone(function () { console.log('on event done received'); callback(); });" +
                                    "};");
        }
    }
}
