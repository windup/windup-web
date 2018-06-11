package org.jboss.windup.web.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.By.ByClassName;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
//import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.firefox.GeckoDriverService;
import org.openqa.selenium.Alert;
import com.google.common.base.Preconditions;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.io.File;
import java.util.ArrayList;
import java.util.logging.Level;

/**
 * this code is intended for a RHAMT web application that does not have any
 * pre-made projects
 * 
 * @author elise
 *
 */

public class EditProject {

	private WebDriver driver;

	public EditProject() {
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
	

	public void navigateTo(String url) {
		//driver.navigate().to(url);
		
		ArrayList tabs = new ArrayList(driver.getWindowHandles());
		System.out.println(tabs.size());
		driver.switchTo().window((String)tabs.get(1));
		
		
		driver.switchTo().defaultContent();
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

	/**
	 * depending on the index, it returns the file information and colour
	 * 
	 * @param index
	 *            starts at 1
	 * @return the file information, a colon, then the rgb colour
	 */
	public String checkFileInfo(int index) {
		String xpath = "(//*[@class='progress-bar success'])[" + index + "]";
		// have to wait a bit for the file to upload
		WebElement file = (new WebDriverWait(driver, 5))
				.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpath)));

		xpath = "(//*[@class='file-info'])[" + index + "]";
		WebElement fileInfo = driver.findElement(By.xpath(xpath));

