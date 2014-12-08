package org.jboss.forge.rest.ui;

import org.jboss.forge.addon.ui.UIProvider;
import org.jboss.forge.addon.ui.context.AbstractUIContext;
import org.jboss.forge.addon.ui.context.UISelection;
import org.jboss.forge.addon.ui.util.Selections;

public class RestUIContext extends AbstractUIContext {

	private RestUIProvider provider = new RestUIProvider();

	@Override
	public <SELECTIONTYPE> UISelection<SELECTIONTYPE> getInitialSelection() {
		return Selections.emptySelection();
	}

	@Override
	public UIProvider getProvider() {
		return provider;
	}

}
