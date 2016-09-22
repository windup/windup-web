package org.jboss.windup.web.services.rest;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.*;
import java.lang.reflect.Type;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

import org.apache.commons.io.IOUtils;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.arquillian.warp.WarpTest;
import org.jboss.arquillian.warp.impl.client.transformation.MigratedInspection;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInputImpl;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.AbstractTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.MultivaluedMap;

import static org.mockito.Mockito.*;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class RegisteredApplicationEndpointTest extends AbstractTest
{

    @ArquillianResource
    private URL contextPath;

    private RegisteredApplicationEndpoint registeredApplicationEndpoint;
    private DataProvider dataProvider;


    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        ResteasyClient client = getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + "rest");
        this.dataProvider = new DataProvider(target);

        this.registeredApplicationEndpoint = target.proxy(RegisteredApplicationEndpoint.class);
    }

    /*
     * Preconditions: We have a user, project and application group.
     */
    @Test
    @RunAsClient
    public void testRegisterApp() throws Exception
    {
        Collection<RegisteredApplication> existingApps = registeredApplicationEndpoint.getRegisteredApplications();
        Assert.assertEquals(0, existingApps.size());

        String fileContent = "upload test";

        MultipartFormDataInput form  = this.mockMultipartFormData(
                "a.txt",
                new ByteArrayInputStream(fileContent.getBytes(StandardCharsets.UTF_8))
        );

        MigrationProject dummyProject = this.dataProvider.getMigrationProject();
        ApplicationGroup group = this.dataProvider.getApplicationGroup(dummyProject);

        RegisteredApplication app = this.registeredApplicationEndpoint.registerApplication(form, group.getId());

        Collection<RegisteredApplication> apps = registeredApplicationEndpoint.getRegisteredApplications();
        Assert.assertEquals(1, apps.size());

        File file = new File(app.getInputPath());
        String readContent = IOUtils.toString(new FileInputStream(file), StandardCharsets.UTF_8);

        Assert.assertTrue(file.exists());
        Assert.assertEquals(fileContent, readContent);
    }

    private MultipartFormDataInput mockMultipartFormData(String fileName, InputStream stream) throws IOException {
        MultipartFormDataInput form = mock(MultipartFormDataInput.class);
        InputPart part =  mock(InputPart.class);

        Map<String, List<InputPart>> paramsMap = new HashMap<>();
        paramsMap.put("file", Arrays.asList(part));

        when(form.getFormDataMap()).thenReturn(paramsMap);

        MultivaluedMap<String, String> headers = new MultivaluedHashMap<>();
        headers.putSingle("Content-Disposition", "form-data; name=\"file\"; filename=\"" + fileName + "\"");

        when(part.getHeaders()).thenReturn(headers);
        when(part.getBody(InputStream.class, null)).thenReturn(stream);

        return form;
    }
}
