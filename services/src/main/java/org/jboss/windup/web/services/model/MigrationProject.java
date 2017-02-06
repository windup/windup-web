package org.jboss.windup.web.services.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.io.Serializable;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * A migration project is a group of applications which are related to each other and migrated as a bigger enterprise system.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = MigrationProject.class)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MigrationProject implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String MIGRATION_PROJECT_ID = "migration_project_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = MIGRATION_PROJECT_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column(length = 256)
    @Size(min = 1, max = 256)
    @NotNull
    private String title;

    @Column(columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable=false, updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar created;

    @Column(columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar lastModified;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "migrationProject", cascade = CascadeType.REMOVE)
    private Set<ApplicationGroup> groups;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "migrationProject", cascade = CascadeType.REMOVE)
    @Fetch(FetchMode.SELECT)
    private Set<RegisteredApplication> applications;

    public MigrationProject()
    {
        this.groups = new HashSet<>();
        this.applications = new HashSet<>();
    }

    @PrePersist
    protected void onCreate()
    {
        this.created = this.lastModified = new GregorianCalendar();
    }

    @PreUpdate
    protected void onUpdated()
    {
        this.lastModified = new GregorianCalendar();
    }

    public Long getId()
    {
        return this.id;
    }

    public void setId(final Long id)
    {
        this.id = id;
    }

    public int getVersion()
    {
        return this.version;
    }

    public void setVersion(final int version)
    {
        this.version = version;
    }

    /**
     * Contains a title for the project.
     */
    public String getTitle()
    {
        return title;
    }

    /**
     * Contains a title for the project.
     */
    public void setTitle(String title)
    {
        this.title = title;
    }

    /**
     * Contains the {@link ApplicationGroup}s associated with this project.
     */
    @JsonIgnore
    public Set<ApplicationGroup> getGroups()
    {
        return groups;
    }

    /**
     * Contains the {@link ApplicationGroup}s associated with this project.
     */
    @JsonIgnore
    public void setGroups(Set<ApplicationGroup> groups)
    {
        this.groups = groups;
    }

    public void addGroup(ApplicationGroup group)
    {
        this.groups.add(group);
    }

    public void removeGroup(ApplicationGroup group)
    {
        this.groups.remove(group);
    }

    /**
     * Contains creation date
     */
    public Calendar getCreated()
    {
        return created;
    }

    /**
     * Contains date of last modification
     */
    public Calendar getLastModified()
    {
        return lastModified;
    }

    /**
     * Sets date of last modification
     */
    public void setLastModified(Calendar lastModified)
    {
        this.lastModified = lastModified;
    }

    /**
     * Gets default group
     */
    public ApplicationGroup getDefaultGroup()
    {
        Optional<ApplicationGroup> group = this.groups.stream()
                .filter(ApplicationGroup::isDefault)
                .findFirst();

        return group.isPresent() ? group.get() : null;
    }

    /**
     * Contains the {@link RegisteredApplication}s associated with this project
     */
    public Set<RegisteredApplication> getApplications()
    {
        return applications;
    }

    @JsonIgnore
    public void setApplications(Set<RegisteredApplication> applications)
    {
        this.applications = applications;
    }

    /**
     * Adds the {@link RegisteredApplication} to this project
     */
    public void addApplication(RegisteredApplication application)
    {
        this.applications.add(application);
    }

    /**
     * Removes the {@link RegisteredApplication} from this project
     */
    public void removeApplication(RegisteredApplication application)
    {
        this.applications.remove(application);
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (!(o instanceof MigrationProject))
            return false;

        MigrationProject that = (MigrationProject) o;

        if (version != that.version)
            return false;
        return id != null ? id.equals(that.id) : that.id == null;

    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + version;
        return result;
    }
}
