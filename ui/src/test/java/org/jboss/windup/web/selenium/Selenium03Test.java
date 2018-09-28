package org.jboss.windup.web.selenium;

import java.text.ParseException;
import java.util.ArrayList;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Selenium03Test extends TestCase {

	private EditProject selenium;

	public void setUp() {
		selenium = new EditProject();
	}

	public void testStep01_05() throws ParseException {
		
		assertTrue(selenium.navigateProject("test 2"));
		selenium.waitForProjectLoad("test 2");
		assertTrue(selenium.checkURL().endsWith("/project-detail"));
		
		/*
		 * Step 1 
		 */
		selenium.clickProjectsIcon();
		assertEquals("http://127.0.0.1:8080/rhamt-web/project-list", selenium.checkURL());

		/*
		 * Step 2
		 */
		assertTrue(selenium.navigateProject("test 2"));
		selenium.waitForProjectLoad("test 2");
		assertTrue(selenium.checkURL().endsWith("/project-detail"));

		//asserts the project name test 2 is indeed in the dropdown
		assertEquals("Project\ntest 2", selenium.dropDownInfo());
		//will return what active panel is there
		assertEquals("Analysis Results", selenium.activePage());
		assertEquals(2, selenium.analysisResultsShown());

		/*
		 * Step 3
		 */
		assertTrue(selenium.sortString(1, "Analysis"));
		assertTrue(selenium.sortStatus());
		assertTrue(selenium.sortDate(3, "Start Date"));
		assertTrue(selenium.sortString(4, "Applications"));

		/*
		 * Step 4
		 */
		ArrayList<String> list = selenium.collectTableCol(1);
		String analysis = list.get(0).toString();
		
		selenium.search(analysis.substring(1));
		assertEquals("[" + analysis + "]", selenium.collectTableCol(1).toString());
		
		/*
		 * Step 5
		 */
		selenium.cancelSearch();
	}

	public void testStep06_12() throws ParseException {
		assertTrue(selenium.navigateProject("test 2"));
		
		/*
		 * Step 6
		 */
		selenium.clickApplications();
		assertTrue(selenium.checkURL().endsWith("/applications"));

		assertEquals("Applications", selenium.activePage());

		/*
		 * Step 7
		 */
		assertTrue(selenium.sortString(1, "Application"));
		assertTrue(selenium.sortDate(2, "Date Added"));
		
		ArrayList<String> table = new ArrayList<>();
		table.add("arit-ear-0.8.1-SNAPSHOT.ear");
		table.add("AdditionWithSecurity-EAR-0.01.ear");
		table.add("AdministracionEfectivo.ear");
		
		assertEquals(table, selenium.collectTableCol(1));

		/*
		 * Step 8
		 */
		selenium.deleteApplication("arit-ear-0.8.1-SNAPSHOT.ear");
		assertEquals(
				"Confirm Application Deletion;Are you sure you want to delete 'arit-ear-0.8.1-SNAPSHOT.ear'?",
				selenium.popupInfo());
		
		/*
		 * Step 9
		 */
		selenium.deletePopup();
		assertTrue(selenium.popupRemoved("deleteAppDialog"));
		
		assertEquals(table, selenium.collectTableCol(1));
		
		/*
		 * Step 10
		 */
//		selenium.deleteApplication("arit-ear-0.8.1-SNAPSHOT.ear");
//		selenium.acceptPopup();
//		assertTrue(selenium.popupRemoved("deleteAppDialog"));
//		table.remove(0);
//		assertEquals(table, selenium.collectTableCol(1));
//		selenium.collectTableCol(1).toString());

		/*
		 * Step 11
		 */
		selenium.search("Admin");
		assertEquals("[AdministracionEfectivo.ear]", selenium.collectTableCol(1).toString());
		
		/*
		 * Step 12
		 */
		selenium.cancelSearch();
	}

	public void testStep13_19() throws InterruptedException {
		assertTrue(selenium.navigateProject("test 2"));
		
		/*
		 * Step 13
		 */
		selenium.clickAnalysisConfiguration();

		/* 
		 * Step 14
		 */
		selenium.clickProjDropDown("test");
		assertEquals("Project\ntest", selenium.dropDownInfo());
		// find way to check that the project page is indeed changed
		
		/*
		 * Step 15
		 */
		selenium.clickProjDropDown("test 2");
		assertEquals("Project\ntest 2", selenium.dropDownInfo());
		
		/*
		 * Step 16
		 */
		selenium.deleteAnalysisResults(2);
		String num = selenium.analysisName(2);
		assertEquals("Confirm Analysis Deletion;Are you sure you want to delete analysis " + num + "?", selenium.popupInfo());
		
		/*
		 * Step 17
		 */
		selenium.deletePopup();
		assertTrue(selenium.popupRemoved("deleteAppDialog"));
		
		/*
		 * Step 18
		 */
		// would be a pain to re-do
		// selenium.deleteAnalysisResults(2);
		// selenium.acceptPopup();
		// assertTrue(selenium.popupRemoved("deleteAppDialog"));
		
		/*
		 * Step 19
		 */
		String url = selenium.clickAnalysisReport(1);
		selenium.navigateTo(1);
	}

	@After
	public void tearDown()
	{
		selenium.closeDriver();
	}
}
