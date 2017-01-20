package org.jboss.windup.web.services.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Entity
public class FilterApplication implements Serializable
{
    public static final String FILTER_APPLICATION_ID = "filter_application_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = FILTER_APPLICATION_ID, updatable = false, nullable = false)
    private Long id;

    @Column
    private String fileName;

    @Column
    private String inputPath;

    @Column
    private String md5Hash;

    @Column
    private String sha1Hash;

    protected FilterApplication()
    {

    }

    public FilterApplication(String name)
    {
        this.fileName = name;
    }

    public Long getId()
    {
        return id;
    }

    public String getFileName()
    {
        return fileName;
    }

    public void setFileName(String name)
    {
        this.fileName = name;
    }

    public String getInputPath()
    {
        return inputPath;
    }

    public void setInputPath(String inputPath)
    {
        this.inputPath = inputPath;
    }

    public String getMd5Hash() {
        return md5Hash;
    }

    public void setMd5Hash(String md5Hash) {
        this.md5Hash = md5Hash;
    }

    public String getSha1Hash() {
        return sha1Hash;
    }

    public void setSha1Hash(String sha1Hash) {
        this.sha1Hash = sha1Hash;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }

        if (o == null || getClass() != o.getClass())
        {
            return false;
        }

        FilterApplication that = (FilterApplication) o;

        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode()
    {
        return id != null ? id.hashCode() : 0;
    }
}
