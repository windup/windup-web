package org.jboss.windup.pages.app;

import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.link.BookmarkablePageLink;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.jboss.windup.web.model.Application;


/**
 * @author Ondrej Zizka
 */
public class AppLink extends Panel {

    public AppLink( String id, final Application app ) {
        super( id );
        setRenderBodyOnly(true);

        add(
            new BookmarkablePageLink("link", AppPage.class,  new PageParameters().add("path", app.getPath()))
                .add( new Label("label", app.getPath()) )
        );
    }

}// class
