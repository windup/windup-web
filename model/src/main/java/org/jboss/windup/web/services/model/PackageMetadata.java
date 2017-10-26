package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Contains information about package discovery status and discovered packages
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PackageMetadata implements Serializable
{
    /**
     * Status of package discovery
     */
    public enum ScanStatus
    {
        QUEUED, IN_PROGRESS, COMPLETE
    }

    public static final String PACKAGE_METADATA_ID = "package_metadata_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = PACKAGE_METADATA_ID, updatable = false, nullable = false)
    private Long id;

    @Column()
    private Date discoveredDate;

    @Column()
    private ScanStatus scanStatus;

    // TODO: I don't really want it to be eager, I just need to fix error for now
    @ManyToMany(fetch = FetchType.EAGER)
    private Set<Package> packages;

    public PackageMetadata()
    {
        this.discoveredDate = new Date();
        this.scanStatus = ScanStatus.QUEUED;
        this.packages = new HashSet<>();
    }

    public Long getId()
    {
        return id;
    }

    /**
     * Gets date when package discovery was run
     *
     * @return Date when package discovery was run
     */
    public Date getDiscoveredDate()
    {
        return discoveredDate;
    }

    /**
     * Sets date when package discovery was run
     *
     * @param discoveredDate Date when package discovery was run
     */
    public void setDiscoveredDate(Date discoveredDate)
    {
        this.discoveredDate = discoveredDate;
    }

    /**
     * Gets status of the package discovery
     *
     * @return Status of package discovery
     */
    public ScanStatus getScanStatus()
    {
        return scanStatus;
    }

    /**
     * Sets status of the package discovery
     *
     * @param scanStatus Status of package discovery
     */
    public void setScanStatus(ScanStatus scanStatus)
    {
        this.scanStatus = scanStatus;
    }

    /**
     * Gets discovered packages
     *
     * @return Discovered packages
     */
    @JsonIgnore
    public Collection<Package> getPackages()
    {
        return packages;
    }

    @JsonIgnore
    public void setPackages(Collection<Package> packages)
    {
        this.packages = new HashSet<>(packages);
    }

    /**
     * Gets root packages
     *
     * @return Root packages
     */
    @JsonProperty("packageTree")
    public Collection<Package> getRootPackages()
    {
        return this.packages.stream()
                .filter(item -> item.getLevel() == 0)
                .collect(Collectors.toList());
    }

    /**
     * Adds discovered package
     *
     * @param aPackage Discovered package
     */
    public void addPackage(Package aPackage)
    {
        this.packages.add(aPackage);
    }

    /**
     * Removes discovered package
     *
     * @param aPackage Discovered package
     */
    public void removePackage(Package aPackage)
    {
        this.packages.remove(aPackage);
    }
}
