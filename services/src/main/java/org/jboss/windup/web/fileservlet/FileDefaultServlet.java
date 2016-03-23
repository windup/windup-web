/*
 * JBoss, Home of Professional Open Source.
 * Copyright 2014 Red Hat, Inc., and individual contributors
 * as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package org.jboss.windup.web.fileservlet;

import io.undertow.Undertow;
import java.util.logging.Logger;
import io.undertow.server.handlers.resource.FileResourceManager;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import java.io.File;
import org.jboss.windup.web.addons.websupport.WebPathUtil;

/**
 * Default servlet responsible for serving up files from a directory.
 * This is both a handler and a servlet. If no filters
 * match the current path, then the resources will be served up asynchronously using the
 * {@link io.undertow.server.HttpHandler#handleRequest(io.undertow.server.HttpServerExchange)} method,
 * otherwise the request is handled as a normal servlet request.
 *
 * <p>
 * By default we only allow a restricted set of extensions.
 * <p>

 * @author Ondrej Zizka, zizka at seznam.cz
 * @see Undertow's DefaultServlet
 */
public class FileDefaultServlet extends DefaultServlet
{
    public static final String BASE_PATH = "base-path";

    /**
     * Which directory should this servlet serve files from.
     */
    private String basePath;


    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);

        initBasePath();
        this.setResourceManager(new FileResourceManager(new File(basePath), 8*1024));
    }


    private void initBasePath() throws ServletException
    {
        // Get base path (path to get all resources from) as init parameter.
        this.basePath = getInitParameter(BASE_PATH);
        this.basePath = WebPathUtil.expandVariables(this.basePath);

        // Validate base path.
        if (this.basePath == null) {
            throw new ServletException("FileServlet init param 'basePath' is required.");
        } else {
            File path = new File(this.basePath);
            if (!path.exists()) {
                throw new ServletException("FileServlet init param 'basePath' value '"
                        + this.basePath + "' does actually not exist in file system.");
            } else if (!path.isDirectory()) {
                throw new ServletException("FileServlet init param 'basePath' value '"
                        + this.basePath + "' is actually not a directory in file system.");
            } else if (!path.canRead()) {
                throw new ServletException("FileServlet init param 'basePath' value '"
                        + this.basePath + "' is actually not readable in file system.");
            }
        }
    }

}
