package org.jboss.windup.web.service;

import com.tinkerpop.blueprints.GraphQuery;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.service.GraphService;

import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.frames.structures.FramedVertexIterable;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.model.MigrationProjectModel;
import org.jboss.windup.web.addons.websupport.service.MigrationProjectService;

/**
 * Provides methods for creating and managed {@link MigrationProjectModel} vertices.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public class MigrationProjectServiceImpl extends GraphService<MigrationProjectModel> implements MigrationProjectService
{

    public MigrationProjectServiceImpl(GraphContext context)
    {
        super(context, MigrationProjectModel.class);
    }

    @Override
    public MigrationProjectModel getOrCreate(String id)
    {
        MigrationProjectModel result = getUniqueByProperty(MigrationProjectModel.PROP_ID, id);
        if (result == null)
        {
            result = create();
            result.setId(id);
            result.setTitle("Project " + id); // Prevent empty.
            getGraphContext().getFramed().getBaseGraph().getBaseGraph().commit();
        }
        return result;
    }

    @Override
    public MigrationProjectModel getById(String id)
    {
        if (id == null)
        {
            GraphQuery query = getGraphContext().getFramed().query().hasNot(MigrationProjectModel.PROP_ID);
            return getUnique(query);
        }
        return getUniqueByProperty(MigrationProjectModel.PROP_ID, id);
    }



    @Override
    public void deleteAll()
    {
        for (Vertex v : getTypedQuery().vertices())
            v.remove();
    }

    @Override
    public void delete(MigrationProjectModel migration)
    {
        // Refresh based on the ID path and delete it
        getUniqueByProperty(MigrationProjectModel.PROP_ID, migration.getId()).asVertex().remove();
    }


    @Override
    public Iterable<MigrationProjectModel> getAllMigrationProjects()
    {
        return new FramedVertexIterable<>(getGraphContext().getFramed(), findAllQuery().vertices(), MigrationProjectModel.class);
    }

}
