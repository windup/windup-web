package org.jboss.windup.pages;

import org.apache.wicket.devutils.debugbar.DebugBar;
import org.apache.wicket.markup.html.WebPage;


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
    public WindupAuthSession getSession(){
        return (WindupAuthSession) Session.get();
    }
    */

}
