package org.jboss.windup.pages.app;

import javax.inject.Inject;
import javax.persistence.NoResultException;
import org.apache.wicket.RestartResponseException;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.model.IModel;
import org.apache.wicket.model.PropertyModel;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.jboss.windup.pages.BaseLayoutPage;
import org.jboss.windup.pages.home.HomePage;
import org.jboss.windup.web.dao.AppsDao;
import org.jboss.windup.web.model.Application;



/**
 * Application page
 *
 * @author Ondrej Zizka
 */
@SuppressWarnings("serial")
public class AppPage extends BaseLayoutPage
{
    @Inject private AppsDao appsDao;


    // Data
    private Application app;


    public AppPage( PageParameters par ) {
        String appPath = par.get("path").toString();
        try {
            this.app = appsDao.getApplicationByPath( appPath );
        }
        catch( NoResultException ex ){
            throw new RestartResponseException( HomePage.class, new PageParameters().add("error", "No such application: " + appPath) );
        }
        init();
    }

    public AppPage( Application app ) {
        this.app = app;
        if( this.app == null )
            throw new RestartResponseException( HomePage.class, new PageParameters().add("error", "No application chosen.") );
        init();
    }

    private void init()
    {
        setDefaultModel( new PropertyModel( this, "app") );

        add( new Label("path", this.app.getPath()));
    }



    public static PageParameters createPageParameters( Application app ){
        return new PageParameters().add("path", app.getPath());
    }



    public Application getApp() { return app; }
    public void setApp( Application app ) { this.app = app; }

    protected IModel<Application> getModel(){ return (IModel<Application>) this.getDefaultModel(); }

}
