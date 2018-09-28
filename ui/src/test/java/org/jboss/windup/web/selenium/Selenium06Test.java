package org.jboss.windup.web.selenium;

import java.awt.AWTException;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import org.junit.After;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.NoSuchElementException;

import junit.framework.TestCase;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Selenium06Test extends TestCase {

    CreateProject seleniumCreate;
    AppLevel seleniumAppLevel;

	public void setUp() {

	}

	public void test() throws AWTException, InterruptedException {
		seleniumCreate = new CreateProject();
		/*
		 * Step 01
		 */
		assertEquals("http://127.0.0.1:8080/rhamt-web/project-list", seleniumCreate.checkURL());
		seleniumCreate.clickProjButton();
		assertEquals("http://127.0.0.1:8080/rhamt-web/wizard/create-project", seleniumCreate.checkURL());

		assertTrue(seleniumCreate.nameInputSelected());
		assertTrue(seleniumCreate.cancelEnabled());
		assertFalse(seleniumCreate.nextEnabled());

		/*
		 * Step 02
		 */
		// checks for next being enabled after entering in 3 characters
		seleniumCreate.inputProjName("abc");
		assertTrue(seleniumCreate.nextEnabled());
		seleniumCreate.clearProjName();
		System.out.println(seleniumCreate.nextEnabled());
		assertFalse(seleniumCreate.nextEnabled());

		// properly inputs the project name & description
		seleniumCreate.inputProjName("test 3");
		assertTrue(seleniumCreate.nextEnabled());
		seleniumCreate.inputProjDesc("for the selenium test");

		// checks that it redirects to the correct page
		seleniumCreate.clickNext();

		Thread.sleep(5000);
		assertTrue(seleniumCreate.checkURL().endsWith("/add-applications"));

		// checks that the upload panel is active & the next button is enabled
		assertEquals("Upload", seleniumCreate.activePanel());
		assertFalse(seleniumCreate.nextEnabled());

		/*
		 * Step 03
		 */
		seleniumCreate.clickChooseFiles();

		seleniumCreate.robotCancel();
		Thread.sleep(5000);
		// checks that the user has been returned to the correct page
		assertTrue(seleniumCreate.checkURL().endsWith("/add-applications"));
		// checks that there are no files pulled up
		assertTrue(seleniumCreate.voidFile());

		/*
		 * Step 04
		 */
		seleniumCreate.clickChooseFiles();
        File file = new File("src/test/resources/test-archives/AdministracionEfectivo.ear");
		seleniumCreate.robotSelectFile(file.getAbsolutePath());
		// checks that the uploaded file is green and has the correct information.
		assertEquals("AdministracionEfectivo.ear (60.161 MB):rgba(63, 156, 53, 1)", seleniumCreate.checkFileInfo(1));

		// uploads AdditionWithSecurity-EAR-0.01.ear
        file = new File("src/test/resources/test-archives/AdditionWithSecurity-EAR-0.01.ear");
		seleniumCreate.robotSelectFile(file.getAbsolutePath());
		// checks that the uploaded file is green and has the correct information.
		assertEquals("AdditionWithSecurity-EAR-0.01.ear (36.11 MB):rgba(63, 156, 53, 1)", seleniumCreate.checkFileInfo(2));

        file = new File("src/test/resources/test-archives/arit-ear-0.8.1-SNAPSHOT.ear");
		seleniumCreate.robotSelectFile(file.getAbsolutePath());
		assertEquals("arit-ear-0.8.1-SNAPSHOT.ear (3.978 MB):rgba(63, 156, 53, 1)", seleniumCreate.checkFileInfo(3));

		seleniumCreate.robotCancel();
		assertTrue(seleniumCreate.nextEnabled());

		/*
		 * Step 05
		 */
		assertTrue(seleniumCreate.nextEnabled());
		seleniumCreate.clickNext();

		assertEquals("Migration to JBoss EAP 7", seleniumCreate.transformationPath());

		//looks through the first level of the include packages 
		assertEquals(
				"1\nantlr\ncom\njavassist\njavax\njunit\nmx\nnet\noracle\norg\nrepackage\nschemaorg_apache_xmlbeans",
				seleniumCreate.findPackages());
		// checks that the three more detailed dialogue are compressed
		assertTrue(seleniumCreate.collapesdInfo());

		//this will go through the packages, to the bottom level and check then uncheck it.
		assertTrue(seleniumCreate.testPackages(1));
		assertFalse(seleniumCreate.testEmptyPackages(1));

		//opens the exclude packages section
		assertTrue(seleniumCreate.isCollapsed("Exclude packages"));
		seleniumCreate.clickCollapsed("Exclude packages");
		assertFalse(seleniumCreate.isCollapsed("Exclude packages"));

		//this will go through the package system under exclude packages
		assertTrue(seleniumCreate.testPackages(2));
		assertFalse(seleniumCreate.testEmptyPackages(2));

		//opens the Advanced options section
		seleniumCreate.clickCollapsed("Advanced options");

		//uner advanced options, this adds a new option
		seleniumCreate.addOptions();
		seleniumCreate.optionsDropdown("enableCompatibleFilesReport");
		seleniumCreate.toggleValue(1);
		seleniumCreate.addOption(1);
		assertTrue(seleniumCreate.value(1));

		//runs the project with the above specifications
		seleniumCreate.saveAndRun();
		assertTrue(seleniumCreate.checkProgressBar());
		assertTrue(seleniumCreate.analysisResultsComplete(1));

	}

	public void testReports() throws InterruptedException, AWTException {
	    seleniumAppLevel = new AppLevel();

		seleniumAppLevel.navigateProject("test 3");
		Thread.sleep(5000);
		seleniumAppLevel.clickAnalysisReport(1);
		seleniumAppLevel.navigateTo(1);
		seleniumAppLevel.clickApplication("AdministracionEfectivo.ear");

		ArrayList<String> list = new ArrayList<>();
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
		list.add("Tattletale");

		ArrayList<String> collectedList = seleniumAppLevel.getTabs();
		Collections.sort(collectedList);
		Collections.sort(list);
		
		assertEquals(list, collectedList);
		assertEquals("AdministracionEfectivo.ear", seleniumAppLevel.pageApp());

		seleniumAppLevel.clickTab("Compatible Files");
		Exception exception = null;
		try {

			assertEquals("AdministracionEfectivo.ear", seleniumAppLevel.pageApp());
		} catch (Exception e) {
			exception = e;
		}
		assertFalse(exception instanceof NoSuchElementException);
		

	}

    @After
    public void tearDown()
    {
        seleniumCreate.closeDriver();
        seleniumAppLevel.closeDriver();
    }



}
