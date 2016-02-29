package org.jboss.windup.pages.home.co;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import javax.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.link.BookmarkablePageLink;
import org.apache.wicket.markup.html.link.Link;
import org.apache.wicket.markup.html.list.ListItem;
import org.apache.wicket.markup.html.list.ListView;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.jboss.windup.pages.app.AppPage;
import org.jboss.windup.web.dao.AppsDao;
import org.jboss.windup.web.model.Application;


/**
 * A list of recent changes.
 *
 * @author Ondrej Zizka
 */
public class RecentAppsBox extends Panel {

    @Inject private AppsDao dao;


    private static final DateFormat DF = new SimpleDateFormat("yyyy-MM-dd");

    private int numApps = 12;

    public RecentAppsBox( String id, int numReleases ) {
        super(id);
        this.setRenderBodyOnly( true );

        this.numApps = numReleases;

        add( new ListView<Application>("rows", dao.getApplications_orderName(this.numApps)) {

            // Populate the table of recent changes.
            @Override
            protected void populateItem( final ListItem<Application> item) {
                Application app = item.getModelObject();

                //item.add(new Label("path", pr.getPath()));
                /*item.add(new Link<Application>("path", item.getModel()) {
                    @Override
                    public void onClick() {
                        setResponsePage(AppPage.class);
                    }
                });*/
                item.add(
                    new BookmarkablePageLink("pathLink", AppPage.class,  new PageParameters().add("path", app.getPath()))
                    .add( new Label("label", app.getPath()) )
                );



                Date date = app.getAdded();
                item.add( new Label("added", (date == null) ? "" : DF.format( date )));
                item.add( new Label("status", app.getStatus().getStatusString()) );
                item.add( new ListView<String>("tags", Arrays.asList("WebLogic JSF TopLink".split(" ")))
                {
                    @Override
                    protected void populateItem(ListItem<String> item)
                    {
                        String tag = item.getModelObject();
                        item.add(new Label("tag", tag));
                    }
                });
            }
        });
    }



}