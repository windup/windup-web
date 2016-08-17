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
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
@RunAsClient
public class ProjectListUITest extends AbstractUITest
{
    private static Logger LOG = Logger.getLogger(ProjectListUITest.class.getSimpleName());

    @ArquillianResource
    URL contextRoot;

    @FindBy(xpath = "//button[contains(@class, 'btn-primary') and text() = 'Create Migration Project']")
    private WebElement createProjectButton;

    @Before
    public void loadPage()
    {
        getDriver().navigate().to(contextRoot);
    }

    @Test
    public void testInitialLoad() throws Exception
    {
        Assert.assertNotNull(createProjectButton);
        LOG.info("Button: " + createProjectButton.getText());
    }
}
