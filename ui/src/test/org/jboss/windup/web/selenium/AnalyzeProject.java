package org.jboss.windup.web.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.StringSelection;
import java.awt.datatransfer.Transferable;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;

/**
 * 
 * @author elise
 *
 */

public class AnalyzeProject {

	private WebDriver driver;

	public AnalyzeProject() throws InterruptedException {
		// Create a new instance of the Firefox driver
		// Notice that the remainder of the code relies on the interface,
		// not the implementation.
		System.setProperty("webdriver.gecko.driver", "/usr/lib/node_modules/geckodriver/bin/geckodriver");

		FirefoxOptions options = new FirefoxOptions();
		options.setBinary("/usr/bin/firefox"); // Location where Firefox is installed
		driver = new FirefoxDriver(options);

		// opens up the browser
		driver.get("http://127.0.0.1:8080/");

		WebElement header = (new WebDriverWait(driver, 10))
				.until(ExpectedConditions.presenceOfElementLocated(By.id("header-logo")));

		navigateProject("test 2");
		clickAnalysisReport(1);
		Thread.sleep(5000);
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

	public String headerTitle() {
		return driver.getTitle();
	}

	public void navigateTo(int index) {
		ArrayList tabs = new ArrayList(driver.getWindowHandles());
		driver.switchTo().window((String) tabs.get(index));

		driver.switchTo().defaultContent();
	}

	public void goBack() {
		driver.navigate().back();
	}

	public boolean navigateProject(String projName) {
		// driver.navigate().to("http://127.0.0.1:8080/rhamt-web/project-list");
		int x = 1;
		while (true) {
			try {
				WebElement proj = driver
						.findElement(By.xpath("(//*[@class='list-group-item  project-info  tile-click'])[" + x + "]"));
				// String xpath =
				// "/html/body/windup-app/ng-component/div/div[2]/ng-component/div/div[2]/div["
				// + x + "]/div[2]/div/div/div[1]/a";
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

	public String pageTitle() {
		WebElement title = driver.findElement(By.cssSelector("div.main"));
		return title.getText();
	}

	public void switchTab(int index) {
		WebElement tabs = driver.findElement(By.cssSelector("ul.nav.navbar-nav"));
		WebElement tab = tabs.findElement(By.cssSelector("li:nth-child(" + index + ")"));
		tab.click();
	}

	public String listApplications() {
		WebElement appList = driver.findElement(By.cssSelector(".real"));
		String list = "";

//		for (int x = 1; x < 3; x++) {
//			WebElement title = appList.findElement(By.xpath("(//*[@class='fileName'])[" + x + "]"));
//			list += title.getText() + ", ";
//		}

		int x = 1;
		while (true) {
			try {
				WebElement app = appList.findElement(By.xpath("(//*[@class='appInfo pointsShared0'])[" + x + "]"));
				WebElement title = app.findElement(By.xpath("(//*[@class='fileName'])[" + x + "]"));
				if (title.getText().equals("Archives shared by multiple applications")) {
					return list;
				}
				else if(!app.getAttribute("style").equals("display: none;")) {
					list += title.getText() + ";";
				}
				x++;
			} catch (NoSuchElementException e) {
				return list;
			}
		}
	}

	public boolean sortApplicationList(String sortOrder, boolean ascending) {
		WebElement sorts = driver.findElement(By.cssSelector("div#sort.form-group"));
		WebElement sortDropdown = sorts.findElement(By.cssSelector("button.btn.btn-default.dropdown-toggle"));
		sortDropdown.click();
		WebElement menu = sorts.findElement(By.className("dropdown-menu"));
		int x = 1;
		while (true) {
			try {
				WebElement option = menu.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				if (option.getText().equals(sortOrder)) {
					option.click();
				}
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}

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

	public void nameFilterAppList(String name, String nameFilter) throws AWTException {
		WebElement filter = driver.findElement(By.cssSelector("div#filter-div.form-group.toolbar-pf-filter"));
		WebElement dropDown = filter.findElement(By.cssSelector("button.btn.btn-default.dropdown-toggle"));
		dropDown.click();
		WebElement menu = filter.findElement(By.className("dropdown-menu"));
		int x = 1;
		while (true) {
			try {
				WebElement option = menu.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				if (option.getText().equals(name)) {
					option.click();
				}
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}

		WebElement search = driver.findElement(By.cssSelector("input#filter.form-control"));
		search.sendKeys(nameFilter);

		Robot r = new Robot();
		r.keyPress(KeyEvent.VK_ENTER);
		r.keyRelease(KeyEvent.VK_ENTER);

	}

	public void changeRelationship(String s) {
		WebElement filterType = driver.findElement(By.cssSelector("div#filter-type"));
		WebElement button = filterType.findElement(By.cssSelector("button.btn.btn-default.dropdown-toggle"));
		button.click();

		WebElement menu = filterType.findElement(By.className("dropdown-menu"));
		int x = 1;
		while (true) {
			try {
				WebElement option = menu.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				if (option.getText().equals(s)) {
					option.click();
				}
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}

		// dropDown(filterType, s);
	}

	public void clearFilters() {
		WebElement clear = driver.findElement(By.cssSelector("a#clear-filters"));
		clear.click();

	}

	public boolean deleteFilter(String s) {
		WebElement activeFilters = driver.findElement(By.cssSelector("ul#active-filters"));
		int x = 1;
		while (true) {
			try {
				WebElement filter = activeFilters.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				if (filter.getText().equals("Tags: " + s)) {
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

	public void dropDown(WebElement f, String name) {
		WebElement dropDown = f.findElement(By.cssSelector("button.btn.btn-default.dropdown-toggle"));
		dropDown.click();
		WebElement menu = f.findElement(By.className("dropdown-menu"));
		int x = 1;
		while (true) {
			try {
				WebElement option = menu.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				if (option.getText().equals(name)) {
					option.click();
				}
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
	}

	public String allIssuesReport() {
		int x = 1;
		String s = "";
		while (true) {
			try {
				WebElement table = driver.findElement(By.xpath(
						"(//*[@class='table table-bordered table-condensed tablesorter migration-issues-table tablesorter-default'])["
								+ x + "]"));

				WebElement title = table.findElement(By.cssSelector("td:nth-child(1)"));
				s += title.getText() + ", ";
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		return s;

	}

	public boolean sortAllIssues() {

		Boolean working = false;
		int x = 1;

		while (true) {
			try {
				WebElement table = driver.findElement(By.xpath(
						"(//*[@class='table table-bordered table-condensed tablesorter migration-issues-table tablesorter-default'])["
								+ x + "]"));
				WebElement title = table.findElement(By.cssSelector("tr.tablesorter-ignoreRow"));
				System.out.println(title.getText());
				WebElement sortRow = table.findElement(By.cssSelector("tr.tablesorter-headerRow"));
				WebElement body = table.findElement(By.cssSelector("tbody"));
				System.out.println(body.getText());

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
								ArrayList<String> autoSort = sortBodyAsc(preSort);

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
								ArrayList<String> autoSort = sortBodyDesc(preSort);

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
								ArrayList<Integer> autoSort = sortBodyAsc(preSort);

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
								ArrayList<Integer> autoSort = sortBodyDescInt(preSort);
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

	private ArrayList<String> collectBody(WebElement body) {

		ArrayList<String> list = new ArrayList<String>();
		int x = 1;
		while (true) {
			try {
				WebElement file = body.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				WebElement attribute = file.findElement(By.cssSelector("td:nth-child(1)"));
				list.add(attribute.getText());

				x += 2;
			} catch (NoSuchElementException e) {
				break;
			}
		}

		return list;
	}

	private ArrayList<Integer> collectBody(WebElement body, int numberCompare) {

		ArrayList<Integer> list = new ArrayList<Integer>();

		int x = 1;
		while (true) {
			try {
				WebElement file = body.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				WebElement attribute = file.findElement(By.cssSelector("td:nth-child(" + numberCompare + ")"));
				list.add(Integer.valueOf(attribute.getText()));

				x += 2;
			} catch (NoSuchElementException e) {
				break;
			}
		}

		return list;
	}

	private ArrayList sortBodyAsc(ArrayList list) {

		ArrayList sorted = list;
		Collections.sort(sorted);
		return sorted;
	}

	private ArrayList<String> sortBodyDesc(ArrayList<String> list) {

		ArrayList<String> sorted = list;
		Collections.sort(sorted, Collections.reverseOrder());
		return sorted;
	}

	private ArrayList<Integer> sortBodyDescInt(ArrayList<Integer> list) {

		ArrayList<Integer> sorted = list;
		Collections.sort(sorted, Collections.reverseOrder());
		return sorted;
	}

	public boolean clickFirstIssue() {
		WebElement table = driver.findElement(By.xpath(
				"(//*[@class='table table-bordered table-condensed tablesorter migration-issues-table tablesorter-default'])[1]"));
		WebElement body = table.findElement(By.cssSelector("tbody"));
		WebElement issue = body.findElement(By.cssSelector("tr:nth-child(1)"));
		WebElement link = body.findElement(By.cssSelector("a.toggle"));

		WebElement tIncidents = issue.findElement(By.cssSelector("td:nth-child(2)"));
		int totalIncidents = Integer.valueOf(tIncidents.getText());

		link.click();

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
					if (!textBox.getCssValue("background-color").equals("rgb(255, 252, 220)")) {
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

	public void clickShowRule() {

		WebElement table = driver.findElement(By.xpath(
				"(//*[@class='table table-bordered table-condensed tablesorter migration-issues-table tablesorter-default'])[1]"));
		WebElement body = table.findElement(By.cssSelector("tbody"));
		WebElement fileExpanded = body.findElement(By.cssSelector("tr:nth-child(2)"));
		body = fileExpanded.findElement(By.cssSelector("tbody"));
		WebElement showRule = body.findElement(By.cssSelector("a.sh_url"));
		String rule = showRule.getCssValue("title");
		showRule.click();

	}

	public boolean showRuleVisible() {

		WebElement table = driver.findElement(By.xpath(
				"(//*[@class='table table-bordered table-condensed tablesorter migration-issues-table tablesorter-default'])[1]"));
		WebElement body = table.findElement(By.cssSelector("tbody"));
		WebElement fileExpanded = body.findElement(By.xpath("/html/body/div[2]/div[2]/div/table[1]/tbody/tr[2]/td"));
		return fileExpanded.isDisplayed();
	}

	public boolean techApps() {
		WebElement body = driver.findElement(By.cssSelector("tbody"));
		int x = 1;
		ArrayList<String> apps = new ArrayList<String>();
		while (true) {
			try {
				WebElement app = body.findElement(By.cssSelector("tr.app:nth-child(" + x + ")"));
				apps.add(app.getText());
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
		ArrayList<String> hold = apps;
		ArrayList<String> sorted = sortBodyAsc(apps);
		if (hold.equals(sorted))
			return true;
		return false;
	}

	public boolean clickTechApp() throws InterruptedException {

		WebElement body = driver.findElement(By.cssSelector("tbody"));
		WebElement app = body.findElement(By.cssSelector("tr.app:nth-child(1)"));
		WebElement name = app.findElement(By.cssSelector("a"));
		String asdf = name.getText();
		name.click();

		Thread.sleep(500);
		WebElement header = driver.findElement(By.cssSelector("div.page-header.page-header-no-border"));
		WebElement title = header.findElement(By.cssSelector("div.path"));
		if (title.getText().equals(asdf))
			return true;
		return false;
	}

	public String clickMavenCoord() {
		WebElement dependencies = driver.findElement(By.className("dependencies"));
		int x = 1;
		while (true) {
			try {
				WebElement dep = dependencies.findElement(By.cssSelector("div.panel:nth-child(" + x + ")"));
				WebElement firstTrait = dep.findElement(By.cssSelector("dt:nth-child(1)"));
				if (firstTrait.getText().equals("Maven coordinates:")) {
					WebElement hash = dep
							.findElement(By.xpath("//*[@id='AdditionWithSecurity-Service-0.01.war-hash']"));
					String shaHash = hash.getText();

					System.out.println(x);
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
	// *[@id="AdditionWithSecurity-Service-0.01.war-hash"]

	// does not currently work
	public boolean mavenSearch(String hash) throws AWTException {
		WebElement search = driver.findElement(By.cssSelector("input#query"));
		String s = search.getAttribute("value");

		return s.equals(hash);

	}

	public void clickSendFeedback() throws InterruptedException {
		WebElement feedback = driver.findElement(By.cssSelector("ul.nav.navbar-nav.navbar-right"));
		feedback.click();
		Thread.sleep(5000);
	}

	public ArrayList<String> getAboutLinks() {
		WebElement body = driver.findElement(By.cssSelector("div.panel-body"));
		ArrayList<String> links = new ArrayList<String>();

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
	 * whenever a popup is shown (such as deleteing a file or submitting before
	 * packages load) it returns the title, then text shown
	 * 
	 * @return
	 */
	public String popupInfo() {
		WebElement modalTitle = driver.findElement(By.cssSelector("h1.modal-title"));
		WebElement modalBody = driver.findElement(By.cssSelector("div.modal-body"));
		return modalTitle.getText() + ";" + modalBody.getText();
	}

	/**
	 * this finds the no or cancel button of the popup and clicks it
	 */
	public void closeFeedback() {
		WebElement dialogue = driver.findElement(By.cssSelector("iframe#atlwdg-frame"));
		driver.switchTo().frame(dialogue);

		WebElement cancel = driver.findElement(By.cssSelector("a.cancel"));
		cancel.click();

		navigateTo(1);
	}
	
	public void moveToFeedback() {
		WebElement dialogue = driver.findElement(By.cssSelector("iframe#atlwdg-frame"));
		driver.switchTo().frame(dialogue);
	}

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

	public boolean submitError() {
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
	
	public void populateTextBox() {
		WebElement like = driver.findElement(By.xpath("(//*[@id='desc-group'])[1]"));
		WebElement likeTextarea = like.findElement(By.cssSelector("textarea#description-good"));
		likeTextarea.sendKeys("Lorem Ipsum");
		
		WebElement improve = driver.findElement(By.xpath("(//*[@id='desc-group'])[2]"));
		WebElement improveTextarea = improve.findElement(By.cssSelector("textarea#description-bad"));
		improveTextarea.sendKeys("Lorem Ipsum");
	}
	
	public void feedbackAttachFile() {
		WebElement attachFile = driver.findElement(By.cssSelector("fieldset.group"));
		WebElement browse = driver.findElement(By.cssSelector("input#screenshot.file"));
		String path = "/home/elise/Pictures/RHAMT-WebUI_Screenshot.png";
		browse.sendKeys(path);
	}
	
	public void feedbackIncludeCheck() {
		WebElement includeData = driver.findElement(By.cssSelector("div#record-web-info-consent-container"));
		WebElement radioButton  = driver.findElement(By.cssSelector("input#recordWebInfoConsent"));
		radioButton.click();
	}
	
	public void feedbackPopulateName(String name) {
		WebElement nameDiv = driver.findElement(By.cssSelector("div#name-group"));
		WebElement input = nameDiv.findElement(By.cssSelector("input#fullname.text"));
		input.sendKeys(name);
	}
	
	public void feedbackPopulateEmail(String email) {
		WebElement emailDiv = driver.findElement(By.cssSelector("div#email-group"));
		WebElement input = emailDiv.findElement(By.cssSelector("input#email.text"));
		input.sendKeys(email);
	}

	/**
	 * this finds the yes or confirm button of the popup and clicks it
	 */
	public void submitFeedback() {
		WebElement modalYes = driver.findElement(By.cssSelector("input.aui-button.aui-button-primary.submit-button"));
		modalYes.click();
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

	public String clickAnalysisReport(int index) {
		String xpath = "(//*[@class='success'])[" + index + "]";
		WebElement result = driver.findElement(By.xpath(xpath));

		xpath = "(//*[@class='pointer link'])[2]";
		WebElement report = result.findElement(By.xpath(xpath));
		String url = report.getAttribute("href");

		report.click();

		return url;
	}

	public void search(String searchParam) {
		WebElement searchBox = driver
				.findElement(By.cssSelector("input.form-control.ng-untouched.ng-pristine.ng-valid"));
		searchBox.sendKeys(searchParam);
	}

	public void cancelSearch() {
		WebElement clear = driver.findElement(By.cssSelector("button.clear"));
		clear.click();
	}

	/**
	 * closes the browser
	 */
	public void closeDriver() {
		driver.quit();
	}

}