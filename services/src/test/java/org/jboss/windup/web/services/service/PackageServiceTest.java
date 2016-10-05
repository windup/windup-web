package org.jboss.windup.web.services.service;

import static org.mockito.Mockito.mock;

import java.util.Map;
import java.util.TreeMap;

import javax.persistence.EntityManager;

import org.jboss.windup.web.services.model.Package;
import org.junit.Assert;
import org.junit.Test;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class PackageServiceTest
{
    @Test
    public void testCreatePackage()
    {
        PackageService service = new PackageService();
        service.entityManager = mock(EntityManager.class);

        Map<String, Integer> packageClassCnt = new TreeMap<>();
        packageClassCnt.put("org", 0);
        packageClassCnt.put("org.jboss", 50);
        packageClassCnt.put("org.jboss.windup", 100);
        packageClassCnt.put("org.jboss.windup.web", 10);

        Map<String, Package> packageMap = new TreeMap<>();

        Package aPackage = service.createPackage("org.jboss.windup.web", packageClassCnt, packageMap);

        Assert.assertEquals(4, packageMap.keySet().size());

        Assert.assertEquals("org.jboss.windup.web", aPackage.getFullName());
        Assert.assertEquals("web", aPackage.getName());
        Assert.assertEquals(10, aPackage.getCountClasses());

        Package parent = aPackage.getParent();
        Assert.assertEquals("org.jboss.windup", parent.getFullName());
        Assert.assertEquals("windup", parent.getName());
        Assert.assertEquals(100, parent.getCountClasses());

        Package grandParent = parent.getParent();
        Assert.assertEquals("org.jboss", grandParent.getFullName());
        Assert.assertEquals("jboss", grandParent.getName());
        Assert.assertEquals(50, grandParent.getCountClasses());

        Package root = grandParent.getParent();
        Assert.assertEquals("org", root.getFullName());
        Assert.assertEquals("org", root.getName());
        Assert.assertEquals(0, root.getCountClasses());

        Assert.assertNull(root.getParent());
    }
}
