package org.jboss.forge.rest.ui;

import org.jboss.forge.addon.resource.Resource;
import org.jboss.forge.addon.ui.UIProvider;
import org.jboss.forge.addon.ui.context.AbstractUIContext;
import org.jboss.forge.addon.ui.context.UISelection;
import org.jboss.forge.addon.ui.util.Selections;

public class RestUIContext extends AbstractUIContext
{
   private final Resource<?> selection;
   private final RestUIProvider provider = new RestUIProvider();

   public RestUIContext()
   {
      this.selection = null;
   }

   public RestUIContext(Resource<?> selection)
   {
      super();
      this.selection = selection;
   }

   @SuppressWarnings("unchecked")
   @Override
   public <SELECTIONTYPE> UISelection<SELECTIONTYPE> getInitialSelection()
   {
      return (UISelection<SELECTIONTYPE>) Selections.from(selection);
   }

   @Override
   public UIProvider getProvider()
   {
      return provider;
   }

}
