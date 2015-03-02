/**
 * Copyright 2014 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Eclipse Public License version 1.0, available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

package org.jboss.windup.rest.dto;

import java.util.List;
import java.util.Map;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 
 * @author <a href="ggastald@redhat.com">George Gastaldi</a>
 */
@XmlRootElement
public class ExecutionRequest
{
   @XmlElement
   private String resource;

   @XmlElementWrapper
   private Map<String, String> inputs;

   @XmlElementWrapper
   private List<String> promptQueue;

   /**
    * @return the inputs
    */
   public Map<String, String> getInputs()
   {
      return inputs;
   }

   /**
    * @param inputs the inputs to set
    */
   public void setInputs(Map<String, String> inputs)
   {
      this.inputs = inputs;
   }

   /**
    * @return the resource
    */
   public String getResource()
   {
      return resource;
   }

   /**
    * @param resource the resource to set
    */
   public void setResource(String resource)
   {
      this.resource = resource;
   }
}
