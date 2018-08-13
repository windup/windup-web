package org.jboss.windup.web.selenium;

import java.awt.AWTException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;

import junit.framework.TestCase;

public class Test extends TestCase {
	private AppLevel selenium;

	public void setUp() throws InterruptedException {
		selenium = new AppLevel();
	}

	public void test() throws InterruptedException, ParseException, AWTException {

		selenium.navigateProject("test 2");
		selenium.clickAnalysisReport(2);
		Thread.sleep(5000);
		selenium.navigateTo(1);
		selenium.clickApplication("AdministracionEfectivo.ear");

		selenium.clickTab("Application Details");
		assertEquals("Application Details", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());

		assertTrue(selenium.treeHierarchy());
		selenium.closeDriver();
	}
}