package org.jboss.windup.web.selenium;

import java.awt.AWTException;
import java.util.ArrayList;
import java.util.Collections;

import junit.framework.TestCase;
import org.junit.After;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Selenium05Test extends TestCase {

	private AppLevel selenium;

	public void setUp() throws InterruptedException {
		selenium = new AppLevel();

		selenium.navigateProject("test 2");
		selenium.waitForProjectLoad();
		selenium.clickAnalysisReport(2);
		Thread.sleep(5000);
		selenium.navigateTo(1);
		selenium.clickApplication("AdministracionEfectivo.ear");
	}

	public void test01() throws InterruptedException, AWTException {
		//Step 1
		ArrayList<String> list = new ArrayList<>();
		list.add("All Applications");
		list.add("Dashboard");
		list.add("Issues");
		list.add("Application Details");
		list.add("Technologies");
		list.add("Unparsable");
		list.add("Dependencies");
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

		//Step 2
		selenium.clickTab("Issues");
		assertEquals("Issues", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());
		
		//Step 3
		// this also checks the yellow text box is there with its description and links
		assertTrue(selenium.clickFirstIssue());

		//Step 4
		selenium.clickShowRule();
		assertEquals("Rule Providers Execution Overview", selenium.pageTitle());
		
		//Step 5
		selenium.goBack();
		assertFalse(selenium.showRuleVisible());
		assertEquals("Issues", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());

		//Step 6
		selenium.clickTab("Application Details");
		assertEquals("Application Details", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());

		assertTrue(selenium.treeHierarchy());
		System.out.println("looking for story points");
		assertTrue(selenium.findStoryPoints());
		assertTrue(selenium.treeCollapsed());
		
		//Step 7
		selenium.treeShowAll();
		assertFalse(selenium.treeCollapsed());
		
		//Step 8
		selenium.treeShowLess();
		assertTrue(selenium.treeCollapsed());
		
		//Step 11
		selenium.clickTab("Technologies");
		assertEquals("Technologies", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());

		//Step 14
		selenium.clickTab("Unparsable");
		assertEquals("Unparsable Files Report", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());
		assertEquals("[recepcionDeposito.xhtml]", selenium.unparsableFiles().toString());

		//Step 12
		selenium.clickTab("Dependencies");
		assertEquals("Dependencies", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());
		list = new ArrayList<>();
		list.add("jdtcore-3.1.0.jar");
		list.add("AdministracionEfectivo-ejb-0.0.1-SNAPSHOT.jar");
		list.add("AdministracionEfectivo-jpa-0.0.1-SNAPSHOT.jar");
		list.add("AdministracionEfectivo-seguridad-0.0.1-SNAPSHOT.jar");
		list.add("AdministracionEfectivo-web-0.0.1-SNAPSHOT.war");
		list.add("validation-api-1.0.0.GA.jar");
		list.add("commons-beanutils-1.8.0.jar");
		list.add("commons-digester-2.1.jar");
		list.add("commons-logging-1.1.1.jar");
		list.add("xml-apis-1.3.02.jar");
		list.add("hibernate-commons-annotations-4.0.1.Final.jar");
		list.add("hibernate-validator-4.1.0.Final.jar");
		list.add("jasypt-1.9.0.jar");
		list.add("jboss-logging-3.1.0.CR2.jar");
		list.add("ojdbc6-11.2.0.3.jar");
		list.add("hibernate-jpa-2.0-api-1.0.1.Final.jar");
		list.add("jackson-annotations-2.1.4.jar");
		list.add("jackson-core-2.1.4.jar");
		list.add("jasperreports-5.5.0.jar");
		list.add("javax.persistence-2.0.0.jar");
		list.add("j2ee.jar");
		list.add("javassist-3.15.0-GA.jar");
		list.add("slf4j-api-1.6.1.jar");
		list.add("slf4j-log4j12-1.7.5.jar");
		list.add("spring-aop-3.0.5.RELEASE.jar");
		list.add("spring-asm-3.0.5.RELEASE.jar");
		list.add("spring-beans-3.0.5.RELEASE.jar");
		list.add("spring-context-3.0.5.RELEASE.jar");
		list.add("spring-core-3.0.5.RELEASE.jar");
		list.add("spring-expression-3.0.5.RELEASE.jar");
		list.add("jboss-transaction-api_1.1_spec-1.0.0.Final.jar");
		list.add("castor-1.2.jar");
		list.add("com.ibm.ws.jsf.jar");
		list.add("antlr-2.7.7.jar");
		list.add("aopalliance-1.0.jar");
		list.add("bcmail-jdk14-1.38.jar");
		list.add("bcprov-jdk14-1.38.jar");
		list.add("bctsp-jdk14-1.38.jar");
		list.add("c3p0-0.9.1.1.jar");
		list.add("commons-collections-2.1.jar");
		list.add("dom4j-1.6.1.jar");
		list.add("hibernate-core-4.1.4.Final.jar");
		list.add("itext-2.1.7.js2.jar");
		list.add("jackson-databind-2.1.4.jar");
		list.add("jcommon-1.0.15.jar");
		list.add("jfreechart-1.0.12.jar");
		list.add("log4j-1.2.12.jar");
		list.add("primefaces-3.5.jar");
		list.add("quartz-2.2.0.jar");
		list.add("quartz-jobs-2.2.0.jar");

		collectedList = selenium.dependenciesList();
		Collections.sort(collectedList);
		Collections.sort(list);

		System.out.println("expected: " + list.size());
		System.out.println("actual: " + collectedList.size());
		assertEquals(list.toString(), collectedList.toString());
		
		
		//Step 13
		String hash = selenium.clickMavenCoord();
		Thread.sleep(2000);
		selenium.navigateTo(2);
		selenium.mavenSearch(hash);
		assertTrue(selenium.checkURL().startsWith("https://search.maven.org"));
		selenium.navigateTo(1);
	}

	public void test04() {
		//Step 15
		selenium.clickTab("EJBs");
		assertEquals("EJB Report", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());
		
		//Step 16
		String file = selenium.firstBean();
		assertTrue(selenium.sourceReportFile(file));
		assertEquals("Source Report", selenium.pageTitle());

		//Step 17
		selenium.goBack();
		assertEquals("EJB Report", selenium.pageTitle());
		
		//Step 19
		selenium.clickTab("JPA");
		assertEquals("JPA Report", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());
		
		//Step 20
		file = selenium.clickJPAEntity();
		assertTrue(selenium.sourceReportFile(file));
		assertEquals("Source Report", selenium.pageTitle());
		
		//Step 21
		selenium.goBack();
		assertEquals("JPA Report", selenium.pageTitle());

		//Step 18
		selenium.clickTab("Server Resources");
		assertEquals("Server Resources", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());
		assertEquals(1, selenium.dataSource());

		//Step 22
		selenium.clickTab("Hard-coded IP Addresses");
		assertEquals("Hard-coded IP Addresses", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());
		
		//Step 23
		selenium.clickFirstLink();
		//cannot check actual location scrolled into view
		
		//Step 24
		selenium.goBack();

		//Step 25
		selenium.clickTab("Ignored Files");
		assertEquals("Ignored Files", selenium.pageTitle());
		assertEquals("AdministracionEfectivo.ear", selenium.pageApp());
		assertEquals(44, selenium.ignoreFile());
	}

	public void test05() throws InterruptedException {
		//Step 26
		selenium.clickTab("All Applications");
		
		//Step 27
		selenium.clickApplication("AdditionWithSecurity-EAR-0.01.ear");
		assertEquals("AdditionWithSecurity-EAR-0.01.ear", selenium.pageApp());

		ArrayList<String> list = new ArrayList<>();
		list.add("All Applications");
		list.add("Dashboard");
		list.add("Issues");
		list.add("Application Details");
		list.add("Technologies");
		list.add("Dependencies");
		list.add("Spring Beans");
		list.add("Ignored Files");
		list.add("About");
		list.add("Send Feedback");
		
		ArrayList<String> collectedList = selenium.getTabs();
		Collections.sort(collectedList);
		Collections.sort(list);
		
		assertEquals(list, collectedList);
		

		//Step 28
		selenium.clickTab("Spring Beans");
		assertEquals("Spring Bean Report", selenium.pageTitle());
		assertEquals("AdditionWithSecurity-EAR-0.01.ear", selenium.pageApp());
		
		//Step 29
		selenium.clickCamelLink();
		assertEquals(
				"AdditionWithSecurity-EAR-0.01.ear/AdditionWithSecurity-Service-0.01.war/WEB-INF/camel-context.xml",
				selenium.sourceReportPath());

		//Step 30
		selenium.goBack();
		
		//step 31
		selenium.clickTab("About");
		assertEquals("About", selenium.pageTitle());

		//Step 32
		selenium.clickSendFeedback();
		selenium.moveToFeedback();
		assertEquals("null", selenium.feedbackRadioButton());
		
		//Step 33
		selenium.closeFeedback();
		assertTrue(selenium.popupRemoved("atlwdg-blanket"));
	}

	@After
	public void tearDown()
	{
		selenium.closeDriver();
	}

}