		return fileInfo.getText() + ":" + file.getCssValue("background-color");
	}

	/**
	 * checks if the file at the given index is not there
	 * 
	 * @param index
	 *            starts at 1
	 * @return true if the file is not there
	 */
	public boolean checkForEmptyFile(int index) {
		String xpath = "(//*[@class='progress-bar success'])[" + index + "]";
		try {
			WebElement file = driver.findElement(By.xpath(xpath));
		} catch (NoSuchElementException e) {
			return true;
		}
		return false;
	}

	/**
	 * depending on the index, it finds that file's delete button and clicks it
	 * 
	 * @param index
	 *            starts at 1
	 */
	public void deleteFile(int index) {
		String xpath = "(//span[@class='pointer'])[" + index + "]";
		WebElement delete = driver.findElement(By.xpath(xpath));
		delete.click();
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
	public void deletePopup() {
		WebElement modalNo = driver.findElement(By.cssSelector("button.cancel-button.btn.btn-lg.btn-default"));
		modalNo.click();
	}

	/**
	 * this finds the yes or confirm button of the popup and clicks it
	 */
	public void acceptPopup() {
		WebElement modalYes = driver.findElement(By.cssSelector("button.confirm-button.btn.btn-lg.btn-danger"));
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

	/**
	 * this goes through the three possible paths to migrate to. When the page is
	 * new, "JBoss EPA 7" should be selected, and if another option is selected and
	 * this method is run again then it should return the string value of that
	 * option. "None are selected" should never be returned
	 * 
	 * @return the chosen migration path
	 */
	public String transformationPath() {
		for (int i = 1; i < 4; i++) {
			String xpath = "(//*[@id='migrationPath'])[" + i + "]";
			WebElement radioButton = driver.findElement(By.xpath(xpath));
			if (radioButton.isSelected()) {
				xpath = "(//*[@class='radio-inline control-label'])[" + i + "]";
				WebElement path = driver.findElement(By.xpath(xpath));
				return path.getText();
			}
		}
		return "None are selected";
	}

	/**
	 * 
	 * @param index
	 *            starts at 1
	 */
	public void chooseTransformationPath(int index) {
		String xpath = "(//*[@id='migrationPath'])[" + index + "]";
		WebElement radioButton = driver.findElement(By.xpath(xpath));
		radioButton.click();
	}

	/**
	 * This waits a few moment for it takes a while for the packages to load, then
	 * finds the container for the package links, and returns a string of a list of
	 * the tier 1 packages
	 * 
	 * @return
	 * @throws InterruptedException
	 */
	public String findPackages() throws InterruptedException {
		String xpath = "//*[@class='jstree-container-ul jstree-children']";
		Thread.sleep(5000);
		WebElement packageList = driver.findElement(By.xpath(xpath));
		return packageList.getText();
	}

	/**
	 * This goes through the three collapsed dialogues at the bottom of the analysis
	 * configuration screen, confirms they are collapsed by ending in
	 * "fa-angle-right" (if "-angle-down" is added to the back of that then it is
	 * expanded) It then checks the text in each dialogue to the string array
	 * created first to check that they are all in order.
	 * 
	 * @return true if the dialogues are in order and collapsed
	 */
	public boolean collapesdInfo() {
		boolean b = false;
		String[] collapsedList = { "Exclude packages", "Use custom rules", "Advanced options" };
		for (int i = 1; i < 4; i++) {
			String xpath = "(//*[@class='fields-section-header-pf'])[" + i + "]";
			WebElement collapsedDialogues = driver.findElement(By.xpath(xpath));
			try {
				WebElement collapse = collapsedDialogues.findElement(By.cssSelector("span[class$='fa-angle-right']"));
				if (collapsedList[i - 1].equals(collapsedDialogues.getText())) {
					b = true;
				}
			} catch (NoSuchElementException e) {
				return false;
			}
		}
		return b;
	}

	/**
	 * this clicks the "save and run" button that will save the project information
	 * and redirect the user to the reports/analysis page
	 */
	public void saveAndRun() {
		WebElement runButton = driver.findElement(By.cssSelector("button.btn.btn-primary.btn-save-run"));
		runButton.click();
	}

	/**
	 * This method should be run right after redirecting to the reports/analysis
	 * page because it gives about 15 seconds for the progress bar to load. It looks
	 * for the div that holds the changing information for the progress bar If after
	 * the 15 seconds have ended and the method has found the div, then true is
	 * returned.
	 * 
	 * Due to the method occasionally failing, checkProgressBar() is a recursive
	 * method that catches the div if the error is thrown and tries again so the
	 * user can choose how many times they want it to run.
	 * 
	 * @param x
	 *            is the number of times to run the method if it fails (must start
	 *            at a number greater than 0)
	 * @return true if the progress bar div is found
	 * @throws InterruptedException
	 */
	public boolean checkProgressBar(int x) throws InterruptedException {
		String xpath = "/html/body/windup-app/ng-component/div/div[2]/ng-component/wu-executions-list/div/wu-active-executions-progressbar/div/div/wu-progress-bar";

		System.out.println("Try: " + x);
		if (x == 0) {
			return false;
		}
		WebElement progBar;
		// = driver.findElement(By.xpath(
		// "/html/body/windup-app/ng-component/div/div[2]/ng-component/wu-executions-list/div/wu-active-executions-progressbar/div/div"));
		// String text = progBar.getText();
		String text = "";
		try {
			progBar = (new WebDriverWait(driver, 15))
					.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpath)));
			text = progBar.getText();
			System.out.println(text);
		} catch (StaleElementReferenceException e) {
			System.out.println("FAIL: " + x);
			checkProgressBar(x - 1);
		}

		System.out.println(text);
		if (text.equals("There is no active analysis.")) {
			return false;
		}
		return true;
	}

	/**
	 * When the reports are run (must be after it has sucessfully ran) this will
	 * find the Analysis Configuration link and click it. Should redirect to an
	 * Analysis Configuration page
	 */
	public void clickAnalysisConfiguration() {
		String xpath = "/html/body/windup-app/ng-component/wu-context-menu/div/ul/li[3]";
		WebElement analysisConfig = driver.findElement(By.xpath(xpath));
		analysisConfig.click();
	}

	public void clickApplications() {
		String xpath = "/html/body/windup-app/ng-component/wu-context-menu/div/ul/li[2]";
		WebElement applications = driver.findElement(By.xpath(xpath));
		applications.click();
	}

	/**
	 * will delete an application in the Analysis Configuration page. Note: they are
	 * now ordered in alphabetical order, check what order the applications are in
	 * first to determine the proper index
	 * 
	 * @param index
	 *            starts at 1
	 */
	public void deleteSelectedApplication(int index) {

		String xpath = "(//*[@class='search-choice'])[" + index + "]";
		WebElement application = driver.findElement(By.xpath(xpath));
		WebElement delete = application.findElement(By.className("search-choice-close"));
		delete.click();

	}

	/**
	 * This will go through the applications selected for the report and prints them
	 * out in string form.
	 * 
	 * @return a string version of the applications.
	 */
	public String printSelectedApplications() {
		WebElement selectedApplications = driver.findElement(By.cssSelector("ul.chosen-choices"));
		return selectedApplications.getText();
	}

	/**
	 * This will go down the Analysis Results section, select each analysis and
	 * check that they have a "show reports" and "delete" button available. If they
	 * are both present, then true is returned
	 * 
	 * @param numOfAnalysis
	 *            denotes how many results there are to go through
	 * @return true if all results have the "show reports" and "delete" actions
	 */
	public boolean analysisResultsComplete(int numOfAnalysis) {
		String xpath = "";
		for (int x = 1; x <= numOfAnalysis; x++) {
			xpath = "(//*[@class='success'])[" + numOfAnalysis + "]";
			WebElement result = driver.findElement(By.xpath(xpath));

			try {
				xpath = "(//*[@class='pointer link'])[1]";
				WebElement report = result.findElement(By.xpath(xpath));
				xpath = "(//*[@class='pointer link'])[2]";
				WebElement delete = result.findElement(By.xpath(xpath));
				return true;
			} catch (NoSuchElementException e) {
				return false;
			}
		}
		return false;
	}

	public void deleteAnalysisResults(int index) {
		String xpath = "(//*[@class='success'])[" + index + "]";
		WebElement result = driver.findElement(By.xpath(xpath));
		xpath = "(//*[@class='pointer link'])[3]";
		WebElement delete = result.findElement(By.xpath(xpath));
		System.out.println("Should delete");
		delete.click();
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
	
	
	public int analysisResultsShown() {
		int x = 1;
		while (true) {
			try {
				String xpath = "(//*[@class='success'])[" + x + "]";
				WebElement result = driver.findElement(By.xpath(xpath));
				x++;
			} catch (NoSuchElementException e) {
				return x - 1;
			}
		}
	}

	public String analysisResultsOrder() {
		String order = "";
		int x = 1;
		while (true) {
			try {
				String xpath = "(//*[@class='success'])[" + x + "]";
				WebElement result = driver.findElement(By.xpath(xpath));
				WebElement num = result.findElement(By.cssSelector("td:nth-child(1)"));
				order += num.getText() + ", ";
				x++;
			} catch (NoSuchElementException e) {
				return order;
			}
		}
	}

	public void analysisResultsSort(String sortParam) {
		WebElement sortBar = driver.findElement(By.xpath(
				"/html/body/windup-app/ng-component/div/div[2]/ng-component/wu-executions-list/div/wu-all-data-filtered-message/table/thead"));
		int x = 1;
		while (true) {
			try {
				WebElement sort = sortBar.findElement(By.xpath(
						"/html/body/windup-app/ng-component/div/div[2]/ng-component/wu-executions-list/div/wu-all-data-filtered-message/table/thead/tr/th["
								+ x + "]"));
				if (sort.getText().equals(sortParam)) {
					sort.click();
				}
				x++;
				continue;
			} catch (NoSuchElementException e) {
				break;
			}
		}
	}

	public String applicationsOrder() {
		// 1]
		String order = "";
		int x = 1;
		while (true) {
			try {
				String xpath = "/html/body/windup-app/ng-component/div/div[2]/ng-component/div/wu-all-data-filtered-message/table/tbody/tr["
						+ x + "]";
				WebElement result = driver.findElement(By.xpath(xpath));
				WebElement num = result.findElement(By.cssSelector("td:nth-child(1)"));
				order += num.getText() + ", ";
				x++;
			} catch (NoSuchElementException e) {
				return order;
			}
		}
	}

	public void applicationsSort(String sortParam) {
		WebElement sortBar = driver.findElement(By.xpath(
				"/html/body/windup-app/ng-component/div/div[2]/ng-component/div/wu-all-data-filtered-message/table/thead"));
		int x = 1;
		while (true) {
			try {
				WebElement sort = sortBar.findElement(By.xpath(
						"/html/body/windup-app/ng-component/div/div[2]/ng-component/div/wu-all-data-filtered-message/table/thead/tr/th["
								+ x + "]"));
				if (sort.getText().equals(sortParam)) {
					sort.click();
				}
				x++;
				continue;
			} catch (NoSuchElementException e) {
				break;
			}
		}
	}

	public void deleteApplication(int index) {
		String xpath = "/html/body/windup-app/ng-component/div/div[2]/ng-component/div/wu-all-data-filtered-message/table/tbody/tr["
				+ index + "]";
		WebElement result = driver.findElement(By.xpath(xpath));
		System.out.println("Found first");
		WebElement delete = result.findElement(By.cssSelector("span.fa-lg.action-item"));
		delete.click();
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

	public void clickProjectsIcon() {
		WebElement projectIcon = driver.findElement(By.className("home"));
		projectIcon.click();
	}

	public String dropDownInfo() {
		WebElement dropDown = driver.findElement(By.className("dropdown-toggle"));
		return dropDown.getText();
	}

	public void clickProjDropDown(String projName) {
		WebElement dropDown = driver.findElement(By.className("dropdown-toggle"));
		dropDown.click();
		WebElement menu = driver.findElement(By.cssSelector("ul.dropdown-menu"));
		int x = 1;
		while (true) {
			try {
				WebElement proj = menu.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				
				if (proj.getText().equals(projName)) {
					proj.click();
					break;
				}
				x++;
				continue;
			} 
			catch (NoSuchElementException e) {
				break;
			}
		}

	}

	// no file drop method

	/**
	 * This method will navigate the user to the project-list page, locate the
	 * delete button for the first project in the list, click it, then deal with the
	 * popup dialogue box.
	 */
	public void deleteProject(int index, String projName) {
		driver.navigate().to("http://127.0.0.1:8080/rhamt-web/project-list");
		WebElement trash = (new WebDriverWait(driver, 10)).until(ExpectedConditions.presenceOfElementLocated(
				By.xpath("(//*[@class='action-button action-delete-project'])[" + index + "]")));
		trash.click();
		WebElement authInput = (new WebDriverWait(driver, 5)).until(ExpectedConditions.presenceOfElementLocated(
				By.cssSelector("input#resource-to-delete.form-control.input-lg.ng-untouched.ng-pristine.ng-valid")));
		authInput.sendKeys(projName);
		WebElement delete = driver.findElement(By.cssSelector("button.confirm-button.btn.btn-lg.btn-danger"));
		delete.click();
	}

	/**
	 * closes the browser
	 */
	public void closeDriver() {
		driver.quit();
	}

}