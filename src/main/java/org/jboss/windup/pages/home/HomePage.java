package org.jboss.windup.pages.home;

import org.jboss.essc.web.pages.home.co.RecentAppsBox;
import org.jboss.windup.pages.BaseLayoutPage;


/**
 * HomePage.
 *
 * @author Ondrej Zizka
 */
@SuppressWarnings("serial")
public class HomePage extends BaseLayoutPage {

    private static final int RECENT_RELEASES_ROWS = 12;

    public HomePage() {

        add( new RecentAppsBox("apps", RECENT_RELEASES_ROWS) );

    }

}// class
