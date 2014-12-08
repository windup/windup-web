package org.jboss.forge.rest.startup;

import java.io.File;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.jboss.forge.rest.producer.FurnaceProducer;

/**
 * Application Lifecycle Listener implementation class StartupListener
 *
 */
@WebListener
public class StartupListener implements ServletContextListener {

	@Inject
	Instance<FurnaceProducer> furnaceProducer;

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		String path = sce.getServletContext().getRealPath(
				"/WEB-INF/addon-repository");
		if (path == null) {
			path = "/usr/local/workspace/forge-core-2.0/dist/target/addons";
		}
		File repoDir = new File(path);
		furnaceProducer.get().setup(repoDir);
	}

	/**
	 * @see ServletContextListener#contextDestroyed(ServletContextEvent)
	 */
	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}

}
