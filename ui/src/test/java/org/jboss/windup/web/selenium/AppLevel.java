package org.jboss.windup.web.selenium;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.awt.AWTException;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;


public class AppLevel extends CommonProject {

	public AppLevel() throws InterruptedException {

		WebElement header = (new WebDriverWait(driver, 10))
				.until(ExpectedConditions.presenceOfElementLocated(By.id("header-logo")));

	}

	/**
	 * returns the current URL of the page May have to wait a few seconds for it to
	 * properly load
	 * 
	 * @return the full URL
	 */
	public String checkURL() {
		return driver.getCurrentUrl();
	}

	/**
	 * navigates the driver to a different tab
	 * @param index starts at 0 (whichever tab to navigate to)
	 * @throws InterruptedException 
	 */
	public void navigateTo(int index) throws InterruptedException {
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		ArrayList tabs = new ArrayList(driver.getWindowHandles());
		if (tabs.size() <= index) {
			Thread.sleep(1000);
			navigateTo(index);
		}
		else {
			driver.switchTo().window((String)tabs.get(index));
			driver.switchTo().defaultContent();
		}
	}

	/**
	 * this switches the tab on the window 
	 * @param index starts at 0
	 */
	public void switchTab(int index) {
		WebElement tabs = driver.findElement(By.cssSelector("ul.nav.navbar-nav"));
		WebElement tab = tabs.findElement(By.cssSelector("li:nth-child(" + index + ")"));
		tab.click();
	}
	
