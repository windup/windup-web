package org.jboss.windup.web.services.model;

import java.util.Collection;
import java.util.Date;
import java.util.Set;

import javax.persistence.*;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Entity
public class PackageMetadata
{
    public enum ScanStatus
    {
        QUEUED, IN_PROGRESS, COMPLETE
    }

    public static final String PACKAGE_METADATA_ID = "package_metadata_id";

    public PackageMetadata()
    {
        this.discoveredDate = new Date();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = PACKAGE_METADATA_ID, updatable = false, nullable = false)
    private Long id;

    @Column()
    private Date discoveredDate;

    @Column()
    private ScanStatus scanStatus;

    @OneToMany()
    private Set<Package> packages;

    public Long getId()
    {
        return id;
    }

    public Date getDiscoveredDate()
    {
        return discoveredDate;
    }

    public void setDiscoveredDate(Date discoveredDate)
    {
        this.discoveredDate = discoveredDate;
    }

    public ScanStatus getScanStatus()
    {
        return scanStatus;
    }

    public void setScanStatus(ScanStatus scanStatus)
    {
        this.scanStatus = scanStatus;
    }

    public Collection<Package> getPackages()
    {
        return packages;
    }

    public void addPackage(Package pck)
    {
        this.packages.add(pck);
    }

    public void removePackage(Package pck)
    {

    }
}
