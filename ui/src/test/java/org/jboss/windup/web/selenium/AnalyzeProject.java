package org.jboss.windup.web.selenium;


import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.awt.AWTException;
import java.util.ArrayList;
import java.util.Collections;

/**
 * 
 * @author elise
 *
 */

public class AnalyzeProject extends CommonProject {

	public AnalyzeProject() throws InterruptedException {

		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(ExpectedConditions.presenceOfElementLocated(By.id("header-logo")));

		navigateProject("test 2");
		waitForProjectLoad();
		clickAnalysisReport(2);

		navigateTo(1);

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
	 * 
	 * @param index
	 *            starts at 0 (whichever tab to navigate to)
	 * @throws InterruptedException
	 */
	public void navigateTo(int index) throws InterruptedException {
		ArrayList tabs = new ArrayList(driver.getWindowHandles());
		if (tabs.size() < 2) {
			Thread.sleep(1000);
			navigateTo(index);
		} else {
			driver.switchTo().window((String) tabs.get(index));
			driver.switchTo().defaultContent();
		}
	}

	/**
	 * from the project list screen this will navigate to whichever project is given
	 * by the name
	 * 
	 * @param projName
	 *            the exact string form of the project name
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
	 * this switches the tab on the window
	 * 
	 * @param index
	 *            starts at 0
	 */
	public void switchTab(int index) {
		WebElement tabs = driver.findElement(By.cssSelector("ul.nav.navbar-nav"));
		WebElement tab = tabs.findElement(By.cssSelector("li:nth-child(" + index + ")"));
		tab.click();

		waitForTabLoad();

		WebDriverWait wait = new WebDriverWait(driver,20);

		tabs = driver.findElement(By.cssSelector("ul.nav.navbar-nav"));
		wait.until(ExpectedConditions.elementToBeClickable(tabs.findElement(
				By.cssSelector("li:nth-child(" + index + ")" +
				".active"))));

	}


	/**
	 * This will click on the Send Feedback tab on the top right side of the page
	 * 
	 * @throws InterruptedException
	 */
	public void clickSendFeedback() throws InterruptedException {
		WebElement feedback = driver.findElement(By.cssSelector("ul.nav.navbar-nav.navbar-right"));
		feedback.click();
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
	 * 
	 * @return
	 */
	public String headerTitle() {
		return driver.getTitle();
	}

	/**
	 * returns the name of the page that the driver is on
	 * 
	 * @return
	 */
	public String pageTitle() {
		WebElement title = (new WebDriverWait(driver, 5))
				.until(ExpectedConditions.elementToBeClickable(
						By.cssSelector("div.main")));
		return title.getText();
	}

	/**
	 * on the Analysis Results page, this will click the reports button based on the
	 * index given
	 * 
	 * @param index
	 * @return
	 */
	public String clickAnalysisReport(int index) {
		String xpath = "(//*[@class='success'])[" + index + "]";
		WebElement result = driver.findElement(By.xpath(xpath));
		xpath = "(//*[@class='pointer link'])[2]";
		WebElement actions = result.findElement(By.cssSelector("td:nth-child(5)"));
		WebElement report = actions.findElement(By.cssSelector("a.pointer.link"));
		String url = report.getAttribute("href");

		report.click();

		return url;
	}

	/*
	 * *************** SORTING METHODS ***************
	 */

	/**
	 * this will collect an arraylist of application objects that will in turn
	 * collect the name and story point count of each application
	 * 
	 * @return the arraylist of application objects
	 */
	public ArrayList<Application> listApplications() {
		WebElement appList = driver.findElement(By.cssSelector(".real"));
		ArrayList<Application> list = new ArrayList<>();

		int x = 1;
		while (true) {
			try {
				WebElement app = appList.findElement(By.xpath("(//*[@class='appInfo pointsShared0'])[" + x + "]"));
				WebElement title = app.findElement(By.xpath("(//*[@class='fileName'])[" + x + "]"));
				WebElement storyPoint = app.findElement(By.cssSelector("span.points"));
				if (title.getText().equals("Archives shared by multiple applications")) {
					return list;
				} else if (!app.getAttribute("style").equals("display: none;")) {
					Application a = new Application(title.getText(), storyPoint.getText());
					list.add(a);
				}
				x++;
			} catch (NoSuchElementException e) {
				return list;
			}
		}
	}

	/**
	 * The Status class has a type and output, the type can be warning, success
	 * danger, and info, which are found from the output's class name.
	 * 
	 * @author edixon
	 *
	 */
	class Application {

		String name;
		int storyPoints;

		// Constructor
		public Application(String name, String storyPoints) {
			this.name = name;
			this.storyPoints = Integer.parseInt(storyPoints);
		}

		public String toString() {
			return this.name;
		}

		public boolean equals(Object o) {
			if (o == this)
				return true;
			if (o == null || o.getClass() != Application.class) {
				return false;
			}
			Application other = (Application) o;
			return (this.name.equals(other.name)) && (this.storyPoints == other.storyPoints);
		}
	}

	/**
	 * with a given application arraylist, this will go through the applications and
	 * put the names into a string arraylist
	 * 
	 * @return a string arraylist of names
	 */
	private ArrayList<String> collectNames() {
		ArrayList<Application> appList = listApplications();
		ArrayList<String> list = new ArrayList<>();

		for (Application a : appList) {
			list.add(a.name);
		}
		return list;
	}

	/**
	 * with a given application arraylist, this will go through the applications and
	 * put the storyPoints into an integer arraylist
	 * 
	 * @return an integer arraylist of names
	 */
	private ArrayList<Integer> collectStoryPoints() {
		ArrayList<Application> appList = listApplications();
		ArrayList<Integer> list = new ArrayList<>();

		for (Application a : appList) {
			list.add(a.storyPoints);
		}
		return list;
	}

	public void projectSort() {

	}

	/**
	 * this is the main method to call for sorting the application list by name and
	 * story points. It automatically tests that both attributes sort properly by
	 * ascending and descending order.
	 * 
	 * @return true if the sort works on the page
	 */
	public boolean applicationSort() {
		ArrayList<String> sortN = collectNames();
		ArrayList<String> name = collectNames();

		sortN = sortStringDesc(sortN);
		sortApplicationList("Name", false);
		name = collectNames();

		// checks if sorting by name descending works
		if (name.equals(sortN)) {
			sortN = sortStringAsc(sortN);
			sortApplicationList("Name", true);
			name = collectNames();

			// checks if sorting by name ascending works
			if (name.equals(sortN)) {
				ArrayList<Integer> sortS = collectStoryPoints();
				ArrayList<Integer> storyPoint = collectStoryPoints();

				sortS = sortIntDesc(sortS);
				sortApplicationList("Story Points", false);
				storyPoint = collectStoryPoints();

				// checks if sorting by story point descending works
				if (storyPoint.equals(sortS)) {
					sortS = sortIntAsc(sortS);
					sortApplicationList("Story Points", true);
					storyPoint = collectStoryPoints();

					// checks if sorting by story point ascending works
					if (storyPoint.equals(sortS)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * this method is used to actually interact with the page and have it sort the
	 * application list by name/story point and toggle the ascending/descending
	 * order.
	 * 
	 * @param sortOrder
	 *            is the name of the sort (should be "Name" or "Story Points")
	 * @param ascending
	 *            is true for ascending order, false for descending
	 * @return true if these params are properly found.
	 */
	public boolean sortApplicationList(String sortOrder, boolean ascending) {
		WebElement sorts = driver.findElement(By.cssSelector("div#sort.form-group"));
		dropDown(sorts, sortOrder);

		try {
			WebElement order = driver.findElement(By.cssSelector("span.fa.fa-sort-alpha-asc"));
			if (ascending == false) {
				order.click();
			}
			return true;
		} catch (NoSuchElementException e) {
			try {
				WebElement order = sorts.findElement(By.cssSelector("span.fa.fa-sort-alpha-desc"));
				if (ascending == true) {
					order.click();
				}
			} catch (NoSuchElementException ex) {
				return false;
			}
		}
		return false;
	}

	/**
	 * This method is to interact with the filter selection and input.
	 * 
	 * @param filterName
	 *            should either be "Name" or "Tags"
	 * @param searchParam
	 *            is the string to search for
	 * @throws AWTException
	 */
	public void filterAppList(String filterName, String searchParam) throws AWTException {
		WebElement filter = driver.findElement(By.cssSelector("div#filter-div.form-group.toolbar-pf-filter"));
		dropDown(filter, filterName);

		WebElement search = driver.findElement(By.cssSelector("input#filter.form-control"));
		Actions actions = new Actions(driver);
		actions.moveToElement(search).click();
		actions.sendKeys(searchParam).perform();

		filter.submit();

	}

	/**
	 * Interacting with the filter mechanics of the application list page, this will
	 * change the relationship of the filters from "Matches all filters (AND)" and
	 * "Matches any filter (OR)"
	 * 
	 * @param s
	 *            the exact string of the relationship to be changed to
	 */
	public void changeRelationship(String s) {
		WebElement filterType = driver.findElement(By.cssSelector("div#filter-type"));
		dropDown(filterType, s);
	}

	/**
	 * this will clear all filters added on the application list page
	 */
	public void clearFilters() {
		WebElement clear = driver.findElement(By.cssSelector("a#clear-filters"));
		clear.click();
	}

	/**
	 * with a given string, this will delete that filter, given that it is there
	 * 
	 * @param s
	 *            the exact string of the filter name
	 * @return true if the filter is found and deleted
	 */
	public boolean deleteFilter(String filterType, String filterName) {
		WebElement activeFilters = driver.findElement(By.cssSelector("ul#active-filters"));
		int x = 1;
		while (true) {
			try {
				WebElement filter = activeFilters.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				if (filter.getText().equals(filterType + filterName)) {
					WebElement delete = filter.findElement(By.cssSelector("span.glyphicon.glyphicon-remove"));
					delete.click();
					return true;
				}
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		return false;
	}

	/**
	 * helper method that interacts with the various drop-downs on whichever page
	 * the driver is on
	 * 
	 * @param f
	 *            is the web element holding the dropdown
	 * @param name
	 *            is the name to be selected in the dropdown
	 */
	private void dropDown(WebElement f, String name) {
		WebElement dropDown = f.findElement(By.cssSelector("button.btn.btn-default.dropdown-toggle"));
		dropDown.click();
		WebElement menu = f.findElement(By.className("dropdown-menu"));
		int x = 1;
		while (true) {
			try {
				WebElement option = menu.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				if (option.getText().equals(name)) {
					option.click();
					break;
				}
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
	}

	/**
	 * on the all issues page, this method will print out the names of the various
	 * tables (e.g. "Migraiton Optional", "Cloud Mandatory")
	 * 
	 * @return an string array list of the titles
	 */
	public ArrayList<String> allIssuesReport() {
		ArrayList<String> list = new ArrayList<>();
		int x = 1;
		while (true) {
			try {
				WebElement table = driver.findElement(By.cssSelector("table.tablesorter:nth-child(" + x + ")"));
				WebElement title = table.findElement(By.cssSelector("td:nth-child(1)"));
				list.add(title.getText());
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		return list;

	}

	/**
	 * This is the main method to go through and sort the all issues page. It will
	 * go through each table on the page, and then each of the 4 sort buttons on the
	 * header of that table. It will then use other helper methods to collect the
	 * data in each table's column, sort that data, and collect that data after the
	 * header has been clicked to sort it on the table. If all of this data is
	 * correctly sorted, then true is returned.
	 * 
	 * @return true if the sorts in all issues work
	 */
	public boolean sortAllIssues() {

		Boolean working = false;
		int x = 1;

		while (true) {
			try {
				WebElement table = driver.findElement(By.cssSelector("table.tablesorter:nth-child(" + x + ")"));
				WebElement title = table.findElement(By.cssSelector("tr.tablesorter-ignoreRow"));
				WebElement sortRow = table.findElement(By.cssSelector("tr.tablesorter-headerRow"));
				WebElement body = table.findElement(By.cssSelector("tbody"));

				for (int y = 1; y < 6; y++) {

					WebElement sort = sortRow.findElement(By.cssSelector("th:nth-child(" + y + ")"));
					String c = sort.getAttribute("class");

					// For Strings
					if (y == 1) {

						for (int j = 0; j < 2; j++) {

							c = sort.getAttribute("class");
							// for sorting by ascending order
							if (c.endsWith("-headerUnSorted") || c.endsWith("-headerDesc")) {
								ArrayList<String> preSort = collectBody(body);
								ArrayList<String> autoSort = sortStringAsc(preSort);
								
								sort.click();
								ArrayList<String> postSort = collectBody(body);
								if (postSort.equals(autoSort))
									working = true;
								else
									return false;

							}
							// for sorting by descending order
							else if (c.endsWith("-headerAsc")) {
								ArrayList<String> preSort = collectBody(body);
								ArrayList<String> autoSort = sortStringDesc(preSort);

								sort.click();
								ArrayList<String> postSort = collectBody(body);
								if (postSort.equals(autoSort))
									working = true;
								else
									return false;
							}
						}

					}

					// For integers
					else if (y != 4) {
						for (int j = 0; j < 2; j++) {

							c = sort.getAttribute("class");

							// for sorting by ascending order
							if (c.endsWith("-headerUnSorted") || c.endsWith("-headerDesc")) {
								ArrayList<Integer> preSort = collectBody(body, y);
								ArrayList<Integer> autoSort = sortIntAsc(preSort);

								sort.click();
								ArrayList<Integer> postSort = collectBody(body, y);
								if (postSort.equals(autoSort))
									working = true;
								else
									return false;

							}
							// for sorting by descending order
							else if (c.endsWith("-headerAsc")) {
								ArrayList<Integer> preSort = collectBody(body, y);
								ArrayList<Integer> autoSort = sortIntDesc(preSort);
								sort.click();
								ArrayList<Integer> postSort = collectBody(body, y);
								if (postSort.equals(autoSort))
									working = true;
								else
									return false;
							}
						}
					}
				}

				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		return working;
	}

	/**
	 * this collects the first column of a table on the all issues page. It stores
	 * the elements in string form given that they should be names
	 * 
	 * @param column
	 *            is the current table
	 * @return an arrayList of strings holding all the names
	 */
	private ArrayList<String> collectBody(WebElement table) {
		ArrayList<String> list = new ArrayList<>();
		int x = 1;
		while (true) {
			try {
				WebElement file = table.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				WebElement attribute = file.findElement(By.cssSelector("td:nth-child(1)"));
				list.add(attribute.getText().toLowerCase());

				x += 2;
			} catch (NoSuchElementException e) {
				break;
			}
		}

		return list;
	}

	/**
	 * This collects a column in the current table, first as a string, then changing
	 * the elements in the table to integers and collecting them into an array.
	 * 
	 * @param table
	 *            is the current table to collect elements in
	 * @param column
	 *            is the column number to search (starts at 1)
	 * @return an arraylist of integers representing the column
	 */
	private ArrayList<Integer> collectBody(WebElement table, int column) {
		ArrayList<Integer> list = new ArrayList<>();

		int x = 1;
		while (true) {
			try {
				WebElement file = table.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				WebElement attribute = file.findElement(By.cssSelector("td:nth-child(" + column + ")"));
				list.add(Integer.valueOf(attribute.getText()));

				x += 2;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		return list;
	}

	/**
	 * This method sorts a given arraylist of strings in ascending order
	 * 
	 * @param list
	 *            the arraylist of strings to sort
	 * @return an arraylsist of sorted strings
	 */
	private ArrayList<String> sortStringAsc(ArrayList<String> list) {
		ArrayList<String> sorted = list;
		System.out.println(sorted);
		Collections.sort(sorted);

		System.out.println(sorted);
		return sorted;
	}

	/**
	 * This method sorts a given arraylist of integers in ascending order
	 * 
	 * @param list
	 *            the arraylist of integers to sort
	 * @return an arraylsist of sorted integers
	 */
	private ArrayList<Integer> sortIntAsc(ArrayList<Integer> list) {
		ArrayList<Integer> sorted = list;
		Collections.sort(sorted);
		return sorted;
	}

	/**
	 * This method sorts a given arraylist of strings in descending order
	 * 
	 * @param list
	 *            the arraylist of strings to sort
	 * @return an arraylsist of sorted strings
	 */
	private ArrayList<String> sortStringDesc(ArrayList<String> list) {

		ArrayList<String> sorted = list;
		Collections.sort(sorted, Collections.reverseOrder());
		return sorted;
	}

	/**
	 * This method sorts a given arraylist of integers in descending order
	 * 
	 * @param list
	 *            the arraylist of integers to sort
	 * @return an arraylsist of sorted integers
	 */
	private ArrayList<Integer> sortIntDesc(ArrayList<Integer> list) {

		ArrayList<Integer> sorted = list;
		Collections.sort(sorted, Collections.reverseOrder());
		return sorted;
	}

	/*
	 * ********************** END OF SORTING METHODS **********************
	 */

	/**
	 * this will click on the first hyperlink in the first table on the all issues
	 * page. it then locates the new addition detailing the issue, and a yellow box
	 * to the left side. If this addition shows up, then true is returned
	 * 
	 * @return true if the expansion of the first issue is complete
	 */
	public boolean

	clickFirstIssue() throws InterruptedException{
		WebElement table = driver.findElement(By.cssSelector("table.tablesorter:nth-child(1)"));
		WebElement body = table.findElement(By.cssSelector("tbody"));
		WebElement issue = body.findElement(By.cssSelector("tr:nth-child(1)"));

		WebElement tIncidents = issue.findElement(By.cssSelector("td:nth-child(2)"));
		int totalIncidents = Integer.valueOf(tIncidents.getText());

		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(
				ExpectedConditions.elementToBeClickable(
						By.cssSelector("table.tablesorter:nth-child(1) " +
								"tbody " + "a.toggle"))
		);

		WebElement link = driver.findElement(By.cssSelector("table.tablesorter:nth-child(1) " +
				"tbody " + "a.toggle"));

		Thread.sleep(2000);

		JavascriptExecutor jse2 = (JavascriptExecutor)driver;
		jse2.executeScript("arguments[0].click()", link);

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
					WebElement textBox = file.findElement(By.cssSelector("div.panel.panel-default.hint-detail-panel"));

					if (!textBox.getCssValue("background-color").equals("rgba" +
							"(255, 252, 220, 1)")) {
						return false;
					}
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
	 * If the expanded information of an issue is there, then the method will locate
	 * the "Show Rule" hyperlink and check it. this should redirect to a new page.
	 */
	public void clickShowRule() {
		WebElement table = driver.findElement(By.cssSelector("table.tablesorter:nth-child(1)"));
		WebElement body = table.findElement(By.cssSelector("tbody"));
		WebElement fileExpanded = body.findElement(By.cssSelector("tr:nth-child(2)"));
		body = fileExpanded.findElement(By.cssSelector("tbody"));
		WebElement showRule = body.findElement(By.cssSelector("a.sh_url"));
		JavascriptExecutor jse2 = (JavascriptExecutor)driver;
		jse2.executeScript("arguments[0].click()", showRule);
	}

	/**
	 * This method checks if the expanded information on the issue is present
	 * 
	 * @return true if it is displayed
	 */
	public boolean showRuleVisible() {
		WebElement table = driver.findElement(By.cssSelector("table.tablesorter:nth-child(1)"));
		WebElement body = table.findElement(By.cssSelector("tbody"));
		WebElement fileExpanded = body.findElement(By.xpath("/html/body/div[2]/div[2]/div/table[1]/tbody/tr[2]/td"));
		return fileExpanded.isDisplayed();
	}

	/**
	 * this checks that the applications are indeed sorted properly on the
	 * technologies page
	 * 
	 * @return true if the applications are sorted
	 */
	public boolean techApps() {
		WebElement toggle = driver.findElement(By.cssSelector("td.sector:nth-child(1)"));

		// Ascending
		ArrayList<String> hold = collectAppName();
		System.out.println(hold);
		ArrayList<String> sorted = sortStringAsc(collectAppName());
		System.out.println(sorted);
		if (hold.equals(sorted)) {
			// Descending
			toggle.click();
			hold = collectAppName();
			System.out.println(hold);
			sorted = sortStringDesc(collectAppName());
			System.out.println(sorted);
			return hold.equals(sorted);
		}
		return false;
	}

	public ArrayList<String> collectAppName() {

		WebElement body = driver.findElement(By.cssSelector("tbody"));

		int x = 1;
		ArrayList<String> apps = new ArrayList<>();
		while (true) {
			try {
				WebElement app = body.findElement(By.cssSelector("tr.app:nth-child(" + x + ")"));
				WebElement name = app.findElement(By.cssSelector("td.name"));
				apps.add(name.getText());
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		return apps;
	}

	public ArrayList<Integer> collectColumn(int index) {
		ArrayList<Integer> collectedCol = new ArrayList<>();
		int x = 1;
		while (true) {
			try {
				WebElement app = driver.findElement(By.cssSelector("tr.app:nth-child(" + x + ")"));
				WebElement circle = app.findElement(By.cssSelector("td.circle:nth-child(" + index + ")"));
				int c = Integer.parseInt(circle.getAttribute("data-count"));
				collectedCol.add(c);
				x++;
			} catch (NoSuchElementException e) {
				try {
					WebElement app = driver.findElement(By.cssSelector("tr.app:nth-child(" + x + ")"));
					WebElement num = app.findElement(By.cssSelector("td.sectorStats:nth-child(" + index + ")"));
					int c = Integer.parseInt(num.getAttribute("data-count"));
					collectedCol.add(c);
					x++;
				} catch (NoSuchElementException ex) {
					break;
				}
			}
		}
		return collectedCol;
	}

	public ArrayList<Integer> collectApp(int index) {
		ArrayList<Integer> appList = new ArrayList<>();
		int x = 2;
		while (true) {
			try {
				WebElement app = driver.findElement(By.cssSelector("tr.app:nth-child(" + index + ")"));
				WebElement circle = app.findElement(By.cssSelector("td.circle:nth-child(" + x + ")"));
				int c = Integer.parseInt(circle.getAttribute("data-count"));
				appList.add(c);
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		return appList;
	}
	
	
	public void test(ArrayList<Integer> appList) throws InterruptedException {
		Thread.sleep(3000);
		String[] names = {"markup", "mvc", "rich", "web", "ejb", "http", "messaging", "other", 
				"rest", "webservice", "caching", "database", "database-driver", "object-mapping", 
				"persistence", "clustering", "logging", "security", "test", "transactions", "3rd-party",
				"integration", "ioc", "processing", "rules&processes"};
		String s = "div.box.box-techbox:" + names[1];
		WebElement mvc = driver.findElement(By.cssSelector(s));
		System.out.println(mvc);

	}
	

	public boolean sortTechHeader() {
		WebElement header = driver.findElement(By.cssSelector("thead"));
		WebElement body = driver.findElement(By.cssSelector("tbody"));

		ArrayList<Integer> col;
		ArrayList<Integer> sorted;
		ArrayList<Integer> collected;
		boolean working = false;
		int x = 2;
		while (true) {
			try {
				WebElement top = header.findElement(By.cssSelector("td.sector:nth-child(" + x + ")"));
				// descending
				top.click();
				col = collectColumn(x);
				sorted = sortIntDesc(col);
				collected = collectColumn(x);
				working = collected.equals(sorted);

				// ascending
				top.click();
				sorted = sortIntAsc(col);
				collected = collectColumn(x);
				working = collected.equals(sorted);

				System.out.println(top.getText() + ": " + working);
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		return working;
	}

	/**
	 * this will click on the first application on the technology page. Will
	 * redirect to a more specfic technology page
	 * 
	 * @return true if the technology has been found
	 * @throws InterruptedException
	 */
	public boolean clickTechApp() throws InterruptedException {

		WebElement body = (new WebDriverWait(driver, 5))
				.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("tbody")));
		WebElement app = body.findElement(By.cssSelector("tr.app:nth-child(1)"));
		WebElement name = app.findElement(By.cssSelector("a"));
		String asdf = name.getText();
		name.click();

		WebElement header = (new WebDriverWait(driver, 5)).until(
				ExpectedConditions.presenceOfElementLocated(By.cssSelector("div.page-header.page-header-no-border")));
		WebElement title = header.findElement(By.cssSelector("div.path"));
		if (title.getText().equals(asdf))
			return true;
		return false;
	}

	/**
	 * This method will click on the first maven coordinate found. It saves the
	 * coordinate and then clicks on they hyperlink, from that page it locates the
	 * searchbox, and collects the coordinate there, then compares the two.
	 * 
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
	 * once the driver has changed to the maven central repository tab, this will
	 * find the searchbox, and collect the information in it.
	 * 
	 * @param hash
	 *            is the link found on the Dependencies page
	 * @return true if the value in the searchbox matches the hash
	 * @throws AWTException
	 */
	public boolean mavenSearch(String hash) throws AWTException {
		WebElement search = (new WebDriverWait(driver, 20))
				.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input#mat-input-0")));
		//WebElement search = driver.findElement(By.cssSelector("input#mat-input-0"));
		String s = search.getAttribute("value");
		return s.equals(hash);
	}

	/**
	 * On the about page, this will go through the various links, and collects them
	 * as strings in an arraylist
	 * 
	 * @return an arraylist of links
	 */
	public ArrayList<String> getAboutLinks() {
		WebElement body = driver.findElement(By.cssSelector("div.panel-body"));
		ArrayList<String> links = new ArrayList<>();

		for (int x = 4; x < 19; x += 2) {
			WebElement link;
			if (x > 8) {
				link = body
						.findElement(By.cssSelector("dl.dl-horizontal:nth-child(2) > dd:nth-child(" + (x - 8) + ")"));
			} else {
				link = body.findElement(By.cssSelector("dd:nth-child(" + x + ")"));
			}
			WebElement l = link.findElement(By.cssSelector("a"));
			String href = l.getAttribute("href");
			links.add(href);
		}
		return links;
	}

	/**
	 * this finds the no or cancel button of the popup and clicks it
	 * 
	 * @throws InterruptedException
	 */
	public void closeFeedback() throws InterruptedException {
		WebElement dialogue = driver.findElement(By.cssSelector("iframe#atlwdg-frame"));
		driver.switchTo().frame(dialogue);

		WebElement cancel = (new WebDriverWait(driver, 5))
				.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a.cancel")));
		cancel.click();

		navigateTo(1);
	}

	/**
	 * this will have the driver switch to the send feedback frame of the page
	 */
	public void moveToFeedback() {
		WebElement dialogue = (new WebDriverWait(driver, 20))
				.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("iframe#atlwdg-frame")));
		driver.switchTo().frame(dialogue);
	}

	/**
	 * This will sort through the 5 rating radio buttons and click on the one
	 * specified
	 * 
	 * @param rating
	 *            is the suffix of the radiobutton's id. can either be "awesome",
	 *            "good", "meh", "bad", "horrible"
	 */
	public void selectFeedbackButton(String rating) {
		WebElement ratings = (new WebDriverWait(driver, 10))
				.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div#feedback-rating")));
		for (int x = 1; x < 6; x++) {
			try {
				WebElement button = ratings.findElement(By.cssSelector("input#rating-" + rating));
				button.click();

			} catch (NoSuchElementException e) {

			}
		}
	}

	/**
	 * With a given rating string, this will check if the selected button is the
	 * same as the param
	 * 
	 * @param rating
	 *            is the string of the feedback radio button id
	 * @return true if the param and the radio button match
	 */
	public boolean checkFeedbackButton(String rating) {
		WebElement ratings = driver.findElement(By.cssSelector("div#feedback-rating"));
		for (int x = 1; x < 6; x++) {
			try {
				WebElement button = ratings.findElement(By.cssSelector("input#rating-" + rating));
				return button.isSelected();
			} catch (NoSuchElementException e) {

			}
		}
		return false;
	}

	/**
	 * On the feedback page, when the submit button is clicked and the mandatory
	 * fields aren't filled in, this will check if the error messages are indeed
	 * present and makes sure that the message is correct.
	 * 
	 * @return true if the error is present and correct
	 */
	public boolean submitError() {
		// WebElement like = (new WebDriverWait(driver,
		// 15)).until(ExpectedConditions.presenceOfElementLocated(
		// By.cssSelector("(//*[@id='desc-group'])[1]")));
		WebElement like = driver.findElement(By.xpath("(//*[@id='desc-group'])[1]"));
		WebElement likeError = like.findElement(By.cssSelector("div.error"));
		WebElement improve = driver.findElement(By.xpath("(//*[@id='desc-group'])[2]"));
		WebElement improveError = improve.findElement(By.cssSelector("div.error"));

		String lError = likeError.getText();
		String iError = improveError.getText();

		if (lError.equals("Please provide an answer for: What do you like?")
				&& iError.equals("Please provide an answer for: What needs to be improved?"))
			return true;
		return false;
	}

	/**
	 * On the Feedback popup, this will populate the two textbox's with "Lorem
	 * Ipsum"
	 */
	public void populateTextBox() {
		WebElement like = driver.findElement(By.xpath("(//*[@id='desc-group'])[1]"));
		WebElement likeTextArea = like.findElement(By.cssSelector("textarea#description-good"));
		likeTextArea.sendKeys("Lorem Ipsum");

		WebElement improve = driver.findElement(By.xpath("(//*[@id='desc-group'])[2]"));
		WebElement improveTextArea = improve.findElement(By.cssSelector("textarea#description-bad"));
		improveTextArea.sendKeys("Lorem Ipsum");
	}

	/**
	 * In the Feedback popup, this will attach a file with the given path
	 * 
	 * @param path
	 *            is the path/to/file of the screenshot needed
	 */
	public void feedbackAttachFile(String path) {
		WebElement browse = driver.findElement(By.cssSelector("input#screenshot.file"));
		browse.sendKeys(path);
	}

	/**
	 * in the Feedback popup, this will find the "include data about your current
	 * environment" radiobutton and select it.
	 */
	public void feedbackIncludeCheck() {
		WebElement radioButton = driver.findElement(By.cssSelector("input#recordWebInfoConsent"));
		radioButton.click();
	}

	/**
	 * with a given name, this will populate the name field with the parameter
	 * 
	 * @param name
	 */
	public void feedbackPopulateName(String name) {
		WebElement nameDiv = driver.findElement(By.cssSelector("div#name-group"));
		WebElement input = nameDiv.findElement(By.cssSelector("input#fullname.text"));
		input.sendKeys(name);
	}

	/**
	 * with a given email, this will populate the email field with the parameter
	 * 
	 * @param email
	 */
	public void feedbackPopulateEmail(String email) {
		WebElement emailDiv = driver.findElement(By.cssSelector("div#email-group"));
		WebElement input = emailDiv.findElement(By.cssSelector("input#email.text"));
		input.sendKeys(email);
	}

	/**
	 * this finds the yes or confirm button of the popup and clicks it
	 */
	public void submitFeedback() {
		WebElement modalYes = (new WebDriverWait(driver, 5)).until(ExpectedConditions
				.presenceOfElementLocated(By.cssSelector("input.aui-button.aui-button-primary.submit-button")));
		modalYes.click();
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

	public void waitForTabLoad()
	{

		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("ul.nav.navbar-nav li.active")));

	}

}