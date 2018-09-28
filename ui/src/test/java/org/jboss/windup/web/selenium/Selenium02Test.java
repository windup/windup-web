package org.jboss.windup.web.selenium;

import java.awt.AWTException;
import java.io.File;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Selenium02Test extends TestCase {

	private CreateProject selenium;

	public void setUp() {
		selenium = new CreateProject();
	}

	public void testStep01_02() {

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
		assertFalse(selenium.nextEnabled());

		// properly inputs the project name & description
		selenium.inputProjName("test 2");
		assertTrue(selenium.nextEnabled());
		selenium.inputProjDesc("for the selenium test");


		selenium.clickNext();
		// checks that the upload panel is active & the next button is enabled
		assertEquals("Upload", selenium.activePanel());
		// checks that it redirects to the correct page
		assertTrue(selenium.checkURL().endsWith("/add-applications"));

		assertFalse(selenium.nextEnabled());
	}

	public void testStep03_05() throws AWTException, InterruptedException {
		testStep01_02();

		/*
		 * Step 03
		 */
		selenium.clickChooseFiles();

		selenium.robotCancel();
		// checks that the user has been returned to the correct page
		assertTrue(selenium.checkURL().endsWith("/add-applications"));
		// checks that there are no files pulled up
		assertTrue(selenium.voidFile());

		/*
		 * Step 04
		 */
		selenium.clickChooseFiles();
		// AdministracionEfectivo.ear
        File file = new File("src/test/resources/test-archives/AdministracionEfectivo.ear");
		selenium.robotSelectFile(file.getAbsolutePath());
		// checks that the uploaded file is green and has the correct information.
		assertEquals("AdministracionEfectivo.ear (60.161 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(1));

		// uploads AdditionWithSecurity-EAR-0.01.ear
        file = new File("src/test/resources/test-archives/AdditionWithSecurity-EAR-0.01.ear");
		selenium.robotSelectFile(file.getAbsolutePath());
		// checks that the uploaded file is green and has the correct information.
		assertEquals("AdditionWithSecurity-EAR-0.01.ear (36.11 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(2));

        file = new File("src/test/resources/test-archives/arit-ear-0.8.1-SNAPSHOT.ear");
		selenium.robotSelectFile(file.getAbsolutePath());
		assertEquals("arit-ear-0.8.1-SNAPSHOT.ear (3.978 MB):rgba(63, 156, 53, 1)", selenium.checkFileInfo(3));

		selenium.robotCancel();
		assertTrue(selenium.nextEnabled());
		
		/*
		 * Step 05 
		 */
		assertTrue(selenium.nextEnabled());
		selenium.clickNext();

		assertEquals("Migration to JBoss EAP 7", selenium.transformationPath());

		assertEquals(
				"1\nantlr\ncom\njavassist\njavax\njunit\nmx\nnet\noracle\norg\nrepackage\nschemaorg_apache_xmlbeans",
				selenium.findPackages());
		// checks that the three more detailed dialogue are compressed
		assertTrue(selenium.collapesdInfo());
	}

	public void testStep06_08() throws AWTException, InterruptedException {
		testStep03_05();

		/*
		 * Step 06
		 */
		selenium.chooseTransformationPath(3);
		assertEquals("Cloud readiness only", selenium.transformationPath());
		
		selenium.saveAndRun();
		assertTrue(selenium.checkProgressBar());
		
		/*
		 * Step 07
		 */
		selenium.clickAnalysisConfiguration();
		
		assertEquals("Cloud readiness only", selenium.transformationPath());

		assertEquals("AdditionWithSecurity-EAR-0.01.ear\n" + 
				"AdministracionEfectivo.ear\n" + 
				"arit-ear-0.8.1-SNAPSHOT.ear", selenium.printSelectedApplications());
		
		assertTrue(selenium.collapesdInfo());
		assertEquals(
				"1\nantlr\ncom\njavassist\njavax\njunit\nmx\nnet\noracle\norg\nrepackage\nschemaorg_apache_xmlbeans",
				selenium.findPackages());
		
		/*
		 * Step 08
		 */
		selenium.deleteSelectedApplication(3);
		assertEquals("AdditionWithSecurity-EAR-0.01.ear\n" + 
				"AdministracionEfectivo.ear", selenium.printSelectedApplications());
		
		selenium.saveAndRun();
		assertTrue(selenium.checkProgressBar());
		
		assertTrue(selenium.analysisResultsComplete(2));
	}

	@After
	public void tearDown()
	{
		selenium.closeDriver();
	}

}
