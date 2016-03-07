package org.jboss.windup.web.ui;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.logging.Logger;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class PathFilter implements Filter
{
    public static final String DEFAULT_PATH = "DefaultPath";
    public static final String EXCLUDED_PATHS = "ExcludedPathPrefixes";
    private static Logger LOG = Logger.getLogger(PathFilter.class.getSimpleName());

    private String defaultPath = "/";
    private String[] excludePrefixes = new String[0];

    @Override
    public void init(FilterConfig filterConfig) throws ServletException
    {
        this.defaultPath = filterConfig.getInitParameter(DEFAULT_PATH);

        String excludePrefixesString = filterConfig.getInitParameter(EXCLUDED_PATHS);
        this.excludePrefixes = excludePrefixesString.split(";");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException
    {
        if (!(request instanceof HttpServletRequest))
        {
            chain.doFilter(request, response);
            return;
        }

        HttpServletRequest servletRequest = (HttpServletRequest) request;
        String path = servletRequest.getServletPath();
        LOG.info("Path: " + path);

        if (path.equals(this.defaultPath))
        {
            chain.doFilter(request, response);
            return;
        }

        for (String excludePath : this.excludePrefixes)
        {
            if (path.startsWith(excludePath))
            {
                chain.doFilter(request, response);
                return;
            }
        }

        servletRequest.getRequestDispatcher(this.defaultPath).forward(request, response);
    }

    @Override
    public void destroy()
    {
    }
}
