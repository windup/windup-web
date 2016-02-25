package org.jboss.windup.web;

import javax.enterprise.inject.spi.BeanManager;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import net.ftlines.wicket.cdi.CdiConfiguration;
import net.ftlines.wicket.cdi.ConversationPropagation;
import org.apache.wicket.*;
import org.apache.wicket.authorization.Action;
import org.apache.wicket.authorization.IAuthorizationStrategy;
import org.apache.wicket.markup.html.IPackageResourceGuard;
import org.apache.wicket.markup.html.PackageResourceGuard;
import org.apache.wicket.protocol.http.WebApplication;
import org.apache.wicket.request.component.IRequestableComponent;
import org.jboss.windup.pages.home.HomePage;
import org.jboss.windup.web.pages.statics.AboutPage;


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
        new CdiConfiguration(bm).setPropagation(ConversationPropagation.NONE).configure(this);

        // This would prevent Ajax components throwing an exception after session expiration.
        //this.getPageSettings().setRecreateMountedPagesAfterExpiry(false);

        //this.getApplicationSettings().setPageExpiredErrorPage(ErrorPage.class);
        this.getMarkupSettings().setStripWicketTags(true);
        //this.getResourceSettings().setThrowExceptionOnMissingResource( false ); // Fix: http://localhost:8080/essc-portal/release/EAP/HomePage.html?0
        //this.getPageSettings().setVersionPagesByDefault(false);


        // Mounts
        mountPage("/about", AboutPage.class);

        //mountPage("/app/${id}", AppPage.class);
        //mountPage("/app/${id}/${run}", RunPage.class);

        initResources();

        // Register the authorization strategy
        getSecuritySettings().setAuthorizationStrategy( new EsscAuthStrategy() );

    }


    /**
     *  Initialize resources. Mostly registers images as shared resources.
     */
    void initResources(){

        //ResourceReference ref1 = new PackageResourceReference( BaseLayoutPage.class, "images/btn/AddApp.png");

        IPackageResourceGuard guard =
        new IPackageResourceGuard() {
            private final IPackageResourceGuard DEFAULT = new PackageResourceGuard();
            @Override public boolean accept( Class<?> scope, String path ) {
                if( path.endsWith(".png") ) return true;
                if( path.endsWith(".jpg") ) return true;
                if( path.endsWith(".gif") ) return true;
                return DEFAULT.accept( scope, path );
            }
        };
        getResourceSettings().setPackageResourceGuard( guard );
    }



    public static WicketJavaEEApplication getApp(){
        return (WicketJavaEEApplication) Application.get();
    }

    public boolean isDevMode(){
        return RuntimeConfigurationType.DEVELOPMENT == Application.get().getConfigurationType();
    }

}





/**
 *  Authorize instantiation of SecuredPage-marked only for logged users.
 *  @author ondra
 */
class EsscAuthStrategy implements IAuthorizationStrategy {

    public boolean isActionAuthorized( Component component, Action action ) {
        // authorize everything
        return true;
    }


    public <T extends IRequestableComponent> boolean isInstantiationAuthorized( Class<T> componentClass ) {
        return true;
    }

}
