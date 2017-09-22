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
package org.jboss.windup.web.services.servlet;

import io.undertow.Undertow;

import java.nio.file.Paths;
import java.util.logging.Logger;
import io.undertow.io.IoCallback;
import io.undertow.io.Sender;
import io.undertow.server.HttpServerExchange;
import io.undertow.server.handlers.resource.DirectoryUtils;
import io.undertow.server.handlers.resource.FileResourceManager;
import io.undertow.server.handlers.resource.RangeAwareResource;
import io.undertow.server.handlers.resource.Resource;
import io.undertow.servlet.api.DefaultServletConfig;
import io.undertow.servlet.api.Deployment;
import io.undertow.servlet.spec.ServletContextImpl;
import io.undertow.util.ByteRange;
import io.undertow.util.CanonicalPathUtils;
import io.undertow.util.DateUtils;
import io.undertow.util.ETag;
import io.undertow.util.ETagUtils;
import io.undertow.util.Headers;
import io.undertow.util.Methods;
import io.undertow.util.StatusCodes;

import javax.inject.Inject;
import javax.servlet.DispatcherType;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.RedirectionException;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.WindupExecutionService;

/**
 * Default servlet responsible for serving up resources. This is both a handler and a servlet. If no filters
 * match the current path then the resources will be served up asynchronously using the
 * {@link io.undertow.server.HttpHandler#handleRequest(io.undertow.server.HttpServerExchange)} method,
 * otherwise the request is handled as a normal servlet request.
 * <p>
 * By default we only allow a restricted set of extensions.
 * <p>
 * todo: this thing needs a lot more work. In particular:
 * - caching for blocking requests
 * - correct mime type
 * - range/last-modified and other headers to be handled properly
 * - head requests
 * - and probably heaps of other things
 *
 * @author Stuart Douglas
 * @author Ondrej Zizka, ozizka at redhat.com
 * @see Undertow's DefaultServlet
 */
public class FileDefaultServlet extends HttpServlet
{
    private static final Logger LOG = Logger.getLogger(FileDefaultServlet.class.getName() );

    public static final String DIRECTORY_LISTING = "directory-listing";
    public static final String DEFAULT_ALLOWED = "default-allowed";
    public static final String ALLOWED_EXTENSIONS = "allowed-extensions";
    public static final String DISALLOWED_EXTENSIONS = "disallowed-extensions";
    public static final String RESOLVE_AGAINST_CONTEXT_ROOT = "resolve-against-context-root";
    public static final String BASE_PATH = "base-path";

