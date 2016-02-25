package org.jboss.windup.pages;

import org.apache.wicket.Session;
import org.apache.wicket.devutils.debugbar.DebugBar;
import org.apache.wicket.markup.html.IHeaderResponse;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.request.resource.CssResourceReference;
import org.apache.wicket.request.resource.JavaScriptResourceReference;


/**
 *  Base layout of all pages in this app.
 *
 *  @author Ondrej Zizka
 */
public class BaseLayoutPage extends WebPage {

    public BaseLayoutPage() {
        add( new DebugBar("debugBar") );
    }


    /**
     *  Global helper to avoid casting everywhere.
    @Override
    public EsscAuthSession getSession(){
        return (EsscAuthSession) Session.get();
    }
     */


    /** Adds CSS reference. */
    @Override
    public void renderHead(IHeaderResponse response) {
        response.renderCSSReference(new CssResourceReference( BaseLayoutPage.class, "default.css" ));
        response.renderJavaScriptReference(new JavaScriptResourceReference( BaseLayoutPage.class, "common.js" ));
    }

}// class
