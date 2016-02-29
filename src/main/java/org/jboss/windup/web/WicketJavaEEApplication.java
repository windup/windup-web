package org.jboss.windup.web;

import javax.enterprise.inject.spi.BeanManager;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import org.apache.wicket.cdi.CdiConfiguration;
import org.apache.wicket.cdi.ConversationPropagation;
import org.apache.wicket.*;
import org.apache.wicket.authorization.Action;
import org.apache.wicket.authorization.IAuthorizationStrategy;
import org.apache.wicket.protocol.http.WebApplication;
import org.apache.wicket.request.component.IRequestableComponent;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.apache.wicket.request.resource.IResource;
import org.jboss.windup.pages.home.HomePage;
import org.jboss.windup.pages.statics.AboutPage;


/**
 * Wicket application class.
 *
 * @author Ondrej Zizka
 */
public class WicketJavaEEApplication extends WebApplication {

    @Override
    public Class<? extends Page> getHomePage() {
        return HomePage.class;
    }


    @Override
    protected void init() {
        super.init();

        // Enable CDI
        BeanManager bm;
        try {
            bm = (BeanManager) new InitialContext().lookup("java:comp/BeanManager");
        } catch (NamingException e) {
            throw new IllegalStateException("Unable to obtain CDI BeanManager", e);
        }

        // Configure CDI, disabling Conversations as we aren't using them
        new CdiConfiguration().setFallbackBeanManager(bm).setPropagation(ConversationPropagation.NONE).configure(this);

        // Wicket Settings
        // This would prevent Ajax components throwing an exception after session expiration.
        //this.getPageSettings().setRecreateMountedPagesAfterExpiry(false);
        //this.getPageSettings().setVersionPagesByDefault(false);
        //this.getApplicationSettings().setPageExpiredErrorPage(ErrorPage.class);
        this.getMarkupSettings().setStripWicketTags(true);
        //this.getResourceSettings().setThrowExceptionOnMissingResource( false );


        // Mounts
        mountPage("/about", AboutPage.class);

        //mountPage("/app/${id}", AppPage.class);
        //mountPage("/app/${id}/${run}", RunPage.class);

        // Register the authorization strategy
        getSecuritySettings().setAuthorizationStrategy( new WindupAuthStrategy() );

    }


    public static WicketJavaEEApplication getApp(){
        return (WicketJavaEEApplication) Application.get();
    }

}




/**
 *  Authorize instantiation of SecuredPage-marked only for logged users.
 *  @author ondra
 */
class WindupAuthStrategy implements IAuthorizationStrategy
{
    @Override
    public boolean isActionAuthorized( Component component, Action action ) {
        // authorize everything
        return true;
    }

    @Override
    public <T extends IRequestableComponent> boolean isInstantiationAuthorized( Class<T> componentClass ) {
        return true;
    }

    @Override
    public boolean isResourceAuthorized(IResource arg0, PageParameters arg1)
    {
        return true;
    }
}
