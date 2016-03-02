


import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebWindow;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import java.net.URL;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.core.spi.Manager;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 *  Runs a test over Arquillian.
 *
 *  @author Ondrej Zizka
 */
//@Ignore("IllegalStateException: Duplicate layer 'base'")
//@Ignore("Provider for type class java.net.URL returned a null value: org.jboss.arquillian.container.test.impl.enricher.resource.URLResourceProvider@18ece7f4")
@RunWith(Arquillian.class)
public class ArqTestCase extends junit.framework.TestCase
{

    @Deployment
    public static Archive<?> createTestArchive()
    {
        return ShrinkWrap.create(WebArchive.class, "test-demo.war");
    }

    @Test @RunAsClient
    public void testWelcomePage(@ArquillianResource URL url){
        WebClient wc = new WebClient(BrowserVersion.FIREFOX_38);
        WebWindow w = wc.openWindow(url, "window1");
        HtmlPage page =  (HtmlPage) w.getEnclosedPage();
        System.out.println("TITLE: " + page.getTitleText());
        assertEquals( w.getEnclosedPage().getWebResponse().getStatusCode(), 200 );
        wc.close();
    }

}
