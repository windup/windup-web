package org.jboss.windup.web.selenium;

import java.awt.AWTException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;

import org.openqa.selenium.NoSuchElementException;

import junit.framework.TestCase;

public class Selenium06Test extends TestCase {

	public void setUp() {
	}

	public void test() throws AWTException, InterruptedException {
		CreateProject selenium = new CreateProject();
		/*
		 * Step 01
		 */
		assertEquals("http://127.0.0.1:8080/rhamt-web/project-list", selenium.checkURL());
		selenium.clickProjButton();
		assertEquals("http://127.0.0.1:8080/rhamt-web/wizard/create-project", selenium.checkURL());

		assertTrue(selenium.nameInputSelected());
		assertTrue(selenium.cancelEnabled());
		assertFalse(selenium.nextEnabled());

		/*
		 * Step 02
		 */
		// checks for next being enabled after entering in 3 characters
		selenium.inputProjName("abc");
		assertTrue(selenium.nextEnabled());
		selenium.clearProjName();
		System.out.println(selenium.nextEnabled());
		assertFalse(selenium.nextEnabled());

		// properly inputs the project name & description
		selenium.inputProjName("test 3");
		assertTrue(selenium.nextEnabled());
		selenium.inputProjDesc("for the selenium test");

		// checks that it redirects to the correct page
		selenium.clickNext();

		Thread.sleep(5000);
		assertTrue(selenium.checkURL().endsWith("/add-applications"));

		// checks that the upload panel is active & the next button is enabled
		assertEquals("Upload", selenium.activePanel());
		assertFalse(selenium.nextEnabled());

		/*
		 * Step 03
		 */
		selenium.clickChooseFiles();

		selenium.robotCancel();
		Thread.sleep(5000);
		// checks that the user has been returned to the correct page
		assertTrue(selenium.checkURL().endsWith("/add-applications"));
		// checks that there are no files pulled up
		assertTrue(selenium.voidFile());

		/*
		 * Step 04
		 */
		selenium.clickChooseFiles();
		// AdministracionEfectivo.ear
		String s = "/home/mbrophy/Sample_Files/06__all_apps/01/AdministracionEfectivo.ear";
		selenium.robotSelectFile(s);
		// checks that the uploaded file is green and has the correct information.
		assertEquals("AdministracionEfectivo.ear (60.161 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(1));

		// uploads AdditionWithSecurity-EAR-0.01.ear
		String a = "/home/mbrophy/Sample_Files/06__all_apps/01/AdditionWithSecurity-EAR-0.01.ear";
		selenium.robotSelectFile(a);
		// checks that the uploaded file is green and has the correct information.
		assertEquals("AdditionWithSecurity-EAR-0.01.ear (36.11 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(2));

		String b = "/home/mbrophy/Sample_Files/06__all_apps/01/arit-ear-0.8.1-SNAPSHOT.ear";
		selenium.robotSelectFile(b);
		assertEquals("arit-ear-0.8.1-SNAPSHOT.ear (3.978 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(3));

		selenium.robotCancel();
		assertTrue(selenium.nextEnabled());

		/*
		 * Step 05
		 */
		assertTrue(selenium.nextEnabled());
		selenium.clickNext();

		assertEquals("Migration to JBoss EAP 7", selenium.transformationPath());

		//looks through the first level of the include packages 
		assertEquals(
				"1\nantlr\ncom\njavassist\njavax\njunit\nmx\nnet\noracle\norg\nrepackage\nschemaorg_apache_xmlbeans",
				selenium.findPackages());
		// checks that the three more detailed dialogue are compressed
		assertTrue(selenium.collapesdInfo());

		//this will go through the packages, to the bottom level and check then uncheck it.
		assertTrue(selenium.testPackages(1));
		assertFalse(selenium.testEmptyPackages(1));

		//opens the exclude packages section
		assertTrue(selenium.isCollapsed("Exclude packages"));
		selenium.clickCollapsed("Exclude packages");
		assertFalse(selenium.isCollapsed("Exclude packages"));

		//this will go through the package system under exclude packages
		assertTrue(selenium.testPackages(2));
		assertFalse(selenium.testEmptyPackages(2));

		//opens the Advanced options section
		selenium.clickCollapsed("Advanced options");

		//uner advanced options, this adds a new option
		selenium.addOptions();
		selenium.optionsDropdown("enableCompatibleFilesReport");
		selenium.toggleValue(1);
		selenium.addOption(1);
		assertTrue(selenium.value(1));

		//runs the project with the above specifications
		selenium.saveAndRun();
		assertTrue(selenium.checkProgressBar());
		assertTrue(selenium.analysisResultsComplete(1));
		
		selenium.closeDriver();

	}

	public void testReports() throws InterruptedException, AWTException {
		AppLevel selenium = new AppLevel();

		selenium.navigateProject("test 3");
		Thread.sleep(5000);
		selenium.clickAnalysisReport(1);
		selenium.navigateTo(1);
		selenium.clickApplication("AdministracionEfectivo.ear");

		ArrayList<String> list = new ArrayList<String>();
		list.add("All Applications");
		list.add("Dashboard");
		list.add("Issues");
		list.add("Application Details");
		list.add("Technologies");
		list.add("Unparsable");
		list.add("Dependencies");
		list.add("Compatible Files");
		list.add("EJBs");
		list.add("JPA");
		list.add("Server Resources");
		list.add("Hard-coded IP Addresses");
		list.add("Ignored Files");
		list.add("About");
		list.add("Send Feedback");

		ArrayList<String> collectedList = selenium.getTabs();
		Collections.sort(collectedList);
		Collections.sort(list);
		
		assertEquals(list, collectedList);
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());

		selenium.clickTab("Compatible Files");
		Exception exception = null;
		try {

			assertEquals("AdministracionEfectivo.ear", selenium.pageApp());
		} catch (Exception e) {
			exception = e;
		}
		assertFalse(exception instanceof NoSuchElementException);
		
		selenium.closeDriver();
	}

}
