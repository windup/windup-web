package org.jboss.windup.web.addons.websupport.model;

import java.util.List;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public interface TagDTO
{
    String getTagName();
    boolean isRoot();
    boolean isPseudo();
    String getColor();
    String getTitle();
    List<TagDTO> getContainedTags();
}
