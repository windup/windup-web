package org.jboss.windup.web.addons.websupport.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@JsonIgnoreProperties("handler")
public interface TagDTO
{
    String getTagName();
    boolean isRoot();
    boolean isPseudo();
    String getColor();
    String getTitle();
    List<TagDTO> getContainedTags();
}
