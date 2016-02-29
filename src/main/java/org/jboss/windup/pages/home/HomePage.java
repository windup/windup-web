package org.jboss.windup.pages.home;

import javax.inject.Inject;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.RequiredTextField;
import org.apache.wicket.markup.html.panel.FeedbackPanel;
import org.apache.wicket.model.PropertyModel;
import org.jboss.windup.pages.home.co.RecentAppsBox;
import org.jboss.windup.pages.BaseLayoutPage;
import org.jboss.windup.rest.WindupService;
import org.jboss.windup.web.dao.AppsDao;
import org.jboss.windup.web.model.Application;


/**
 * HomePage.
 *
 * @author Ondrej Zizka
 */
@SuppressWarnings("serial")
public class HomePage extends BaseLayoutPage
{
    private static final int RECENT_APPS_COUNT = 100;

    @Inject
    private WindupService windupService;

    @Inject AppsDao appsDao;

    private Form<Application> addAppForm;

    private Application appModel = new Application();


    // This is a bit hacky, the form would be a component.
    public HomePage() {

        this.appModel.setPath("/home/ondra/work/Migration/TestApps/_apps/jee-example-app-1.0.0-unparsable.ear");

        add(new RecentAppsBox("recentApps", RECENT_APPS_COUNT));
        add(new FeedbackPanel("feedback"));

        this.addAppForm = new Form<Application>("registerAppForm", new PropertyModel<>(this, "appModel")) {
            protected void onSubmit() {
                final Application appModel = addAppForm.getModelObject();
                final String path = appModel.getPath();

                try {
                    appsDao.addApplication(appModel);

                    try {
                        windupService.executeWindup(path, path + "_report");
                        setResponsePage(HomePage.class);
                    }
                    catch (Exception ex) {
                        this.error("Failed analyzing the app: " + ex.getMessage());
                    }
                }
                catch (Exception ex) {
                    this.error("Failed adding the app: " + ex.getMessage());
                }
            }
        };

                                                            // Again, this is hacky and can be done elegantly ;-)
        this.addAppForm.add(new RequiredTextField<>("path", new PropertyModel<>(new PropertyModel(this, "appModel"), "path")));
        add(this.addAppForm);

    }


    public Application getAppModel() {
        return appModel;
    }

    public void setAppModel(Application appModel) {
        this.appModel = appModel;
    }

}