    private static final Set<String> DEFAULT_ALLOWED_EXTENSIONS = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            "js", "css", "png", "jpg", "gif", "html", "htm", "txt", "pdf", "jpeg", "xml",
            "svg", "ttf", "java")));


    private Deployment deployment;
    private boolean directoryListingEnabled = false;

    private boolean defaultAllowed = true;
    private Set<String> allowed = DEFAULT_ALLOWED_EXTENSIONS;
    private Set<String> disallowed = Collections.emptySet();
    private boolean resolveAgainstContextRoot;

    // Which directory should this servlet serve files from.
    private String basePath;
    private FileResourceManager fileResourceManager;

    @Inject @FromFurnace
    private WebPathUtil webPathUtil;

    @Inject
    private WindupExecutionService windupExecutionService;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);

        // The directory to serve files from.
        initBasePath();
        this.fileResourceManager = new FileResourceManager(new File(basePath), 8*1024);

        // Options
        ServletContextImpl sc = (ServletContextImpl) config.getServletContext();
        this.deployment = sc.getDeployment();

        DefaultServletConfig defaultServletConfig = deployment.getDeploymentInfo().getDefaultServletConfig();
        if (defaultServletConfig != null) {
            defaultAllowed = defaultServletConfig.isDefaultAllowed();
            allowed = new HashSet<>();
            if (defaultServletConfig.getAllowed() != null) {
                allowed.addAll(defaultServletConfig.getAllowed());
            }
            disallowed = new HashSet<>();
            if (defaultServletConfig.getDisallowed() != null) {
                disallowed.addAll(defaultServletConfig.getDisallowed());
            }
        }
        if (config.getInitParameter(DEFAULT_ALLOWED) != null) {
            defaultAllowed = Boolean.parseBoolean(config.getInitParameter(DEFAULT_ALLOWED));
        }
        if (config.getInitParameter(ALLOWED_EXTENSIONS) != null) {
            String extensions = config.getInitParameter(ALLOWED_EXTENSIONS);
            allowed = new HashSet<>(Arrays.asList(extensions.split(",")));
        }
        if (config.getInitParameter(DISALLOWED_EXTENSIONS) != null) {
            String extensions = config.getInitParameter(DISALLOWED_EXTENSIONS);
            disallowed = new HashSet<>(Arrays.asList(extensions.split(",")));
        }
        if (config.getInitParameter(RESOLVE_AGAINST_CONTEXT_ROOT) != null) {
            resolveAgainstContextRoot = Boolean.parseBoolean(config.getInitParameter(RESOLVE_AGAINST_CONTEXT_ROOT));
        }

        String listings = config.getInitParameter(DIRECTORY_LISTING);
        if (Boolean.valueOf(listings)) {
            this.directoryListingEnabled = true;
        }

    }


    private void initBasePath() throws ServletException
    {
        // Get base path (path to get all resources from) as init parameter.
        // this.basePath = getInitParameter(BASE_PATH);
        // this.basePath = webPathUtil.expandVariables(this.basePath);
        this.basePath = webPathUtil.getGlobalWindupDataPath().normalize().toString();

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

    @Override
    protected void doGet(final HttpServletRequest req, final HttpServletResponse resp) throws ServletException, IOException {

        String path = "";

        try {
            path = getPath(req);
        } catch (NotFoundException e) {
            resp.sendError(StatusCodes.NOT_FOUND, e.getMessage());
            return;
        } catch (BadRequestException e) {
            resp.sendError(StatusCodes.BAD_REQUEST, e.getMessage());
            return;
        }

        if (!isAllowed(path, req.getDispatcherType())) {
            resp.sendError(StatusCodes.NOT_FOUND);
            return;
        }

        if(File.separatorChar != '/') {
            //if the separator char is not / we want to replace it with a / and canonicalise
            path = CanonicalPathUtils.canonicalize(path.replace(File.separatorChar, '/'));
        }


        File requestedFile = new File(basePath, URLDecoder.decode(path, "UTF-8"));

        final Resource resource;

        //we want to disallow windows characters in the path
        if(File.separatorChar == '/' || !path.contains(File.separator)) {
            //resource = resourceManager.getResource(path);
            //resource = new FileResource(requestedFile, this.fileResourceManager, path);
            resource = this.fileResourceManager.getResource(path);
        } else {
            resource = null;
        }

        if (resource == null) {
            if (req.getDispatcherType() == DispatcherType.INCLUDE) {
                //servlet 9.3
                throw new FileNotFoundException(path);
            } else {
                resp.sendError(StatusCodes.NOT_FOUND);
            }
            return;
        }

        // Directory
        if (resource.isDirectory()) {
            if ("css".equals(req.getQueryString())) {
                resp.setContentType("text/css");
                resp.getWriter().write(DirectoryUtils.Blobs.FILE_CSS);
                return;
            } else if ("js".equals(req.getQueryString())) {
                resp.setContentType("application/javascript");
                resp.getWriter().write(DirectoryUtils.Blobs.FILE_JS);
                return;
            }
            if (!directoryListingEnabled)
                resp.sendError(StatusCodes.FORBIDDEN);

            StringBuilder output = DirectoryUtils.renderDirectoryListing(req.getRequestURI(), resource);
            resp.getWriter().write(output.toString());
        }

        // File
        else {
            if(path.endsWith("/")) {
                //UNDERTOW-432
                resp.sendError(StatusCodes.NOT_FOUND);
                return;
            }
            serveFileBlocking(req, resp, resource);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        /*
         * Where a servlet has received a POST request we still require the capability to include static content.
         */
        switch (req.getDispatcherType()) {
            case INCLUDE:
            case FORWARD:
            case ERROR:
                doGet(req, resp);
                break;
            default:
                super.doPost(req, resp);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        switch (req.getDispatcherType()) {
            case INCLUDE:
            case FORWARD:
            case ERROR:
                doGet(req, resp);
                break;
            default:
                super.doPut(req, resp);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        switch (req.getDispatcherType()) {
            case INCLUDE:
            case FORWARD:
            case ERROR:
                doGet(req, resp);
                break;
            default:
                super.doDelete(req, resp);
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        switch (req.getDispatcherType()) {
            case INCLUDE:
            case FORWARD:
            case ERROR:
                doGet(req, resp);
                break;
            default:
                super.doOptions(req, resp);
        }
    }

    @Override
    protected void doTrace(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        switch (req.getDispatcherType()) {
            case INCLUDE:
            case FORWARD:
            case ERROR:
                doGet(req, resp);
                break;
            default:
                super.doTrace(req, resp);
        }
    }

    private void serveFileBlocking(final HttpServletRequest req, final HttpServletResponse resp, final Resource resource) throws IOException {
        final ETag etag = resource.getETag();
        final Date lastModified = resource.getLastModified();
        if(req.getDispatcherType() != DispatcherType.INCLUDE) {
            if (!ETagUtils.handleIfMatch(req.getHeader(Headers.IF_MATCH_STRING), etag, false) ||
                    !DateUtils.handleIfUnmodifiedSince(req.getHeader(Headers.IF_UNMODIFIED_SINCE_STRING), lastModified)) {
                resp.setStatus(StatusCodes.PRECONDITION_FAILED);
                return;
            }
            if (!ETagUtils.handleIfNoneMatch(req.getHeader(Headers.IF_NONE_MATCH_STRING), etag, true) ||
                    !DateUtils.handleIfModifiedSince(req.getHeader(Headers.IF_MODIFIED_SINCE_STRING), lastModified)) {
                resp.setStatus(StatusCodes.NOT_MODIFIED);
                return;
            }
        }

        //we are going to proceed. Set the appropriate headers
        if(resp.getContentType() == null) {
            if(!resource.isDirectory()) {
                final String contentType = deployment.getServletContext().getMimeType(resource.getName());
                if (contentType != null) {
                    resp.setContentType(contentType);
                } else {
                    resp.setContentType("application/octet-stream");
                }
            }
        }
        if (lastModified != null) {
            resp.setHeader(Headers.LAST_MODIFIED_STRING, resource.getLastModifiedString());
        }
        if (etag != null) {
            resp.setHeader(Headers.ETAG_STRING, etag.toString());
        }
        ByteRange range = null;
        long start = -1, end = -1;
        try {
            //only set the content length if we are using a stream
            //if we are using a writer who knows what the length will end up being
            //todo: if someone installs a filter this can cause problems
            //not sure how best to deal with this
            //we also can't deal with range requests if a writer is in use
            Long contentLength = resource.getContentLength();
            if (contentLength != null) {
                resp.getOutputStream();
                if(contentLength > Integer.MAX_VALUE) {
                    resp.setContentLengthLong(contentLength);
                } else {
                    resp.setContentLength(contentLength.intValue());
                }
                if(resource instanceof RangeAwareResource && ((RangeAwareResource)resource).isRangeSupported()) {
                    //TODO: figure out what to do with the content encoded resource manager
                    range = ByteRange.parse(req.getHeader(Headers.RANGE_STRING));
                    if(range != null && range.getRanges() == 1) {
                        start = range.getStart(0);
                        end = range.getEnd(0);
                        if(start == -1 ) {
                            //suffix range
                            long toWrite = end;
                            if(toWrite >= 0) {
                                if(toWrite > Integer.MAX_VALUE) {
                                    resp.setContentLengthLong(toWrite);
                                } else {
                                    resp.setContentLength((int)toWrite);
                                }
                            } else {
                                //ignore the range request
                                range = null;
                            }
                            start = contentLength - end;
                            end = contentLength;
                        } else if(end == -1) {
                            //prefix range
                            long toWrite = contentLength - start;
                            if(toWrite >= 0) {
                                if(toWrite > Integer.MAX_VALUE) {
                                    resp.setContentLengthLong(toWrite);
                                } else {
                                    resp.setContentLength((int)toWrite);
                                }
                            } else {
                                //ignore the range request
                                range = null;
                            }
                            end = contentLength;
                        } else {
                            long toWrite = end - start + 1;
                            if(toWrite > Integer.MAX_VALUE) {
                                resp.setContentLengthLong(toWrite);
                            } else {
                                resp.setContentLength((int)toWrite);
                            }
                        }
                        if(range != null) {
                            resp.setStatus(StatusCodes.PARTIAL_CONTENT);
                            resp.setHeader(Headers.CONTENT_RANGE_STRING, range.getStart(0) + "-" + range.getEnd(0) + "/" + contentLength);
                        }
                    }
                }
            }
        } catch (IllegalStateException e) {

        }
        final boolean include = req.getDispatcherType() == DispatcherType.INCLUDE;
        if (!req.getMethod().equals(Methods.HEAD_STRING)) {
            HttpServerExchange exchange = SecurityActions.requireCurrentServletRequestContext().getOriginalRequest().getExchange();
            if(range == null) {
                resource.serve(exchange.getResponseSender(), exchange, completionCallback(include));
            } else {
                ((RangeAwareResource)resource).serveRange(exchange.getResponseSender(), exchange, start, end, completionCallback(include));
            }
        }
    }

    private IoCallback completionCallback(final boolean include) {
        return new IoCallback() {

            @Override
            public void onComplete(final HttpServerExchange exchange, final Sender sender) {
                if (!include) {
                    sender.close();
                }
            }

            @Override
            public void onException(final HttpServerExchange exchange, final Sender sender, final IOException exception) {
                //not much we can do here, the connection is broken
                sender.close();
            }
        };
    }

    private String getPath(final HttpServletRequest request) {
        String servletPath;
        String pathInfo;

        if (request.getDispatcherType() == DispatcherType.INCLUDE && request.getAttribute(RequestDispatcher.INCLUDE_REQUEST_URI) != null) {
            pathInfo = (String) request.getAttribute(RequestDispatcher.INCLUDE_PATH_INFO);
            servletPath = (String) request.getAttribute(RequestDispatcher.INCLUDE_SERVLET_PATH);
        } else {
            pathInfo = request.getPathInfo();
            servletPath = request.getServletPath();
        }

        String result = pathInfo;

        if (result == null) {
            result = servletPath;
        } else if(resolveAgainstContextRoot) {
            result = servletPath + CanonicalPathUtils.canonicalize(pathInfo);
        } else {
            result = CanonicalPathUtils.canonicalize(result);
        }

        if ((result == null) || (result.equals(""))) {
            result = "/";
        }

        String[] pathParts = result.split("/");

        try {
            Long executionId = Long.parseLong(pathParts[1]); // {id}
            String directoryPath = result.substring(result.indexOf("/", result.indexOf("/") + 1));

            WindupExecution execution = this.windupExecutionService.getNoThrow(executionId);

            if (execution == null) {
                throw new NotFoundException("Migration report not found");
            }

            String outputPath = Paths.get(execution.getOutputPath()).normalize().toString();
            return Paths.get(outputPath.replace(this.basePath, ""), directoryPath).toString();
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid executionId value: '" + pathParts[1] + "'");
        }
    }

    private boolean isAllowed(String path, DispatcherType dispatcherType) {
        if (!path.isEmpty()) {
            if(dispatcherType == DispatcherType.REQUEST) {
                //WFLY-3543 allow the dispatcher to access stuff in web-inf and meta inf
                if (path.startsWith("/META-INF") ||
                        path.startsWith("META-INF") ||
                        path.startsWith("/WEB-INF") ||
                        path.startsWith("WEB-INF")) {
                    return false;
                }
            }
        }
        int pos = path.lastIndexOf('/');
        final String lastSegment;
        if (pos == -1) {
            lastSegment = path;
        } else {
            lastSegment = path.substring(pos + 1);
        }
        if (lastSegment.isEmpty()) {
            return true;
        }
        int ext = lastSegment.lastIndexOf('.');
        if (ext == -1) {
            //no extension
            return true;
        }
        final String extension = lastSegment.substring(ext + 1, lastSegment.length());
        if (defaultAllowed) {
            return !disallowed.contains(extension);
        } else {
            return allowed.contains(extension);
        }
    }

}
