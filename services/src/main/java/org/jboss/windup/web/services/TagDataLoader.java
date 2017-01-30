package org.jboss.windup.web.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.jboss.windup.web.addons.websupport.model.TagDTO;
import org.jboss.windup.web.addons.websupport.rest.TagResource;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.Tag;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Singleton
@Startup
public class TagDataLoader
{
    private static Logger LOG = Logger.getLogger(TagDataLoader.class.getName());

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    @FromFurnace
    private TagResource tagResource;

    @PostConstruct
    public void init()
    {
        this.loadTags();
    }

    @Schedule(hour = "*", minute = "12")
    public void loadPeriodically()
    {
        this.loadTags();
    }

    protected Map<String, Tag> loadTagsFromDb()
    {
        Map<String, Tag> tagHashMap = new HashMap<>();

        for (Tag tag : this.entityManager.createQuery("select t from Tag t", Tag.class).getResultList())
        {
            tagHashMap.put(tag.getName(), tag);
        }

        return tagHashMap;
    }

    protected void loadTags()
    {
        LOG.info("Loading tags......");
        Map<String, Tag> tagsFromDb = this.loadTagsFromDb();
        List<TagDTO> tagDTOS = this.tagResource.getRootTags();

        for (TagDTO tag : tagDTOS)
        {
            this.loadTagHierarchy(tag, tagsFromDb);
        }
    }

    protected Tag loadTagHierarchy(TagDTO tagDTO, Map<String, Tag> tagsFromDb)
    {
        if (!tagsFromDb.containsKey(tagDTO.getTagName()))
        {
            Tag tagEntity = new Tag(tagDTO.getTagName());

            tagEntity.setColor(tagDTO.getColor())
                        .setTitle(tagDTO.getTitle())
                        .setRoot(tagDTO.isRoot())
                        .setPseudo(tagDTO.isPseudo());

            this.entityManager.persist(tagEntity);

            for (TagDTO child : tagDTO.getContainedTags())
            {
                Tag childEntity = this.loadTagHierarchy(child, tagsFromDb);
                childEntity.setParent(tagEntity);
                tagEntity.addContainedTag(childEntity);
            }

            this.entityManager.persist(tagEntity);
            tagsFromDb.put(tagDTO.getTagName(), tagEntity);
        }

        return tagsFromDb.get(tagDTO.getTagName());
    }
}
