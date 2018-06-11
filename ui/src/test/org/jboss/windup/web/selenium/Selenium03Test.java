package org.jboss.windup.web.selenium;

import junit.framework.TestCase;

public class Selenium03Test extends TestCase{

	private EditProject selenium;
	
	public void setUp() {
		selenium = new EditProject();
	} 
	
	public void testStep01_05() {
		//add in some asserts to URLs 
		assertTrue(selenium.navigateProject("test 2"));
		assertTrue(selenium.checkURL().endsWith("/project-detail"));
		
		selenium.clickProjectsIcon();
		assertEquals("http://127.0.0.1:8080/rhamt-web/project-list", selenium.checkURL());
		
		assertTrue(selenium.navigateProject("test 2"));
		assertTrue(selenium.checkURL().endsWith("/project-detail"));
		
		assertEquals("Project\ntest 2", selenium.dropDownInfo());
		assertEquals(2, selenium.analysisResultsShown());

		assertEquals("#71, #70, ", selenium.analysisResultsOrder());
		
		selenium.analysisResultsSort("Applications");
		assertEquals("#70, #71, ", selenium.analysisResultsOrder());
		selenium.analysisResultsSort("Applications");
		assertEquals("#71, #70, ", selenium.analysisResultsOrder());

		selenium.analysisResultsSort("Start Date");
		assertEquals("#70, #71, ", selenium.analysisResultsOrder());
		selenium.analysisResultsSort("Start Date");
		assertEquals("#71, #70, ", selenium.analysisResultsOrder());

		//since both are completed the status does not change
		selenium.analysisResultsSort("Status");
		assertEquals("#70, #71, ", selenium.analysisResultsOrder());
		selenium.analysisResultsSort("Status");
		assertEquals("#70, #71, ", selenium.analysisResultsOrder());

		selenium.analysisResultsSort("Analysis");
		assertEquals("#70, #71, ", selenium.analysisResultsOrder());
		selenium.analysisResultsSort("Analysis");
		assertEquals("#71, #70, ", selenium.analysisResultsOrder());
		
		selenium.search("1");
		assertEquals("#71, ", selenium.analysisResultsOrder());
		selenium.cancelSearch();
		assertEquals("#71, #70, ", selenium.analysisResultsOrder());
		
		selenium.closeDriver();
		
	}
	
	public void testStep06_12() {
		assertTrue(selenium.navigateProject("test 2"));
		selenium.clickApplications();
		assertTrue(selenium.checkURL().endsWith("/applications"));
		
		assertEquals("arit-ear-0.8.1-SNAPSHOT.ear, AdministracionEfectivo.ear, AdditionWithSecurity-EAR-0.01.ear, ", selenium.applicationsOrder());
		selenium.applicationsSort("Application");
		assertEquals("AdditionWithSecurity-EAR-0.01.ear, AdministracionEfectivo.ear, arit-ear-0.8.1-SNAPSHOT.ear, ", selenium.applicationsOrder());

		selenium.applicationsSort("Application");
		assertEquals("arit-ear-0.8.1-SNAPSHOT.ear, AdministracionEfectivo.ear, AdditionWithSecurity-EAR-0.01.ear, ", selenium.applicationsOrder());
		
		selenium.applicationsSort("Date Added");
		assertEquals("arit-ear-0.8.1-SNAPSHOT.ear, AdditionWithSecurity-EAR-0.01.ear, AdministracionEfectivo.ear, ", selenium.applicationsOrder());
		selenium.applicationsSort("Date Added");
		assertEquals("AdministracionEfectivo.ear, AdditionWithSecurity-EAR-0.01.ear, arit-ear-0.8.1-SNAPSHOT.ear, ", selenium.applicationsOrder());
		
		selenium.deleteApplication(3);
		selenium.deletePopup();
		assertTrue(selenium.popupRemoved("deleteAppDialog"));
		assertEquals("AdministracionEfectivo.ear, AdditionWithSecurity-EAR-0.01.ear, arit-ear-0.8.1-SNAPSHOT.ear, ", selenium.applicationsOrder());
		
		selenium.deleteApplication(3);
		selenium.acceptPopup();
		assertTrue(selenium.popupRemoved("deleteAppDialog"));
		assertEquals("AdministracionEfectivo.ear, AdditionWithSecurity-EAR-0.01.ear, ", selenium.applicationsOrder());
		
		selenium.search("Admin");
		assertEquals("AdministracionEfectivo.ear, ", selenium.applicationsOrder());
		selenium.cancelSearch();
		assertEquals("AdministracionEfectivo.ear, AdditionWithSecurity-EAR-0.01.ear, ", selenium.applicationsOrder());
		
		selenium.closeDriver();
	}
	
	public void testStep13_19() throws InterruptedException {
		assertTrue(selenium.navigateProject("test 2"));
		selenium.clickAnalysisConfiguration();
		assertEquals("AdditionWithSecurity-EAR-0.01.ear\n" + 
				"AdministracionEfectivo.ear", selenium.printSelectedApplications());
		
		selenium.clickProjDropDown("test");
		selenium.analysisResultsComplete(1);
		//find way to check that the project page is indeed changed
		selenium.clickProjDropDown("test 2");
		System.out.println("moved to test 2");
		selenium.analysisResultsComplete(2);
		selenium.deleteAnalysisResults(2);
		Thread.sleep(250);
		selenium.deletePopup();
		Thread.sleep(250);
//		assertTrue(selenium.popupRemoved("deleteAppDialog"));
		System.out.println("deleted popup");
//		would be a pain to re-do
//		selenium.deleteAnalysisResults(2);
//		selenium.acceptPopup();
//		
		String url = selenium.clickAnalysisReport(1);
		Thread.sleep(10000);
		selenium.navigateTo(url);
		assertEquals("Application List", selenium.headerTitle());
		
	}
}
