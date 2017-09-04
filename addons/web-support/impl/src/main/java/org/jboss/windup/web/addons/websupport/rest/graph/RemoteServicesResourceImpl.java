package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.rules.apps.java.model.JavaClassModel;
import org.jboss.windup.rules.apps.javaee.model.EjbRemoteServiceModel;
import org.jboss.windup.rules.apps.javaee.model.JaxRPCWebServiceModel;
import org.jboss.windup.rules.apps.javaee.model.JaxRSWebServiceModel;
import org.jboss.windup.rules.apps.javaee.model.JaxWSWebServiceModel;
import org.jboss.windup.rules.apps.javaee.model.RMIServiceModel;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class RemoteServicesResourceImpl extends AbstractGraphResource implements RemoteServicesResource
{
    @Override
    public Object getEjbRemoteService(Long executionID, Map<String, Object> filterAsMap)
    {
        return this.getGraphData(executionID, filterAsMap, EjbRemoteServiceModel.class, new ArrayList<>(Arrays.asList(
                EjbRemoteServiceModel.EJB_INTERFACE,
                EjbRemoteServiceModel.EJB_IMPLEMENTATION_CLASS,
                JavaClassModel.DECOMPILED_SOURCE
        )));
    }

    @Override
    public Object getJaxRpcWebServices(Long executionID, Map<String, Object> filterAsMap)
    {
        return this.getGraphData(executionID, filterAsMap, JaxRPCWebServiceModel.class, new ArrayList<>(Arrays.asList(
                JaxRPCWebServiceModel.JAXRPC_INTERFACE,
                JaxRPCWebServiceModel.JAXRPC_IMPLEMENTATION_CLASS,
                JavaClassModel.DECOMPILED_SOURCE
        )));
    }

    @Override
    public Object getJaxRsWebServices(Long executionID, Map<String, Object> filterAsMap)
    {
        return this.getGraphData(executionID, filterAsMap, JaxRSWebServiceModel.class, new ArrayList<>(Arrays.asList(
                JaxRSWebServiceModel.JAXRS_INTERFACE,
                JaxRSWebServiceModel.JAXRS_IMPLEMENTATION_CLASS,
                JavaClassModel.DECOMPILED_SOURCE
        )));
    }

    @Override
    public Object getJaxWsWebServices(Long executionID, Map<String, Object> filterAsMap)
    {
        return this.getGraphData(executionID, filterAsMap, JaxWSWebServiceModel.class, new ArrayList<>(Arrays.asList(
                JaxWSWebServiceModel.JAXWS_INTERFACE,
                JaxWSWebServiceModel.JAXWS_IMPLEMENTATION_CLASS,
                JavaClassModel.DECOMPILED_SOURCE
        )));
    }

    @Override
    public Object getRmiServices(Long executionID, Map<String, Object> filterAsMap)
    {
        return this.getGraphData(executionID, filterAsMap, RMIServiceModel.class, new ArrayList<>(Arrays.asList(
                RMIServiceModel.RMI_INTERFACE,
                RMIServiceModel.RMI_IMPLEMENTATION_CLASS,
                JavaClassModel.DECOMPILED_SOURCE
        )));
    }
}
