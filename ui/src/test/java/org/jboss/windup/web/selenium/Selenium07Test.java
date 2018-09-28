package org.jboss.windup.web.selenium;

import java.awt.AWTException;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Selenium07Test extends TestCase {

	private CreateProject selenium;
	
	public void setUp() {
		selenium = new CreateProject();
	}

	public void test() throws AWTException, InterruptedException {
		//Step 1
		assertEquals("http://127.0.0.1:8080/rhamt-web/project-list", selenium.checkURL());
		
		//Step 2-3
		selenium.sortProjectList("Created date", true);
		//Step 4
		assertTrue(selenium.sortApplications());
		assertTrue(selenium.sortNames());
		//Step 5
		assertTrue(selenium.sortLastDate());
		
		//Step 6
		assertTrue(selenium.editProject(3, "test 4"));
		
		//Step 7 
		selenium.updateProject();
		Thread.sleep(4000);
		assertTrue(selenium.checkUpdateProject(3, "test 4"));
		
		//Step 8
		assertTrue(selenium.sortLastDate());
		
		//Step 9
		selenium.projectSearch("2");
		String list = selenium.listProjects().toString();
		assertEquals(list, "[test 2]");
		
		//Step 10
		selenium.clearProjectSearch();
		list = selenium.listProjects().toString();
		System.out.println(list);
		assertEquals("[test, test 2, test 4]", list);
		
		//Step 11
		assertTrue(selenium.deleteProject("test"));
		
		//Step 12
		assertTrue(selenium.cancelDeleteProject());
		
		//Step 13
		assertTrue(selenium.deleteProject("test 4"));
		
		//Step 14
		assertTrue(selenium.clickDeleteProject());
		Thread.sleep(8000);
		list = selenium.listProjects().toString();
		assertEquals("[test, test 2]", list);
		
	}

	@After
	public void tearDown()
	{
		selenium.closeDriver();
	}

}