	/**
	 * from the project list screen this will navigate to whichever project is given by the name
	 * @param projName the exact string form of the project name
	 * @return true if the project is found
	 */
	public boolean navigateProject(String projName) {
		// driver.navigate().to("http://127.0.0.1:8080/rhamt-web/project-list");
		int x = 1;
		while (true) {
			try {
				WebElement proj = driver
						.findElement(By.xpath("(//*[@class='list-group-item  project-info  tile-click'])[" + x + "]"));

				WebElement title = proj.findElement(By.cssSelector(
						"div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)"));
				if (title.getText().equals(projName)) {
					title.click();
					return true;
				}
				x++;
				continue;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		return false;
	}

	/**
	 * this method will navigate to a different tab based on the string passed in
	 * @param s is the name of the tab
	 * @return true if the tab is found
	 */
	public boolean clickTab(String s) {
		WebElement header = driver.findElement(By.cssSelector("ul.nav.navbar-nav"));
		int x = 1;
		while (true) {
			try {
				WebElement tab = header.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				if (tab.getText().equals(s)) {
					tab.click();
					return true;
				}
				x++;
			} catch (NoSuchElementException e) {
				return false;
			}
		}
	}
	
	/**
	 * This will click on the Send Feedback tab on the top right side of the page
	 * @throws InterruptedException
	 */
	public void clickSendFeedback() throws InterruptedException {
		WebElement feedback = driver.findElement(By.cssSelector("ul.nav.navbar-nav.navbar-right"));
		feedback.click();

//		WebElement popup = (new WebDriverWait(driver, 30)).until(ExpectedConditions.presenceOfElementLocated(
//				By.cssSelector("html.mozilla")));
	}
	
	/**
	 * can type in deleteAppDialog for the delete box and confirmDialog for save and
	 * running before the packages are loaded
	 * 
	 * @param s
	 *            the string for the type of dialog box
	 * @return true if the popup is removed
	 */
	public boolean popupRemoved(String s) {
		try {
			WebElement dialog = driver.findElement(By.cssSelector("div#" + s + ".modal.fade.in"));
		} catch (NoSuchElementException e) {
			return true;
		}
		return false;
	}
	
	
	/**
	 * this method will take the driver back to the previous page
	 */
	public void goBack() {
		driver.navigate().back();
	}


	/**
	 * this will return the title of the tab
	 * @return
	 */
	public String headerTitle() {
		return driver.getTitle();
	}
	
	/**
	 * returns the name of the page that the driver is on
	 * @return
	 */
	public String pageTitle() {
		WebElement title = driver.findElement(By.cssSelector("div.main"));
		return title.getText();
	}
	
	/**
	 * this will return the application name being used on the page
	 * @return
	 */
	public String pageApp() {
		WebElement app = driver.findElement(By.cssSelector("div.path"));
		return app.getText();
	}
	
	/**
	 * on the Analysis Results page, this will click the reports button based on the 
	 * index given
	 * @param index
	 * @return
	 */
	public String clickAnalysisReport(int index) {
		String xpath = "(//*[@class='success'])[" + index + "]";
		WebDriverWait wait = new WebDriverWait(driver, 10);
		WebElement result = wait.until(ExpectedConditions.elementToBeClickable(driver.findElement(By.xpath(xpath))));
		xpath = "(//*[@class='pointer link'])[2]";
		WebElement actions = result.findElement(By.cssSelector("td:nth-child(5)"));
		WebElement report = actions.findElement(By.cssSelector("a.pointer.link"));
		String url = report.getAttribute("href");
		
		report.click();
		
		return url;
	}
	
	/**
	 * this method will go through all the applications listed, and clicks on the one specified
	 * @param application
	 */
	public void clickApplication(String application) {
		int x = 1;
		while (true) {
			WebElement app = driver.findElement(By.xpath("(//*[@class='appInfo pointsShared0'])[" + x + "]"));
			WebElement link = app.findElement(By.cssSelector("div.fileName a"));
			x++;
			if (link.getText().equals(application)) {
				link.click();
				break;
			}
		}
	}
	
	/**
	 * This will return an arrayList of strings comprised of the names of tabs
	 * @return
	 */
	public ArrayList<String> getTabs() {
		WebElement header = driver.findElement(By.cssSelector("ul.nav.navbar-nav"));
		
		int x = 1;
		ArrayList<String> tabs = new ArrayList<>();
		while (true) {
			try {
				WebElement tab = header.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				tabs.add(tab.getText());
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		WebElement feedback = driver.findElement(By.cssSelector("ul.nav:nth-child(2)"));
		tabs.add(feedback.getText());
		return tabs;
	}
	

	/**
	 * this will click on the first hyperlink in the first table on the all issues page. 
	 * it then locates the new addition detailing the issue, and a yellow box to the left side.
	 * If this addition shows up, then true is returned
	 * @return true if the expansion of the first issue is complete
	 */
	public boolean clickFirstIssue() {
		WebElement table = driver.findElement(By.cssSelector("table.tablesorter:nth-child(1)"));
		WebElement body = table.findElement(By.cssSelector("tbody"));
		WebElement issue = body.findElement(By.cssSelector("tr:nth-child(1)"));
		WebElement link = body.findElement(By.cssSelector("a.toggle"));
		String i = link.getText();
		WebElement tIncidents = issue.findElement(By.cssSelector("td:nth-child(2)"));
		int totalIncidents = Integer.valueOf(tIncidents.getText());

		JavascriptExecutor jse2 = (JavascriptExecutor)driver;
		jse2.executeScript("arguments[0].click()", link);

		//link.click();

		WebElement fileExpanded = body.findElement(By.cssSelector("tr:nth-child(2)"));
		body = fileExpanded.findElement(By.cssSelector("tbody"));
		int total = 0;
		int x = 1;
		while (true) {
			try {
				WebElement file = body.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				WebElement incident = file.findElement(By.cssSelector("td.text-right"));
				total += Integer.valueOf(incident.getText());

				if (x == 1) {
					//this WebElement is the yellow text box holding the show rule link
					WebElement textBox = file.findElement(By.cssSelector("div.panel.panel-default.hint-detail-panel"));
					//collects the title for the show rule panel
					WebElement title = textBox.findElement(By.cssSelector(".panel-title"));
					//cuts out the "Issue Detail:" part of the title for the rule
					String t = title.getText().substring(13);
					//if the textbox is not yellow and the string i (the issue link) does not equal t (the textbox's title)
					//then false is returned
					if (!textBox.getCssValue("background-color").equals("rgba(255, 252, 220, 1)") && (!t.equals(i))) {
						return false;
					}
					//lastly it checks that the show rule link is there
					WebElement showRule = file.findElement(By.cssSelector("a.sh_url"));
				}
				x++;
			} catch (NoSuchElementException e) {
				if (x == 1) {
					return false;
				}
				break;
			}
		}
		if (totalIncidents == total) {
			return true;
		}
		return false;
	}

	/**
	 * If the expanded information of an issue is there, then the method will
	 * locate the "Show Rule" hyperlink and check it.
	 * this should redirect to a new page.
	 */
	public void clickShowRule() {
		WebElement table = driver.findElement(By.cssSelector("table.tablesorter:nth-child(1)"));
		WebElement body = table.findElement(By.cssSelector("tbody"));
		WebElement fileExpanded = body.findElement(By.cssSelector("tr:nth-child(2)"));
		body = fileExpanded.findElement(By.cssSelector("tbody"));
		WebElement showRule = body.findElement(By.cssSelector("a.sh_url"));
		String rule = showRule.getCssValue("title");
		showRule.click();
	}

	/**
	 * This method checks if the expanded information on the issue is present
	 * @return true if it is displayed
	 */
	public boolean showRuleVisible() {
		WebElement table = driver.findElement(By.cssSelector("table.tablesorter:nth-child(1)"));
		WebElement body = table.findElement(By.cssSelector("tbody"));
		WebElement fileExpanded = body.findElement(By.xpath("/html/body/div[2]/div[2]/div/table[1]/tbody/tr[2]/td"));
		return fileExpanded.isDisplayed();
	}

	
	/**
	 * this will look at the tree of files from the Application Details page and check if
	 * it is collapsed or not
	 * @return true if the tree is collapsed
	 */
	public boolean treeCollapsed() {
		WebElement body = driver.findElement(By.cssSelector("tbody"));
		WebElement top = body.findElement(By.cssSelector("tr:nth-child(1)"));
		WebElement tree = top.findElement(By.cssSelector("div#treeView-Projects-wrap"));
		if (tree.getAttribute("class").equals("short")) {
			return true;
		}
		return false;
	}

	/**
	 * this clicks on the show all button
	 */
	public void treeShowAll() {
		WebElement showAll = driver.findElement(By.cssSelector("a.showMore"));
		showAll.click();
	}
	
	/**
	 * this clicks on the show less button
	 */
	public void treeShowLess() {
		WebElement showLess = driver.findElement(By.cssSelector("a.showLess"));
		showLess.click();
	}
	
	/**
	 * this will check if the overlay blocking the tree from view is present or not
	 * @return true if the overlay is present and the tree is obscured
	 */
	public boolean treeIsCollapsed() {
		WebElement fog = driver.findElement(By.cssSelector("div#overlayFog"));
		return fog.isDisplayed();
	}
	
	/**
	 * This method will go through the tree hierarchy, knowing that the first file is a .ear one,
	 * then continuing on, if the file is a .war file, then further files from that point are checked,
	 * and other than that any other file that does not end in .jar will return false
	 * @return true if all the files are properly sorted and in order
	 * @throws InterruptedException
	 */
	public boolean treeHierarchy() throws InterruptedException {
		WebElement tree = driver.findElement(By.cssSelector("div#treeView-Projects"));
		System.out.println(tree.getText());
		
		WebElement leaf = (new WebDriverWait(driver, 20)).until(ExpectedConditions.presenceOfElementLocated(
				By.cssSelector("li.jstree-node.jstree-open.jstree-last")));
		WebElement branch = leaf.findElement(By.cssSelector("ul"));
		int x = 2;
		boolean war = false;
		while (true) {
			try {
				WebElement element = branch.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				WebElement name = element.findElement(By.cssSelector("a"));
				String suffix = fileSuffix(name.getText());
				if (suffix.equals(".war")) {
					war = true;
					WebElement more = element.findElement(By.cssSelector("ul"));
				}
				else if (!suffix.equals(".jar")) {
					return false;
				}
				war = false;
				x++;
			}
			catch (NoSuchElementException e) {
				if (war == true) {
					return false;
				}
				break;
			}
		}
		return true;
	}
	
	/**
	 * this method quickly looks at the files and gets a suffix
	 * @param fileName
	 * @return
	 */
	private String fileSuffix(String fileName) {
		return fileName.substring(fileName.length() - 4);
		
	}
	
	/**
	 * This method will collect the total story points, then at the bottom of the application details
	 * page it will go down each file, check if it has 0 story points and if so then check that it's
	 * data is collapsed, it also checks for files with story points greater than 0, and totals the number
	 * of story points together, comparing that and the total story points at the end
	 * @return true if all of the above checks passed
	 */
	public boolean findStoryPoints() {
		WebElement body = driver.findElement(By.cssSelector("div.theme-showcase"));
		WebElement p = driver.findElement(By.cssSelector("div.points"));
		WebElement n = p.findElement(By.cssSelector("div.number"));
		int points = Integer.valueOf(n.getText());
		int totalSP = 0;
		
		boolean working = false;
		int x =1;
		while (true) {
			try {
				WebElement div = body.findElement(By.xpath("(//*[@class='panel panel-primary projectBox'])[" + x + "]"));
				String storyPoints = div.getAttribute("data-windup-project-storypoints");
				WebElement b = div.findElement(By.cssSelector("div:nth-child(2)"));
				if ((storyPoints.equals("0")) & (b.getAttribute("style").equals("display: none;"))) {
					working = true;
				}
				else {
					working = false;
				}
				x++;

			} catch (NoSuchElementException e) {
				x = 1;
				while (true) {
					try {
						WebElement div = body.findElement(By.xpath("(//*[@class='panel panel-primary projectBox panel-boarding'])[" + x + "]"));
						String storyPoints = div.getAttribute("data-windup-project-storypoints");
						int s = Integer.valueOf(storyPoints);
						totalSP += s;
						WebElement b = div.findElement(By.cssSelector("div:nth-child(2)"));
						if ((!storyPoints.equals("0")) & (b.getAttribute("style").equals(""))) {
							working = true;
						}
						else {
							working = false;
						}
						x++;
					}
					 catch (NoSuchElementException ex) {
						 break;
					}
				}
				break;
			}
		}
		if (points == totalSP && working == true) {
			return true;
		}
		else {
			return false;
		}
	}
	
	/**
	 * On the Dependencies page, this method goes through each file report and 
	 * saves the names of the files into a string arrayList
	 * @return the arraylist of file names
	 */
	public ArrayList<String> dependenciesList() {
		WebElement body = driver.findElement(By.cssSelector("div.dependencies"));
		ArrayList<String> list = new ArrayList<>();
		
		int x = 1;
		while (true) {
			try {
				WebElement div = body.findElement(By.xpath("(//*[@class='panel panel-default panel-primary dependency'])[" + x + "]"));
				WebElement title = div.findElement(By.cssSelector("div.panel-heading"));
				list.add(title.getText());
				x++; 
			}
			catch (NoSuchElementException e) {
				 break;
			}
		}
		return list;
	}
	

	/**
	 * This method will click on the first maven coordinate found. It saves the coordinate
	 * and then clicks on they hyperlink, from that page it locates the searchbox, and collects
	 * the coordinate there, then compares the two.
	 * @return
	 */
	public String clickMavenCoord() {
		WebElement dependencies = driver.findElement(By.className("dependencies"));
		int x = 1;
		while (true) {
			try {
				WebElement dep = dependencies.findElement(By.cssSelector("div.panel:nth-child(" + x + ")"));
				WebElement firstTrait = dep.findElement(By.cssSelector("dt:nth-child(1)"));
				if (firstTrait.getText().equals("Maven coordinates:")) {
					WebElement hash = dep.findElement(By.cssSelector("dd:nth-child(2)"));
					String shaHash = hash.getText();
					WebElement link = dep.findElement(By.cssSelector("a"));
					link.click();
					return shaHash;
				}
				x++;

			} catch (NoSuchElementException e) {
				break;
			}
		}
		return "did not find";
	}
	
	/**
	 * once the driver has changed to the maven central repository tab, 
	 * this will find the searchbox, and collect the information in it.
	 * @param hash is the link found on the Dependencies page
	 * @return true if the value in the searchbox matches the hash
	 * @throws AWTException
	 */
	public boolean mavenSearch(String hash) throws AWTException {
		WebElement search = (new WebDriverWait(driver, 20))
				.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input#mat-input-0")));
		String s = search.getAttribute("value");
		return s.equals(hash);
	}

	/**
	 * Within the table, this will find any file within the report, specifically the
	 * bolded file name, it will save that in to an arraylist
	 * @return an arrayList of file names 
	 */
	public ArrayList<String> unparsableFiles() {
		WebElement body = driver.findElement(By.cssSelector("div.row.unparsableFile"));
		WebElement table = body.findElement(By.cssSelector("tbody"));
		ArrayList<String> list = new ArrayList<>();
		int x = 1;
		while (true) {
			try {
				WebElement tr = table.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				WebElement file = tr.findElement(By.cssSelector("a:nth-child(1) > strong:nth-child(1)"));
				list.add(file.getText());
				x++;
			}
			catch (NoSuchElementException e) {
				break;
			}
		}
		return list;
	}

	/**
	 * in the spring bean report, this method will find and click on the first link within the table
	 * @return the name of the link
	 */
	public String firstBean() {
		WebElement body = driver.findElement(By.cssSelector("tbody"));
		WebElement firstRow = body.findElement(By.cssSelector("tr:nth-child(2)"));
		WebElement implementation = firstRow.findElement(By.cssSelector("td:nth-child(3) > a"));
		String file = implementation.getText();
		implementation.click();
		return file;
	}
	
	/**
	 * in the JPA report, this method clicks on the first JPA Entity link
	 * @return the link in string form
	 */
	public String clickJPAEntity() {
		WebElement body = driver.findElement(By.cssSelector("div.container-fluid.theme-showcase"));
		WebElement table = body.findElement(By.cssSelector("table#jpaEntityTable"));
		WebElement first = table.findElement(By.cssSelector("tr:nth-child(2)"));
		WebElement link = first.findElement(By.cssSelector("td:nth-child(2) > a:nth-child(1)"));
		String file = link.getText();
		link.click();
		return file;
	}
	
	/**
	 * Taking in the end of a report file, it parses the end with a "." character, 
	 * then adds ".java" to the end of that, collecting a result from the top of the report
	 * it checks that the substrings ends with the result.
	 * @param file
	 * @return
	 */
	public boolean sourceReportFile(String file) {
		WebElement r = driver.findElement(By.cssSelector("div.path.project-specific"));
		String result = r.getText();

		int index = file.lastIndexOf(".");
		String sub = file.substring(index + 1) + ".java";
		
		return result.endsWith(sub);
	}

	/**
	 * On the server resources page, this goes through the data sources table, and counts how many rows there are
	 * @return the number of rows in the data sources table.
	 */
	public int dataSource() {
		WebElement table = driver.findElement(By.cssSelector("table.table.table-striped.table-bordered"));
		int x = 2;
		while (true) {
			try {
				WebElement row = table.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				x++;
			}
			catch (NoSuchElementException e) {
				return x - 2;
			}
		}
	}
	
	/**
	 * In some instances, this method can, inside of the table go through the rows, and click on the first link.
	 */
	public void clickFirstLink() {
		WebElement table = driver.findElement(By.cssSelector("tbody"));
		WebElement link = table.findElement(By.cssSelector("tr:nth-child(2) > td:nth-child(1) > a:nth-child(1)"));
		link.click();
	}

	public void clickCamelLink() {
		WebElement table = driver.findElement(By.cssSelector("tbody"));
		WebElement link = table.findElement(By.ByLinkText.linkText("WEB-INF/camel-context.xml"));
		link.click();
	}
	
	/**
	 * On the ignore Files page, this will go through each row in the table and return how many there are
	 * @return the number of rows
	 */
	public int ignoreFile() {
		WebElement table = driver.findElement(By.cssSelector("tbody"));
		int x = 2;
		while (true) {
			try {
				WebElement row = table.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				x++;
			}
			catch (NoSuchElementException e) {
				return x - 2;
			}
		}
	}
	
	/**
	 * collects the path from the source report
	 * @return the path
	 */
	public String sourceReportPath() {
		WebElement path = driver.findElement(By.cssSelector("div.path.project-specific"));
		return path.getText();
	}

	/**
	 * this finds the no or cancel button of the popup and clicks it
	 * @throws InterruptedException 
	 */
	public void closeFeedback() throws InterruptedException {
		WebElement cancel = driver.findElement(By.cssSelector("a.cancel"));
		cancel.click();

		navigateTo(1);
	}
	
	/**
	 * this will have the driver switch to the send feedback frame of the page
	 */
	public void moveToFeedback() {
		WebElement dialogue = driver.findElement(By.cssSelector("iframe#atlwdg-frame"));
		driver.switchTo().frame(dialogue);
	}

	/**
	 * This will sort through the 5 rating radio buttons and click on the one specified
	 * @param rating is the suffix of the radiobutton's id. can either be "awesome", "good", "meh", "bad", "horrible"
	 */
	public void selectFeedbackButton(String rating) {
		WebElement ratings = driver.findElement(By.cssSelector("div#feedback-rating"));
		for (int x = 1; x < 6; x++) {
			try {
				WebElement button = ratings.findElement(By.cssSelector("input#rating-" + rating));
				
				button.click();

			} catch (NoSuchElementException e) {
			}
		}
	}
	
	/**
	 * this method will go through the 5 feedback buttons, and return the name of the radiobutton
	 * @return the name of the radiobutton
	 */
	public String feedbackRadioButton() {
		WebElement ratings = driver.findElement(By.cssSelector("div#feedback-rating"));
		for (int x = 1; x < 6; x++) {
			try {
				WebElement button = ratings.findElement(By.cssSelector("div.jic-radio:nth-child(" + x + ")"));
				WebElement input = button.findElement(By.cssSelector("input"));
				if (input.isSelected()) {
					return button.getText();
				}
			} catch (NoSuchElementException e) {
			}
		}
		return "null";
	}

	/**
	 * closes the browser
	 */
	public void closeDriver() {
		driver.quit();
	}

	public void waitForProjectLoad()
	{

		WebDriverWait wait = new WebDriverWait(driver, 5);
		wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".activated-item")));


	}

}