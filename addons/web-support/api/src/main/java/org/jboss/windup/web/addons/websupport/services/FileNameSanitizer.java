package org.jboss.windup.web.addons.websupport.services;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public interface FileNameSanitizer
{
    String cleanFileName(String originalFileName);

    String shortenFileName(String originalFileName, int maxLength);
}
