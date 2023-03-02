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

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * When user requests static report files:
 * 'static-report/{reportNumber}/pf-reports/settings.js' or 'static-report/{reportNumber}/pf-reports/windup.js'
 * then redirect request to 'static-report/{reportNumber}/pf-reports/settings.js.ejs' or 'static-report/{reportNumber}/pf-reports/windup.js.ejs'
 * <p>
 * When user requests 'static-report/{reportNumber}/pf-reports/api/*'
 * then redirect request to 'static-report/{reportNumber}/pf-reports/api/*.json'
 */
public class FileDefaultServletFilter implements Filter {

    private static final String BASE_PATH = "/pf-reports";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
        HttpServletRequest httpServletRequest = ((HttpServletRequest) request);
        String requestURI = httpServletRequest.getRequestURI();

        HttpServletResponse httpResponse = (HttpServletResponse) response;

        if (requestURI.endsWith(BASE_PATH + "/settings.js") || requestURI.endsWith(BASE_PATH + "/windup.js")) {
            String newURI = requestURI.concat(".ejs");
            httpResponse.sendRedirect(newURI);
        } else if (requestURI.contains(BASE_PATH + "/api/") && !requestURI.endsWith(".json")) {
            String newURI = requestURI.concat(".json");
            httpResponse.sendRedirect(newURI);
        } else {
            chain.doFilter(request, response);
        }
    }

}
