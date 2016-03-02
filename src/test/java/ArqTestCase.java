


import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebWindow;
import java.net.URL;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 *  Runs a test over Arquillian.
 *
 *  @author Ondrej Zizka
 */
@Ignore
@RunWith(Arquillian.class)
public class ArqTestCase extends junit.framework.TestCase {

    @ArquillianResource private URL url;

    //@Ignore("Until I fix NoClassDefFoundError: org/jboss/shrinkwrap/descriptor/impl/base/NodeProviderImplBase")
    @Test
    public void testWelcomePage(){
        WebClient wc = new WebClient(BrowserVersion.FIREFOX_3_6);
        WebWindow w = wc.openWindow(url, "window1");
        assertEquals( w.getEnclosedPage().getWebResponse().getStatusCode(), 200 );
        wc.closeAllWindows();
    }


}
