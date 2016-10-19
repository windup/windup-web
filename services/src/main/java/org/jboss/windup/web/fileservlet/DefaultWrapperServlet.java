package org.jboss.windup.web.fileservlet;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.logging.Logger;

/**
 *
 *  @author Ondrej Zizka, ozizka at redhat.com
 */
public class DefaultWrapperServlet extends HttpServlet
{
    private static final Logger log = Logger.getLogger( DefaultWrapperServlet.class.getName() );


    public void doGet(HttpServletRequest req, HttpServletResponse resp)
    	throws ServletException, IOException
    {
    	RequestDispatcher rd = getServletContext().getNamedDispatcher("default");

        ///req.getServletContext().get;

    	HttpServletRequest wrapped = new HttpServletRequestWrapper(req) {
    		public String getServletPath() { return ""; }


            @Override
            public String getRealPath(String path)
            {
                return super.getRealPath(path); //To change body of generated methods, choose Tools | Templates.
            }

    	};

    	rd.forward(wrapped, resp);
    }

}
