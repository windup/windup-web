package org.jboss.windup.web.selenium;

import java.awt.AWTException;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Selenium04Test extends TestCase {

	private AnalyzeProject selenium;

	public void setUp() throws InterruptedException {
		selenium = new AnalyzeProject();
	}

	public void testStep01() throws InterruptedException, AWTException {
		/*
		 * Step 1
		 */
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
		/*
		 * Step 2
		 */
		selenium.closeFeedback();
	}

	public void testAppList() throws AWTException {
		assertEquals("Application List", selenium.headerTitle());
		assertEquals("Application List", selenium.pageTitle());

		// Steps 3 - 4
		assertTrue(selenium.applicationSort());

		// Step 5
		selenium.filterAppList("Name", "ad");
		assertEquals("[AdditionWithSecurity-EAR-0.01.ear, AdministracionEfectivo.ear]", selenium.listApplications().toString());

		// Step 6
		selenium.filterAppList("Tag", "JPA XML 2.0");
		assertEquals("[AdministracionEfectivo.ear]", selenium.listApplications().toString());

		// Step 7
		selenium.changeRelationship("Matches any filter (OR)");
		assertEquals("[AdditionWithSecurity-EAR-0.01.ear, AdministracionEfectivo.ear]", selenium.listApplications().toString());
		
		// Step 8
		selenium.clearFilters();
		assertEquals("[AdditionWithSecurity-EAR-0.01.ear, arit-ear-0.8.1-SNAPSHOT.ear, AdministracionEfectivo.ear]",
				selenium.listApplications().toString());

		// Step 9
		selenium.filterAppList("Tag", "JPA XML 2.0");
		assertEquals("[AdministracionEfectivo.ear]", selenium.listApplications().toString());
		
		// Step 10
		assertTrue(selenium.deleteFilter("Tag: ", "JPA XML 2.0"));
		assertEquals("[AdditionWithSecurity-EAR-0.01.ear, arit-ear-0.8.1-SNAPSHOT.ear, AdministracionEfectivo.ear]",
				selenium.listApplications().toString());
	}

	public void testStep02() throws InterruptedException
	{

		selenium.switchTab(2);
		
		// Step 11
		assertEquals("All Issues", selenium.pageTitle());
		String[] elementData = { "Migration Optional", "Cloud Mandatory", "Cloud Optional", "Information"};
		ArrayList<String> issueTypes = new ArrayList<>(Arrays.asList(elementData));
		assertEquals(issueTypes, selenium.allIssuesReport());

		// Step 12
		assertTrue(selenium.sortAllIssues());
	
		// Step 13

		assertTrue(selenium.clickFirstIssue());
		
		// Step 14
		selenium.clickShowRule();
		
		// Step 15
		selenium.goBack();
		assertFalse(selenium.showRuleVisible());
	}

	public void testStep03() throws InterruptedException {
		// Step 16
		selenium.switchTab(3);

		assertEquals("Technologies", selenium.pageTitle());

		// Step 17
		// should be assertTrue but does not work on the page

		ArrayList<Integer> size = selenium.collectColumn(27);
		assertEquals("[37864182, 63083396, 4170837]", size.toString());
		

		ArrayList<Integer> libraries = selenium.collectColumn(28);
		assertEquals("[114, 100, 44]", libraries.toString());
		
		ArrayList<Integer> mandatory = selenium.collectColumn(29);
		assertEquals("[0, 0, 0]", mandatory.toString());
		
		ArrayList<Integer> cloudMandatory = selenium.collectColumn(30);
		assertEquals("[5, 25, 0]", cloudMandatory.toString());
		
		ArrayList<Integer> potential = selenium.collectColumn(31);
		assertEquals("[0, 0, 0]", potential.toString());

		assertTrue(selenium.techApps());
		assertTrue(selenium.sortTechHeader());
		
		assertTrue(selenium.clickTechApp());

		// Step 18
		selenium.goBack();
		assertEquals("Technologies", selenium.pageTitle());
	}

	public void testStep04() throws InterruptedException, AWTException {
		// Step 19

		selenium.switchTab(4);
		assertEquals("Dependencies", selenium.pageTitle());
		
		// Step 20
		String hash = selenium.clickMavenCoord();

		Thread.sleep(1000);

		selenium.navigateTo(2);

		selenium.mavenSearch(hash);

		assertTrue(selenium.checkURL().startsWith("https://search.maven.org"));
		selenium.navigateTo(1);
		selenium.waitForTabLoad();
	}




	public void testStep05() {
		// Step 21
		selenium.switchTab(5);
		assertEquals("About", selenium.pageTitle());

		ArrayList<String> links = selenium.getAboutLinks();
		ArrayList<String> aboutLinks = new ArrayList<>();
		aboutLinks.add("https://twitter.com/jbosswindup");
		aboutLinks.add("https://developers.redhat.com/products/rhamt/overview/");
		aboutLinks.add("https://access.redhat.com/documentation/en-us/red_hat_application_migration_toolkit/");
		aboutLinks.add("https://github.com/windup/windup");
		aboutLinks.add("https://github.com/windup/windup/wiki");
		aboutLinks.add("https://developer.jboss.org/en/windup?view=discussions");
		aboutLinks.add("https://lists.jboss.org/mailman/listinfo/windup-dev");
		aboutLinks.add("https://issues.jboss.org/browse/WINDUP");

		assertTrue(links.equals(aboutLinks));
	}

	public void testStep06() throws InterruptedException, AWTException {
		selenium.switchTab(5);
		assertEquals("About", selenium.pageTitle());
		
		//Step 39
		selenium.clickSendFeedback();
		selenium.moveToFeedback();
		
		//Step 40
		selenium.selectFeedbackButton("awesome");
		assertTrue(selenium.checkFeedbackButton("awesome"));
		
		// Step 41
		selenium.selectFeedbackButton("good");
		assertFalse(selenium.checkFeedbackButton("awesome"));
		assertTrue(selenium.checkFeedbackButton("good"));
		
		// Step 42
		selenium.submitFeedback();
		assertTrue(selenium.submitError());
		
		// Step 43
		selenium.populateTextBox();
		File file = new File("src/test/resources/images/RHAMT-WebUI_Screenshot.png");
		selenium.feedbackAttachFile(file.getAbsolutePath());
		
		// Step 46
		selenium.feedbackPopulateEmail("email");
		selenium.feedbackPopulateName("name");
		assertTrue(selenium.popupRemoved("atlwdg-blanket"));
	}

	@After
	public void tearDown()
	{
		selenium.closeDriver();
	}

}
