package org.jboss.windup.web.selenium;

import java.awt.AWTException;
import java.util.ArrayList;

import junit.framework.TestCase;

public class Selenium04Test extends TestCase {

	private AnalyzeProject selenium;

	public void setUp() throws InterruptedException {
		selenium = new AnalyzeProject();
	}

	public void testStep01() throws InterruptedException, AWTException {
		assertEquals("Application List", selenium.headerTitle());
		assertEquals("Application List", selenium.pageTitle());

		selenium.switchTab(2);
		assertEquals("All Issues", selenium.pageTitle());

		selenium.switchTab(3);
		assertEquals("Technologies", selenium.pageTitle());

		selenium.switchTab(4);
		assertEquals("Dependencies", selenium.pageTitle());

		selenium.switchTab(5);
		assertEquals("About", selenium.pageTitle());

		selenium.switchTab(1);
		selenium.clickSendFeedback();
		selenium.closeFeedback();
		selenium.closeDriver();
	}

	public void testAppList() throws AWTException {
		assertEquals("Application List", selenium.headerTitle());
		assertEquals("Application List", selenium.pageTitle());

		assertEquals("AdditionWithSecurity-EAR-0.01.ear;AdministracionEfectivo.ear;arit-ear-0.8.1-SNAPSHOT.ear;",
				selenium.listApplications());
		selenium.sortApplicationList("Name", false);
		assertEquals("arit-ear-0.8.1-SNAPSHOT.ear;AdministracionEfectivo.ear;AdditionWithSecurity-EAR-0.01.ear;",
				selenium.listApplications());
		selenium.sortApplicationList("Story Points", false);
		assertEquals("AdministracionEfectivo.ear;arit-ear-0.8.1-SNAPSHOT.ear;AdditionWithSecurity-EAR-0.01.ear;",
				selenium.listApplications());

		selenium.nameFilterAppList("Name", "ad");
		assertEquals("AdministracionEfectivo.ear;AdditionWithSecurity-EAR-0.01.ear;", selenium.listApplications());

		selenium.nameFilterAppList("Tags", "JPA XML 2.0");
		assertEquals("AdministracionEfectivo.ear;", selenium.listApplications());

		selenium.changeRelationship("Matches any filter (OR)");
		assertEquals("AdministracionEfectivo.ear;AdditionWithSecurity-EAR-0.01.ear;", selenium.listApplications());
		selenium.clearFilters();

		selenium.nameFilterAppList("Tags", "JPA XML 2.0");
		assertEquals("AdministracionEfectivo.ear;", selenium.listApplications());

		assertTrue(selenium.deleteFilter("JPA XML 2.0"));
		assertEquals("AdministracionEfectivo.ear;arit-ear-0.8.1-SNAPSHOT.ear;AdditionWithSecurity-EAR-0.01.ear;",
				selenium.listApplications());

		selenium.closeDriver();
	}

	public void testStep02() {
		selenium.switchTab(2);
		assertEquals("All Issues", selenium.pageTitle());
		assertEquals("Migration Optional, Cloud Mandatory, Cloud Optional, ", selenium.allIssuesReport());

		assertTrue(selenium.sortAllIssues());
		assertTrue(selenium.clickFirstIssue());
		selenium.clickShowRule();
		selenium.goBack();
		assertFalse(selenium.showRuleVisible());

		selenium.closeDriver();
	}

	public void testStep03() throws InterruptedException {
		selenium.switchTab(3);
		assertEquals("Technologies", selenium.pageTitle());

		// should be assertTrue but does not work on the page
		assertTrue(selenium.techApps());
		Thread.sleep(1000);
		assertTrue(selenium.clickTechApp());
		// need to add stuff to check that there is stuff on Technologies page

		selenium.goBack();
		assertEquals("Technologies", selenium.pageTitle());

		selenium.closeDriver();
	}

	public void testStep04() throws InterruptedException, AWTException {
		selenium.switchTab(4);
		assertEquals("Dependencies", selenium.pageTitle());

		String hash = selenium.clickMavenCoord();

		Thread.sleep(1000);
		selenium.navigateTo(2);
		selenium.mavenSearch(hash);
		assertTrue(selenium.checkURL().startsWith("http://search.maven.org"));
		selenium.navigateTo(1);

		selenium.closeDriver();
	}

	public void testStep05() {
		selenium.switchTab(5);
		assertEquals("About", selenium.pageTitle());

		ArrayList<String> links = selenium.getAboutLinks();
		ArrayList<String> aboutLinks = new ArrayList<String>();
		aboutLinks.add("https://twitter.com/jbosswindup");
		aboutLinks.add("https://developers.redhat.com/products/rhamt/overview/");
		aboutLinks.add("https://access.redhat.com/documentation/en-us/red_hat_application_migration_toolkit/");
		aboutLinks.add("https://github.com/windup/windup");
		aboutLinks.add("https://github.com/windup/windup/wiki");
		aboutLinks.add("https://developer.jboss.org/en/windup?view=discussions");
		aboutLinks.add("https://lists.jboss.org/mailman/listinfo/windup-dev");
		aboutLinks.add("https://issues.jboss.org/browse/WINDUP");

		assertTrue(links.equals(aboutLinks));
		selenium.closeDriver();
	}

	public void testStep06() throws InterruptedException, AWTException {
		selenium.clickSendFeedback();
		selenium.moveToFeedback();
		selenium.selectFeedbackButton("awesome");
		assertTrue(selenium.checkFeedbackButton("awesome"));
		selenium.selectFeedbackButton("good");
		assertFalse(selenium.checkFeedbackButton("awesome"));
		assertTrue(selenium.checkFeedbackButton("good"));
		Thread.sleep(500);
		selenium.submitFeedback();
		Thread.sleep(500);
		assertTrue(selenium.submitError());

		selenium.populateTextBox();
		selenium.feedbackAttachFile();
		selenium.feedbackPopulateEmail("email");
		selenium.feedbackPopulateName("name");
		assertTrue(selenium.popupRemoved("atlwdg-blanket"));
	}

}
