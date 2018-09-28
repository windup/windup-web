package org.jboss.windup.web.selenium;

import java.awt.AWTException;
import java.io.File;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

/**
 * Runs the first test from the Web UI Test Script V0.1
 * @author elise
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Selenium01Test extends TestCase {

	private CreateProject selenium;

	public void setUp() {
		selenium = new CreateProject();
	}

	/**
	 * Tests the first and second step
	 */
	public void testStep01_02() {
		/*
		 * Step 01
		 */
		assertEquals("http://127.0.0.1:8080/rhamt-web/project-list", selenium.checkURL());
		
		selenium.clickNewProjButton();
		assertEquals("http://127.0.0.1:8080/rhamt-web/wizard/create-project", selenium.checkURL());
		
		//checks that the project name field has focus, then the cancel/next buttons are enabled/disabled
		//.nameInputSelected does not work
		assertTrue(selenium.nameInputSelected());
		assertTrue(selenium.cancelEnabled());
		assertFalse(selenium.nextEnabled());
		
		/*
		 * step 02
		 */
		// have to click cancel twice to get out of the name input
		selenium.clickCancel();
		selenium.clickCancel();
		
		assertEquals("http://127.0.0.1:8080/rhamt-web/project-list", selenium.checkURL());
	}

	/**
	 * checks the third step
	 */
	public void testStep03_00() {
		assertEquals("http://127.0.0.1:8080/rhamt-web/project-list", selenium.checkURL());
		selenium.clickNewProjButton();
		assertEquals("http://127.0.0.1:8080/rhamt-web/wizard/create-project", selenium.checkURL());

		//checks for next being enabled after entering in 3 characters
		selenium.inputProjName("abc");
		assertTrue(selenium.nextEnabled());
		selenium.clearProjName();
		assertFalse(selenium.nextEnabled());

		//properly inputs the project name & description
		selenium.inputProjName("test");
		assertTrue(selenium.nextEnabled());
		selenium.inputProjDesc("for the selenium test"); 
		
		//checks that it redirects to the correct page
		selenium.clickNext();
		//assertEquals("/add-applications", selenium.checkURL().substring(51));
		
		//checks that the upload panel is active & the next button is enabled
		assertEquals("Upload", selenium.activePanel());
		assertFalse(selenium.nextEnabled());

	}

	/**
	 * checks the 4th through 7th step 
	 * @throws AWTException for the robot
	 */
	public void testStep04_07() throws AWTException {
		testStep03_00();

		/*
		 * Step 04
		 */
		assertFalse(selenium.nextEnabled());
		selenium.clickChooseFiles();
		
		/*
		 * Step 05
		 */
		selenium.robotCancel();
		//checks that the user has been returned to the correct page
		assertTrue(selenium.checkURL().endsWith("/add-applications"));
		//checks that there are no files pulled up
		assertTrue(selenium.voidFile());

		/*
		 * Step 06
		 */
		selenium.clickChooseFiles();
		//AdministracionEfectivo.ear
		File file = new File("src/test/resources/test-archives/AdministracionEfectivo.ear");
		selenium.robotSelectFile(file.getAbsolutePath());
		//checks that the uploaded file is green and has the correct information.
		assertEquals("AdministracionEfectivo.ear (60.161 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(1));

		/*
		 * Step 07
		 */
		// skips the dragging and dropping because I currently do not have a solution for it
		// uploads AdditionWithSecurity-EAR-0.01.ear
		File file2 = new File("src/test/resources/test-archives/AdditionWithSecurity-EAR-0.01.ear");
		selenium.robotSelectFile(file2.getAbsolutePath());
		//checks that the uploaded file is green and has the correct information.
		assertEquals("AdditionWithSecurity-EAR-0.01.ear (36.11 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(2));

		selenium.robotCancel();
	}

	/**
	 * Tests the 8th through 10th steps
	 * @throws AWTException
	 * @throws InterruptedException
	 */
	public void testStep08_10() throws AWTException, InterruptedException {
		testStep04_07();
		
		/*
		 * Step 08
		 */
		selenium.deleteFile(2);
		//lets the pop-up load
		assertEquals(
				"Confirm application deletion;Do you really want to delete application AdditionWithSecurity-EAR-0.01.ear?",
				selenium.popupInfo());
		
		/*
		 * Step 09
		 */
		selenium.deletePopup();
		assertTrue(selenium.popupRemoved("deleteAppDialog"));
		assertEquals("AdministracionEfectivo.ear (60.161 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(1));
		assertEquals("AdditionWithSecurity-EAR-0.01.ear (36.11 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(2));
		//need to check that it goes back to the add applications screen
		//also check that there are no changes to the files
		
		/*
		 * Step 10
		 */
		selenium.deleteFile(2);
		selenium.acceptPopup();
		assertTrue(selenium.popupRemoved("deleteAppDialog"));
		assertEquals("AdministracionEfectivo.ear (60.161 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(1));
		//checks that AdditionWithSecurity-EAR-0.01.ear is deleted
		assertTrue(selenium.checkForEmptyFile(2));

	}

	public void testStep11_12() throws AWTException, InterruptedException {
		testStep08_10();
		
		/*
		 * Step 11
		 */
		selenium.clickNext();

		assertEquals("Migration to JBoss EAP 7", selenium.transformationPath());
		
		//has the user click save and run before letting the packages load
		selenium.saveAndRun();
		//checks that the pop-up has the correct information
		assertEquals(
				"Package identification is not complete;Do you want to save the analysis without selecting packages?",
				selenium.popupInfo());
		selenium.deletePopup();
		assertTrue(selenium.popupRemoved("confirmDialog"));
		//waits a few seconds then checks that the packages are shown
		//need to check that it is all tier 1
		assertEquals("antlr\ncom\njavassist\njavax\nmx\nnet\noracle\norg", selenium.findPackages());
		//checks that the three more detailed dialogue are compressed
		assertTrue(selenium.collapesdInfo());
		
		/*
		 * Step 12
		 */
		selenium.saveAndRun();
		//Waits for the project to load then checks that the progress bar is visible
		assertTrue(selenium.checkProgressBar());

		
		//waits approx 1.3 minutes for the file to fully load, then deletes the project and closes the driver
//		Thread.sleep(100000);
//		selenium.deleteProject("test");

	}

	@After
	public void tearDown()
	{
		selenium.closeDriver();
	}


}
