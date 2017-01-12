package org.jboss.windup.web.addons.websupport.rest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.inject.Inject;

import org.jboss.windup.config.tags.Tag;
import org.jboss.windup.config.tags.TagServiceHolder;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class TagResourceImpl implements TagResource
{
    @Inject
    private TagServiceHolder tagServiceHolder;

    @Override
    public List<Object> getRootTags()
    {
        return buildTagStructure(null, tagServiceHolder.getTagService().getRootTags());
    }

    private List<Object> buildTagStructure(TagDTO parent, Collection<Tag> children) {
        List<Object> result = new ArrayList<>();
        children.forEach(tag -> {
            TagDTO tagDTO = new TagDTO(tag.getName(), tag.isRoot(), tag.isPseudo(), tag.getColor(), tag.getTitle());

            if (parent != null)
                parent.getContainedTags().add(tagDTO);

            result.add(tagDTO);

            this.buildTagStructure(tagDTO, tag.getContainedTags());
        });
        return result;
    }

    private class TagDTO
    {
        private String tagName;
        private boolean isRoot;
        private boolean isPseudo;
        private String color;
        private String title;
        private List<TagDTO> containedTags = new ArrayList<>();

        public TagDTO(String tagName, boolean isRoot, boolean isPseudo, String color, String title)
        {
            this.tagName = tagName;
            this.isRoot = isRoot;
            this.isPseudo = isPseudo;
            this.color = color;
            this.title = title;
        }

        public String getTagName()
        {
            return tagName;
        }

        public boolean isRoot()
        {
            return isRoot;
        }

        public boolean isPseudo()
        {
            return isPseudo;
        }

        public String getColor()
        {
            return color;
        }

        public String getTitle()
        {
            return title;
        }

        public List<TagDTO> getContainedTags()
        {
            return containedTags;
        }
    }
}
