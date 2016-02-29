package org.jboss.windup.web.model;

import java.io.Serializable;
import java.text.Format;
import java.util.Date;
import java.util.Locale;
import java.util.Objects;
import javax.persistence.*;
import org.apache.commons.lang.time.FastDateFormat;


/**
 *  Information about an application.
 *
 *  @author Ondrej Zizka
 */
@SuppressWarnings("serial")
@Entity @Table(name="`app`")
public class Application implements Serializable
{
    private static final Format DF = FastDateFormat.getInstance("yyyy-MM-dd", Locale.US);

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT UNSIGNED")
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String path;

    @Temporal(TemporalType.DATE)
    @Column(columnDefinition="TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP", insertable=false, updatable=false)
    private Date added = new Date();

    private Status status = Status.QUEUED;

    private String note;



    public Application() {
    }

    public Application(String path) {
        this.path = path;
    }


    //<editor-fold defaultstate="collapsed" desc="Get/set">
    public Long getId() {        return id;    }
    public void setId(Long id) { this.id = id;    }

    public String getName() { return name; }
    public void setName( String name ) { this.name = name; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getNote() {        return note;    }
    public Application setNote(String note) { this.note = note; return this; }

    public Status getStatus() {        return status;    }
    public void setStatus(Status status) { this.status = status;    }

    public Date getAdded() { return added; }
    public void setAdded( Date added ) { this.added = added; }

    //</editor-fold>


    @Override
    public String toString() {
        return String.format("App %s", path);
    }


    //<editor-fold defaultstate="collapsed" desc="hash/eq">
    @Override
    public int hashCode()
    {
        int hash = 7;
        hash = 29 * hash + Objects.hashCode(this.path);
        return hash;
    }

    @Override
    public boolean equals(Object obj)
    {
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        final Application other = (Application) obj;
        if (!Objects.equals(this.path, other.path))
            return false;
        return true;
    }
    //</editor-fold>


    /**
     *  Status of the release.
     */
    public enum Status {
        QUEUED("Queued"),
        IN_PROGRESS("In progress"),
        DONE("Done"),
        FAILED("Failed");

        private String statusString;

        private Status( String ss ) {
            this.statusString = ss;
        }

        public String getStatusString() {
            return statusString;
        }

    }

}// class
