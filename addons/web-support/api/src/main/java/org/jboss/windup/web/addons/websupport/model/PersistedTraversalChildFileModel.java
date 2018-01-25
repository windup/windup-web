package org.jboss.windup.web.addons.websupport.model;

import org.jboss.windup.graph.Adjacency;
import org.jboss.windup.graph.Property;
import org.jboss.windup.graph.model.TypeValue;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.reporting.model.ClassificationModel;
import org.jboss.windup.reporting.model.InlineHintModel;
import org.jboss.windup.reporting.model.TechnologyTagModel;

import java.util.List;

/**
 * Persists some high-level information regarding a file within a traversal that might be relevant only within
 * the context of that traversal.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@TypeValue(PersistedTraversalChildFileModel.TYPE)
public interface PersistedTraversalChildFileModel extends WindupVertexFrame
{
    String TYPE = "PersistedProjectModelTraversalChildFile";
    String FILE_PATH = TYPE + ".filePath";
    String FILE_MODEL = TYPE + ".fileModel";
    String CLASSIFICATIONS = TYPE + ".classifications";
    String HINTS = TYPE + ".hints";
    String TECHNOLOGYTAGS = TYPE + ".technologytags";

    /**
     * Contains the relative path of the file within its project.
     */
    @Property(FILE_PATH)
    String getFilePath();

    /**
     * Contains the relative path of the file within its project.
     */
    @Property(FILE_PATH)
    void setFilePath(String filePath);

    /**
     * Contains a link to the filemodel itself.
     */
    @Adjacency(label = FILE_MODEL)
    FileModel getFileModel();

    /**
     * Contains a link to the filemodel itself.
     */
    @Adjacency(label = FILE_MODEL)
    void setFileModel(FileModel fileModel);

    /**
     * Contains links to all classifications associated with this file.
     */
    @Adjacency(label = CLASSIFICATIONS)
    List<ClassificationModel> getClassifications();

    /**
     * Contains links to all classifications associated with this file.
     */
    @Adjacency(label = CLASSIFICATIONS)
    void setClassifications(Iterable<ClassificationModel> classifications);

    /**
     * Contains links to all hints associated with this file.
     */
    @Adjacency(label = HINTS)
    List<InlineHintModel> getHints();

    /**
     * Contains links to all hints associated with this file.
     */
    @Adjacency(label = HINTS)
    void setHints(Iterable<InlineHintModel> hints);

    /**
     * Contains links to all technology tags associated with this file.
     */
    @Adjacency(label = TECHNOLOGYTAGS)
    List<TechnologyTagModel> getTechnologyTags();

    /**
     * Contains links to all technology tags associated with this file.
     */
    @Adjacency(label = TECHNOLOGYTAGS)
    void setTechnologyTags(Iterable<TechnologyTagModel> technologyTags);
}
