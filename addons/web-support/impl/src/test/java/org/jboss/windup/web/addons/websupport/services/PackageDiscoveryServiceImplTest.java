package org.jboss.windup.web.addons.websupport.services;

import static org.mockito.Matchers.contains;
import static org.mockito.Mockito.*;

import org.jboss.windup.rules.apps.java.scan.operation.packagemapping.PackageNameMappingRegistry;
import org.jboss.windup.util.PathUtil;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.junit.Assert;
import org.junit.Test;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class PackageDiscoveryServiceImplTest
{
    @Test
    public void testWithDefaultRules()
    {
        PackageDiscoveryServiceImpl impl = new PackageDiscoveryServiceImpl();
        impl.webPathUtil = mock(WebPathUtil.class);
        impl.packageNameMappingRegistry = mock(PackageNameMappingRegistry.class);

        when(impl.packageNameMappingRegistry.getOrganizationForPackage(contains("apache")))
                    .thenReturn("Apache");

        String samplePath = this.getClass().getResource("/sample").getPath();
        String defaultRulesPath = PathUtil.getWindupRulesDir().toString();

        PackageDiscoveryServiceImpl spiedObject = spy(impl);

        spiedObject.execute(samplePath);

        verify(spiedObject, times(1)).execute(defaultRulesPath, samplePath);
    }

    @Test
    public void testScanSourceCode()
    {
        String samplePath = this.getClass().getResource("/sample").getPath();
        String rulesDir = PathUtil.getWindupRulesDir().toString();
        this.executeAnalysis(rulesDir, samplePath);
    }

    @Test
    public void testScanPackage()
    {
        String samplePath = this.getClass().getResource("/sample.jar").getPath();
        String rulesDir = PathUtil.getWindupRulesDir().toString();
        this.executeAnalysis(rulesDir, samplePath);
    }

    protected PackageDiscoveryService.PackageDiscoveryResult executeAnalysis(String rulesDir, String inputPath)
    {
        PackageDiscoveryServiceImpl impl = new PackageDiscoveryServiceImpl();
        impl.webPathUtil = mock(WebPathUtil.class);
        impl.packageNameMappingRegistry = mock(PackageNameMappingRegistry.class);

        when(impl.packageNameMappingRegistry.getOrganizationForPackage(contains("apache")))
                    .thenReturn("Apache");

        PackageDiscoveryService.PackageDiscoveryResult result = impl.execute(rulesDir, inputPath);

        Assert.assertNotNull(result);

        Assert.assertEquals(3, result.getKnownPackages().size());
        Assert.assertEquals(7, result.getUnknownPackages().size());

        Assert.assertTrue(result.getUnknownPackages().containsKey(""));
        Assert.assertEquals(1, result.getUnknownPackages().get("").intValue());
        Assert.assertTrue(result.getUnknownPackages().containsKey("org"));
        Assert.assertEquals(3, result.getUnknownPackages().get("org").intValue());
        Assert.assertTrue(result.getUnknownPackages().containsKey("org.jboss"));
        Assert.assertEquals(2, result.getUnknownPackages().get("org.jboss").intValue());
        Assert.assertTrue(result.getUnknownPackages().containsKey("org.jboss.windup"));
        Assert.assertEquals(2, result.getUnknownPackages().get("org.jboss.windup").intValue());
        Assert.assertTrue(result.getUnknownPackages().containsKey("org.jboss.windup.rules"));
        Assert.assertEquals(1, result.getUnknownPackages().get("org.jboss.windup.rules").intValue());
        Assert.assertTrue(result.getUnknownPackages().containsKey("org.jboss.windup.web"));
        Assert.assertEquals(1, result.getUnknownPackages().get("org.jboss.windup.web").intValue());
        Assert.assertTrue(result.getUnknownPackages().containsKey("org.jboss.windup.web.addons"));
        Assert.assertEquals(1, result.getUnknownPackages().get("org.jboss.windup.web.addons").intValue());

        Assert.assertTrue(result.getKnownPackages().containsKey("org.apache"));
        Assert.assertEquals(1, result.getKnownPackages().get("org.apache").intValue());
        Assert.assertTrue(result.getKnownPackages().containsKey("org.apache.tomcat"));
        Assert.assertEquals(1, result.getKnownPackages().get("org.apache.tomcat").intValue());
        Assert.assertTrue(result.getKnownPackages().containsKey("org.apache.tomcat.maven"));
        Assert.assertEquals(1, result.getKnownPackages().get("org.apache.tomcat.maven").intValue());

        return result;
    }
}
