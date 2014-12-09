package org.jboss.forge.rest;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jboss.forge.addon.ui.command.CommandFactory;
import org.jboss.forge.addon.ui.command.UICommand;
import org.jboss.forge.addon.ui.controller.CommandController;
import org.jboss.forge.addon.ui.controller.CommandControllerFactory;
import org.jboss.forge.addon.ui.controller.WizardCommandController;
import org.jboss.forge.addon.ui.input.InputComponent;
import org.jboss.forge.addon.ui.metadata.UICommandMetadata;
import org.jboss.forge.addon.ui.result.Failed;
import org.jboss.forge.addon.ui.result.Result;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.rest.dto.ExecutionRequest;
import org.jboss.forge.rest.ui.InputRequiredException;
import org.jboss.forge.rest.ui.RestUIContext;
import org.jboss.forge.rest.ui.RestUIRuntime;

@Path("/forge")
@Stateless
public class ForgeRESTService
{

   @Inject
   private Furnace furnace;

   @Inject
   private CommandControllerFactory commandControllerFactory;

   @Inject
   private CommandFactory commandFactory;

   @GET
   public String getInfo()
   {
      return furnace.getVersion().toString();
   }

   @GET
   @Path("/commands")
   @Produces(MediaType.APPLICATION_JSON)
   public JsonArray getCommands()
   {
      try (RestUIContext context = new RestUIContext())
      {
         JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
         for (String commandName : commandFactory.getCommandNames(context))
         {
            arrayBuilder.add(commandName);
         }
         return arrayBuilder.build();
      }
   }

   @GET
   @Path("/command/{name}")
   @Produces(MediaType.APPLICATION_JSON)
   public Response getCommandInfo(@PathParam("name") String name)
   {
      JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
      try (RestUIContext context = new RestUIContext())
      {
         UICommand command = commandFactory.getCommandByName(context, name);
         if (command == null)
            return Response.status(Status.NOT_FOUND).build();
         UICommandMetadata metadata = command.getMetadata(context);

         objectBuilder.add("name", name);
         objectBuilder.add("description", metadata.getDescription());
         if (metadata.getCategory() != null)
            objectBuilder
                     .add("category", metadata.getCategory().toString());
         if (metadata.getDocLocation() != null)
            objectBuilder.add("docLocation", metadata.getDocLocation()
                     .toString());
      }
      return Response.ok(objectBuilder.build()).build();
   }

   @POST
   @Path("/command/{name}")
   @Consumes(MediaType.APPLICATION_JSON)
   @Produces(MediaType.APPLICATION_JSON)
   public Response executeCommand(@PathParam("name") String name, ExecutionRequest executionRequest)
   {
      try (RestUIContext context = new RestUIContext())
      {
         UICommand command = commandFactory.getCommandByName(context, name);
         if (command == null)
            return Response.status(Status.NOT_FOUND).build();
         CommandController controller = commandControllerFactory.createController(context, new RestUIRuntime(),
                  command);
         Map<String, String> requestedInputs = executionRequest.getInputs();
         try
         {
            if (controller instanceof WizardCommandController)
            {

            }
            else
            {
               Map<String, InputComponent<?, ?>> inputs = controller.getInputs();
               Set<String> inputKeys = new HashSet<String>(inputs.keySet());
               inputKeys.retainAll(requestedInputs.keySet());
               for (String key : inputKeys)
               {
                  controller.setValueFor(key, requestedInputs.get(key));
               }
               // Result result = controller.execute();
               // Failed
            }

         }
         catch (InputRequiredException ire)
         {

         }
      }
      return Response.ok().build();
   }

}
