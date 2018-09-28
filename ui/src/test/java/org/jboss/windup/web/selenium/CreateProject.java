package org.jboss.windup.web.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * this code is intended for a RHAMT web application that does not have any
 * pre-made projects
 * 
 * @author elise
 *
 */
public class CreateProject extends CommonProject {

	private WebElement projButton;
	private WebElement nameInput;
	private WebElement descInput;
	private WebElement cancel;
	private WebElement next;
	private WebElement chooseFiles;
	private WebElement fileUpload;
	private WebElement checkbox;

	public CreateProject() {

		WebDriverWait wait = new WebDriverWait(driver, 15);
		wait.until(ExpectedConditions.presenceOfElementLocated(By.id("header-logo")));
	}

	/**
	 * clicks the new project button This is when there are no other projects in the
	 * project list should re-direct to
	 * http://127.0.0.1:8080/rhamt-web/wizard/create-project
	 */
	public void clickNewProjButton() {
		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(ExpectedConditions.elementToBeClickable(By.className("blank-slate-pf-main-action")));
		projButton = driver.findElement(By.className("blank-slate-pf-main-action"));
		projButton.click();
	}

	/**
	 * clicks the new project button This is for when there are already other
	 * projects in the project list should re-direct to
	 * http://127.0.0.1:8080/rhamt-web/wizard/create-project
	 */
	public void clickProjButton() {
		projButton = driver.findElement(By.cssSelector("button.btn.btn-primary"));
		projButton.click();
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
	 * clicks cancel (should work on every page) PRECONDITION: must call
	 * cancelEnabled() first should redirect to the previous page (can be checked by
	 * checkURL())
	 */
	public void clickCancel() {
		cancel.click();
	}

	/**
	 * checks if the cancel button on the page is enabled in all situations this
	 * should return true
	 * 
	 * @return true if it is enabled
	 */
	public boolean cancelEnabled() {
		cancel = driver.findElement(By.cssSelector("button.btn.btn-default"));
		return cancel.isEnabled();
	}

	/**
	 * clicks next (should work on every page) PRECONDITION: must call nextEnabled()
	 * first should redirect to the next page (can be checked by checkURL())
	 */
	public void clickNext() {
		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(
				ExpectedConditions.and(
						ExpectedConditions.elementToBeClickable(next),
						ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".modal-backdrop"))));
		next.click();
	}

	/**
	 * checks if the cancel button on the page is enabled in all situations this
	 * should return true
	 * 
	 * @return true if it is enabled
	 */
	public boolean nextEnabled() {
		next = driver.findElement(By.cssSelector("button.btn.btn-primary"));
		return next.isEnabled();

	}

	/**
	 * Selenium will not recognise the input project name slot as being selected
	 * Therefore this only checks that when the page is loaded, a untouched version
	 * of the input box is shown, if it is not there in that form then it returns
	 * false
	 * 
	 * @return
	 */
	public boolean nameInputSelected() {
		try {
			nameInput = driver.findElement(
					By.cssSelector("input#idProjectTitle.form-control.ng-pristine.ng-invalid.ng-untouched"));

		} catch (NoSuchElementException e) {
			return false;
		}
		return true;
	}

	/**
	 * sends a string to the input project name box
	 * 
	 * @param s
	 */
	public void inputProjName(String s) {
		nameInput = driver.findElement(By.cssSelector("input#idProjectTitle"));
		nameInput.sendKeys(s);
	}

	/**
	 * clears any characters in the input box
	 */
	public void clearProjName() {
		nameInput.clear();
		nameInput.sendKeys(" ");
		nameInput.clear();
		WebElement clickOut = driver.findElement(By.className("form-group"));
		clickOut.click();
	}

	/**
	 * inputs a project description
	 * 
	 * @param s
	 *            is the description
	 */
	public void inputProjDesc(String s) {
		descInput = driver.findElement(By.cssSelector("textarea#idDescription"));
		descInput.sendKeys(s);
	}

	/**
	 * clears any characters in the project description box
	 */
	public void clearProjDesc() {
		descInput.clear();
		descInput.sendKeys("");
	}

	/**
	 * on the Add Applications page, this returns what the active panel is Should
	 * return "Upload"
	 * 
	 * @return the name of the current active pannel
	 */
	public String activePanel() {
		WebElement addAppActive = (new WebDriverWait(driver, 5))
				.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("li[class^='active']")));
		return addAppActive.getText();
	}

	/**
	 * clicks on the "choose files" button, will invoke the "upload files" popup
	 */
	public void clickChooseFiles() {
		chooseFiles = driver.findElement(By.cssSelector("label.btn.btn-primary.upload-button"));
		chooseFiles.click();
	}

	/**
	 * given that the "upload files" popup is not part of the html, a robot has to
	 * close it.
	 * 
	 * @throws AWTException
	 */
	public void robotCancel() throws AWTException {
		Robot r = new Robot();
		r.keyPress(KeyEvent.VK_ESCAPE);
		r.keyRelease(KeyEvent.VK_ESCAPE);
	}

	/**
	 * the robot inputs the path/to/file string into the "upload files" popup then
	 * closes the upload files popup. The file should have loaded
	 * 
	 * @param s
	 *            the path/to/file
	 * @throws AWTException
	 */
	public void robotSelectFile(String s) throws AWTException {
		Robot r = new Robot();
		fileUpload = (new WebDriverWait(driver, 5))
				.until(ExpectedConditions.presenceOfElementLocated(By.id("fileUpload")));
		fileUpload.sendKeys(s);
	}

	/**
	 * checks if there are any files loaded onto the screen
	 * 
	 * @return true if there are no files shown
	 */
	public boolean voidFile() {
		WebElement fileBar = driver.findElement(By.className("col-md-12"));
		return fileBar.getText().equals("");

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
		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(
				ExpectedConditions.and(
						ExpectedConditions.elementToBeClickable(By.xpath(xpath)),
						ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".modal-backdrop"))));
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

		WebElement modalTitle = (new WebDriverWait(driver, 5)).until(ExpectedConditions.visibilityOfElementLocated(
				By.cssSelector("h1.modal-title")));
		WebElement modalBody = (new WebDriverWait(driver, 5)).until(ExpectedConditions.visibilityOfElementLocated(
				By.cssSelector("div.modal-body")));
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
		WebElement modalYes = (new WebDriverWait(driver, 5)).until(ExpectedConditions.elementToBeClickable(
			By.cssSelector("button.confirm-button.btn.btn-lg.btn-danger")));
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
			WebElement radioButton = (new WebDriverWait(driver, 5)).until(ExpectedConditions.presenceOfElementLocated(
					By.xpath(xpath)));
			
			if (radioButton.isSelected()) {
				xpath = "(//*[@class='radio-inline control-label'])[" + i + "]";
				WebElement path = driver.findElement(By.xpath(xpath));
				return path.getText();
			}
		}
		return "None are selected";
	}

	/**
	 * with a given index, this will click on the transformation path
	 * @param index starts at 1
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
		WebElement packageList = (new WebDriverWait(driver, 15)).until(ExpectedConditions.presenceOfElementLocated(
				By.cssSelector("ul.jstree-container-ul.jstree-children")));
		try {
			WebElement leaf = packageList.findElement(By.cssSelector("li:nth-child(1)"));
			
		}
		catch (NoSuchElementException e) {
			Thread.sleep(1000);
			findPackages();
		}
		packageList = driver.findElement(By.cssSelector("ul.jstree-container-ul.jstree-children"));
		return packageList.getText();
	}
	
	/**
	 * within a package, this method will collect the first main branch of a tree of packages
	 * @param index is for either 1 or 2, 1 being the included packages tree hierarchy, and two being excluded packages
	 * @return a ul of further packages
	 */
	public WebElement getMainBranch(int index) {
		WebElement packageTable = (new WebDriverWait(driver, 10)).until(ExpectedConditions.presenceOfElementLocated(
				By.cssSelector("wu-js-tree-wrapper.jstree.jstree-"+ index + ".jstree-default")));
		WebElement firstPackage = packageTable.findElement(By.cssSelector("li:nth-child(1)"));
		
		WebElement branch = null;
		
		try {
			branch = firstPackage.findElement(By.cssSelector("ul.jstree-children"));
		}
		catch (NoSuchElementException e) {
			WebElement firstCarrot = firstPackage.findElement(By.cssSelector("i.jstree-icon.jstree-ocl"));
			firstCarrot.click();
			branch = firstPackage.findElement(By.cssSelector("ul.jstree-children"));
		}	
		return branch;
	}
	
	/**
	 * This method will get the first packages branch, then go to the bottom of the hierarchy, click
	 * on the last package there, and then check if that package, and all other parent packages are selected
	 * @param index
	 * @return
	 */
	public boolean testPackages(int index) {
		WebElement branch = getMainBranch(index);
		innerPackages(branch);
		return packageSelected(branch);
	}
	
	/**
	 * this method collects the first package's branch, then clicks on the package at the bottom of the
	 * hierarchy. If this is the include packages tree, then the method checks that that package and
	 * all it's parents packages have been deselected
	 * @param index
	 * @return
	 */
	public boolean testEmptyPackages(int index) {
		WebElement branch = getMainBranch(index);
		checkbox.click();
		
		if (index == 1) {
			return packageSelected(branch);
		}
		return false;
	}
	
	/**
	 * This method will go down the tree, and slowly open it until it finds the last package,
	 * which it then clicks.
	 * @param ul is the branch of packages to be opened 
	 */
	public void innerPackages(WebElement ul) {
		WebElement innerPackages = null;
		WebElement carrot;
		WebElement branch = null;
		boolean work = false;
		int previousX = 0;
		int x = 1;
		while (true) {
			try {
				previousX = x;
				innerPackages = ul.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				x++;
				carrot = innerPackages.findElement(By.cssSelector("i.jstree-icon.jstree-ocl"));
				WebDriverWait wait = new WebDriverWait(driver, 10);
				wait.until(ExpectedConditions.visibilityOfAllElements(carrot));
				carrot.click();
				
				branch = innerPackages.findElement(By.cssSelector("ul.jstree-children"));
				work = true;
			}
			catch (NoSuchElementException e) {
				if (work == true) {
					innerPackages(branch);
					break;
				}
				if (previousX == x) {
					WebElement a = innerPackages.findElement(By.cssSelector("a"));
					checkbox = a.findElement(By.cssSelector("i:nth-child(1)"));
					checkbox.click();
					break;
				}
			}
		}
	}
	
	/**
	 * this method will go through the packages and check whether or not any packages have been selected
	 * @param ul is the branch of packages to be looked through
	 * @return true if there are packages selected
	 */
	public boolean packageSelected(WebElement ul) {
		WebElement innerPackages = null;
		WebElement branch = null;
		int previousX = 0;
		int x = 1;
		while (true) {
			try {
				previousX = x;
				innerPackages = ul.findElement(By.cssSelector("li:nth-child(" + x + ")"));
				x++;
				
				branch = innerPackages.findElement(By.cssSelector("ul.jstree-children"));
				WebElement a = innerPackages.findElement(By.cssSelector("a"));
				WebElement checkbox = a.findElement(By.cssSelector("i:nth-child(1)"));
				String c = checkbox.getAttribute("class");
				if (c.equals("jstree-icon jstree-checkbox jstree-undetermined")) {
					return packageSelected(branch);
				}
			}
			catch (NoSuchElementException e) {
				if (previousX == x) {
					return innerPackages.getAttribute("aria-selected").equals("true");
				}
			}
		}
	}
	
	/**
	 * this clicks on the add options button in the advanced options section of the analysis configuration 
	 */
	public void addOptions() {
		WebElement container = driver.findElement(By.cssSelector("wu-analysis-context-advanced-options"));
		
		WebElement addOption = container.findElement(By.cssSelector("button"));
		addOption.click();
	}
	
	/**
	 * In the advanced option section of tha analysis configuration page, after the "add option" button
	 * has been clicked, this will go through all the options in the dropdown and click on an option
	 * if it matches the paramater
	 * @param optionName is a string of the options
	 */
	public void optionsDropdown(String optionName) {
		WebElement container = driver.findElement(By.cssSelector("wu-analysis-context-advanced-options"));
		WebElement dropdown = container.findElement(By.cssSelector("select.form-control"));
		dropdown.click();
		int x = 1;
		while (true) {
			try {
				WebElement option = dropdown.findElement(By.cssSelector("option:nth-child("+ x + ")"));
				x++;
				if (option.getAttribute("value").equals(optionName)) {
					option.click();
				}
			} catch (NoSuchElementException e) {
				break;
			}
		}
	}
	
	/**
	 * once an option has been chosen, then this button actually ads it to the analysis configuration under
	 * the advanced options table
	 * @param num is the index of the options (starts at 1)
	 */
	public void addOption(int num) {
		WebElement container = driver.findElement(By.cssSelector("wu-analysis-context-advanced-options"));
		WebElement buttons = container.findElement(By.cssSelector("tr:nth-child(" + num + ") > td:nth-child(3)"));
		WebElement cancel = buttons.findElement(By.cssSelector("button:nth-child(1)"));
		cancel.click();
	}
	
	/**
	 * once an option has been chosen, then this button cancels it, removing any progress from
	 * the advanced options table
	 * @param num is the index of the options (starts at 1)
	 */
	public void cancelOption(int num) {

		WebElement container = driver.findElement(By.cssSelector("wu-analysis-context-advanced-options"));
		WebElement buttons = container.findElement(By.cssSelector("tr:nth-child(" + num + ") > td:nth-child(3)"));
		WebElement add = buttons.findElement(By.cssSelector("button:nth-child(2)"));
		add.click();
	}
	
	/**
	 * in the advanced options table, while adding an option, this can toggle the value checkbox
	 * @param num is the index of the options (starts at 1)
	 */
	public void toggleValue(int num) {
		WebElement container = driver.findElement(By.cssSelector("wu-analysis-context-advanced-options"));
		WebElement value = container.findElement(By.cssSelector("tr:nth-child(" + num + ") > td:nth-child(2)"));
		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(ExpectedConditions.visibilityOfAllElements(value));
		WebElement checkbox = value.findElement(By.cssSelector("input"));
		checkbox.click();
	}
	
	/**
	 * Once an option has been added to the advanced options table, this will return whether or not
	 * the value column is true or false
	 * @param num is the index of the options (starts at 1)
	 * @return true if the given options value is true, false otherwise
	 */
	public boolean value(int num) {

		WebElement container = driver.findElement(By.cssSelector("wu-analysis-context-advanced-options"));
		WebElement value = container.findElement(By.cssSelector("tr:nth-child(" + num + ") > td:nth-child(2)"));
		if (value.getText().equals("true")) {
			return true;
		}
		return false;
	}
	
	/**
	 * based on its name, in the Analysis Configuration page this will click on the sections
	 * carrot, either to open or close it.
	 * @param name
	 */
	public void clickCollapsed(String name) {
		for (int i = 1; i < 4; i++) {
			String xpath = "(//*[@class='fields-section-header-pf'])[" + i + "]";
			WebElement collapsedDialogues = driver.findElement(By.xpath(xpath));
			if (name.equals(collapsedDialogues.getText())) {
				WebElement link = collapsedDialogues.findElement(By.cssSelector("span"));
				link.click();
			}
		}
	}
	
	/**
	 * In the Analysis Configuration page, if the specified section is collapsed, then true is returned.
	 * @param name is the name of the section, either "Exclude packages", "Use custom rules", or "Advanced options".
	 * @return true if the specified section is collapsed
	 */
	public boolean isCollapsed(String name) {
		for (int i = 1; i < 4; i++) {
			String xpath = "(//*[@class='fields-section-header-pf'])[" + i + "]";
			WebElement collapsedDialogues = driver.findElement(By.xpath(xpath));
			if (name.equals(collapsedDialogues.getText())) {
				WebElement link = collapsedDialogues.findElement(By.cssSelector("span"));
				try {
					WebElement collapse = collapsedDialogues.findElement(By.cssSelector("span[class$='fa-angle-right']"));
					return true;
				} catch (NoSuchElementException e) {
					return false;
				}
			}
		}
		return false;
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
	 * 
	 */


	/**
	 * This method should be run right after redirecting to the reports/analysis
	 * page because it gives about 30 seconds for the progress bar to load. It looks
	 * for the div that holds the changing information for the progress bar If the 
	 * method has found the div, then true is returned.
	 * 
	 * @param x
	 *            is the number of times to run the method if it fails (must start
	 *            at a number greater than 0)
	 * @return true if the progress bar div is found
	 * @throws InterruptedException
	 */
	public boolean checkProgressBar() throws InterruptedException {
		
		WebElement progBar = (new WebDriverWait(driver, 30)).until(ExpectedConditions.presenceOfElementLocated(
				By.cssSelector("wu-progress-bar")));
		String text = progBar.getText();
		
		if (text.equals("There is no active analysis.")) {
			return false;
		}
		return true;
	}

	/**
	 * When the reports are run (must be after it has sucessfully ran) 
	 * this will find the Analysis Configuration link and click it. 
	 * Should redirect to an Analysis Configuration page
	 */
	public void clickAnalysisConfiguration() {
		WebElement list = driver.findElement(By.cssSelector("ul.list-group"));
		WebElement analysisConfig = list.findElement(By.cssSelector("li:nth-child(3)"));
		analysisConfig.click();
	}

	/**
	 * will delete an application in the Analysis Configuration page.
	 * Note: they are now ordered in alphabetical order, check what order
	 * the applications are in first to determine the proper index
	 * @param index starts at 1
	 */
	public void deleteSelectedApplication(int index) {

		String xpath = "(//*[@class='search-choice'])[" + index + "]";
		WebElement application = driver.findElement(By.xpath(xpath));
		WebElement delete = application.findElement(By.className("search-choice-close"));
		delete.click();

	}

	/**
	 * This will go through the applications selected for the report and
	 * prints them out in string form.
	 * @return a string version of the applications. 
	 */
	public String printSelectedApplications() {
		WebElement selectedApplications = driver.findElement(By.cssSelector("ul.chosen-choices"));
		return selectedApplications.getText();
	}
	
	/**
	 * This will go down the Analysis Results section, select each analysis and check that they have a 
	 * "show reports" and "delete" button available. If they are both present, then true is returned
	 * 
	 * @param numOfAnalysis denotes how many results there are to go through
	 * @return true if all results have the "show reports" and "delte" actions
	 */
	public boolean analysisResultsComplete(int numOfAnalysis) {
		String xpath = "";
		for (int x = 1; x <= numOfAnalysis; x++) {
			xpath = "(//*[@class='success'])[" + numOfAnalysis + "]";
			WebElement result = (new WebDriverWait(driver, 360)).until(ExpectedConditions.presenceOfElementLocated(
					By.xpath(xpath)));
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
	
	/**
	 * this clicks on the projects icon on the top left hand corner of the page.
	 * will redirect to the projects list pages
	 */
	public void clickProjectsIcon() {
		WebElement projectIcon = driver.findElement(By.className("home"));
		projectIcon.click();
	}

	/**
	 * from the project list screen this will navigate to whichever project is given by the name
	 * @param projName the exact string form of the project name
	 * @return true if the project is found
	 */
	public boolean navigateProject(String projName) {
		int x = 1;
		while (true) {
			try {
				WebElement proj = driver.findElement(By.xpath("(//*[@class='list-group-item  project-info  tile-click'])[" + x + "]"));
				WebElement title = proj.findElement(By.cssSelector("div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)"));
				if (title.getText().equals(projName)) {
					title.click();
					return true;
				}
				x++;
			}
			catch (NoSuchElementException e) {
				break;
			}
		}
		return false;
	}
	
	/**
	 * this will collect the information from the project dropdown
	 * @return "Project" a new line, and the project name
	 */
	public String dropDownInfo() {
		WebElement dropDown = driver.findElement(By.className("dropdown-toggle"));
		return dropDown.getText();
	}

	/**
	 * This method will navigate the user to the project-list page, locate the
	 * delete button for the first project in the list, click it, then deal with the
	 * popup dialogue box.
	 */
	public boolean deleteProject(String projName) {
		WebElement project = null;
		boolean working = false;
		int x = 1;
		while (true) {
			try {
				String xpath = "(//*[@class='list-group-item  project-info  tile-click'])[" + x + "]";
				project = driver.findElement(By.xpath(xpath));

				WebElement title = project.findElement(By.cssSelector("h2.project-title"));
				if (title.getText().equals(projName)) {
					WebElement trash = project.findElement(By.cssSelector("a.action-button.action-delete-project"));
					JavascriptExecutor jse2 = (JavascriptExecutor)driver;
					jse2.executeScript("arguments[0].click()", trash);
					working = true;
					break;
				}
				x++;
			}
			catch (NoSuchElementException e) {
				break;
			}
		}
		if (working == true) {
			WebElement cancel = driver.findElement(By.cssSelector("button.cancel-button.btn.btn-lg.btn-default"));
			WebElement delete = driver.findElement(By.cssSelector("button.confirm-button.btn.btn-lg.btn-danger"));
			
			if (cancel.isEnabled() && !delete.isEnabled()) {
				WebDriverWait  wait = new WebDriverWait(driver, 60);
				WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input#resource-to-delete")));
				input.sendKeys(projName);
				return delete.isEnabled();
			}
		}
		return false;
	}
	
	/**
	 * when the dialog box asks if the user would like to delete the project, this will cancel
	 * the box, returning the user to the project list page.
	 * @return true if the dialog has been removed
	 */
	public boolean cancelDeleteProject() {
		WebElement footer = driver.findElement(By.cssSelector("div.modal-footer"));
		WebElement cancel = footer.findElement(By.cssSelector("button.cancel-button.btn.btn-lg.btn-default"));
		cancel.click();
		return popupRemoved("deleteProjectDialog");
	}
	
	/**
	 * when the dialog box asks if the user would like to delete the project, this will confirm
	 *and delete the project, returning the user to the project list page.
	 * @return true if the dialog has been removed
	 */
	public boolean clickDeleteProject() {
		WebElement delete = driver.findElement(By.cssSelector("button.confirm-button.btn.btn-lg.btn-danger"));
		delete.click();
		return popupRemoved("deleteProjectDialog");
	}
	
	
	/*
	 * ***************
	 * SORTING METHODS
	 * ***************
	 */
	
	/**
	 * this method will collect each of the names of each project,
	 * then sorts the collect list in descending order, toggling the table in descending order
	 * and compare the two arrayLists, if that passes then it does the same with ascending
	 * order.
	 * @return true if the names sort
	 */
	public boolean sortNames() {
		ArrayList<String> names = collectNames();
		
		//sort descending
		Collections.sort(names, Collections.reverseOrder());

		sortProjectList("Name", false);
		ArrayList<String> sorted = collectNames();
		
		if (names.equals(sorted)) {
			//sort ascending
			Collections.sort(names);

			sortProjectList("Name", true);
			sorted = collectNames();
			return names.equals(sorted);
		}
		return false;
	}
	
	/**
	 * this method will collect each of the last modified dates of each project,
	 * then sorts the collected list in descending order, toggling the table in descending
	 * order and collecting that list. It will then compare the two lists and if that
	 * passes then it does the same with ascending order.
	 * @return true if the table sorts properly by last modified date.
	 */
	public boolean sortLastDate() {
		ArrayList<Calendar> dates = collectDates();
		
		//sort descending
		Collections.sort(dates, Collections.reverseOrder());
		
		sortProjectList("Last modified date", false);
		ArrayList<Calendar> sorted = collectDates();
		
		if (dates.equals(sorted)) {
			//sort ascending
			Collections.sort(dates);

			sortProjectList("Last modified date", true);
			sorted = collectDates();
			return dates.equals(sorted);
		}
		//checks if the method was run between minutes (ex between 4:12:59 and 4:13:00)
		int min1 = dates.get(0).get(Calendar.MINUTE);
		int min2 = sorted.get(0).get(Calendar.MINUTE);
		//if was run at the wrong time, throws and exception and tells the user to run again
		if (min2 - min1 == 1) {
			throw new RuntimeException("One second off, run again.");
		}
		return false;
	}
	
	/**
	 * this method will collect each of the application for each project,
	 * then sorts the collected list in descending order, toggling the table in descending
	 * order and collecting that list. It will then compare the two lists and if that
	 * passes then it does the same with ascending order.
	 * @return true if the table sorts properly by number of applications.
	 */
	public boolean sortApplications() {
		ArrayList<Integer> apps = collectApplications();
		
		//sort descending
		Collections.sort(apps, Collections.reverseOrder());

		sortProjectList("Name", false);
		ArrayList<Integer> sorted = collectApplications();
		
		if (apps.equals(sorted)) {
			//sort ascending
			Collections.sort(apps);

			sortProjectList("Name", true);
			sorted = collectApplications();
			return apps.equals(sorted);
		}
		return false;
	}
	
	/**
	 * This method takes in a string parameter, and re-formats it into a Calendar object.
	 * The only information to go off of is how many days, hours, or minutes away from
	 * the current date this project has been last modified. This information then creates 
	 * a calendar object, and returns it.
	 * @param date is the string representing the time elapsed
	 * @return a calendar date representing whent he project has last been modified
	 */
	public Calendar getCalendarDate(String date) {
		Calendar cal = Calendar.getInstance();
		date = date.substring(13);
		int num;
		if (date.indexOf("minute") != -1) {
			date = date.substring(0, date.indexOf("minute") - 1);
			num = parseNum(date);
			cal.add(Calendar.MINUTE, -num);
		}
		else if (date.indexOf("hour") != -1) {
			date = date.substring(0, date.indexOf("hour") - 1);
			num = parseNum(date);
			cal.add(Calendar.HOUR, -num);
		}
		else if (date.indexOf("day") != -1) {
			date = date.substring(0, date.indexOf("day") - 1);
			num = parseNum(date);
			cal.add(Calendar.DATE, -num);
		}
		return cal;
	}
	
	/**
	 * This method will take the string left from the last updated date, and convert it into
	 * and integer, if the string left is "a" them the integer returned is 1.
	 * @param date is the string left after parsing out the day/minute/second information
	 * @return and integer of units left.
	 */
	private int parseNum(String date) {
		if (date.startsWith("a")) 
			return 1;
		else 
			return Integer.parseInt(date);
	}
		
	
	/**
	 * this will collect an arraylist of application objects that will in turn
	 * collect the name and story point count of each application
	 * @return the arraylist of application objects
	 */
	public ArrayList<Project> listProjects() {
		WebElement projList = (new WebDriverWait(driver, 5)).until(ExpectedConditions.presenceOfElementLocated(
				By.cssSelector("div.list-group")));
		ArrayList<Project> list = new ArrayList<>();
		
		int x = 1;
		while (true) {
			try {
				WebElement proj = projList.findElement(By.xpath("(//*[@class='list-group-item  project-info  tile-click'])[" + x + "]"));
				
				WebElement desc = proj.findElement(By.cssSelector("div.list-group-item-heading"));
				WebElement name = desc.findElement(By.cssSelector("a"));
				WebElement application = desc.findElement(By.cssSelector("small.count-applications"));
				WebElement lastU = desc.findElement(By.cssSelector("small.last-updated"));
				
				String app = application.getText();
				app = app.substring(0, app.indexOf("application") - 1);
				
				String updated = lastU.getText();
				Calendar cal = getCalendarDate(updated);

				DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
				
				Project p = new Project(name.getText(), cal, app);
				list.add(p);
				x++;
			} 
			catch (NoSuchElementException e) {
				return list;
			}
		}
	}
	
	
	
	/**
	 * The Status class has a type and output, the type can be warning, success
	 * danger, and info, which are found from the output's class name.
	 * @author edixon
	 *
	 */
	class Project {
		
	    String name;
	    Calendar lastModified;
	    int applications;
	 
	    // Constructor
	    public Project(String name, Calendar lastModified, String applications){
	        this.name = name;
	        this.lastModified = lastModified;
	        this.applications = Integer.parseInt(applications);
	    }
	 
	    public String toString()
	    {
	        return this.name;
	    }
	    
	    public boolean equals(Object o) {
	    	if (o == this) 
	    		return true;
	    	if (o == null || o.getClass() != AnalyzeProject.Application.class) {
	    		return false;
	    	}
	    	Project other = (Project)o;
	    	return (this.name.equals(other.name)) && (this.applications == other.applications);
	    }
	}
	
	/**
	 * with a given project arraylist, this will go through the projects
	 * and put the project names into a string arraylist
	 * @return a string arraylist of names
	 */
	private ArrayList<String> collectNames() {
		ArrayList<Project> projList = listProjects();
		ArrayList<String> list = new ArrayList<>();
		
		for (Project p: projList) {
			list.add(p.name);
		}
		return list;
	}
	
	
	/**
	 * with a given project arraylist, this will go through the projects
	 * and put the dates into a string arraylist
	 * @return a string arraylist of dates
	 */
	private ArrayList<Calendar> collectDates() {
		ArrayList<Project> projList = listProjects();
		ArrayList<Calendar> list = new ArrayList<>();
		
		for (Project p: projList) {
			Calendar cal = p.lastModified;
			cal.set(Calendar.MILLISECOND, 0);
			cal.set(Calendar.SECOND, 0);
			list.add(cal);
		}
		return list;
	}
	
	/**
	 * with a given project arraylist, this will go through the projects
	 * and put the applications into an integer arraylist
	 * @return an integer arraylist of applications
	 */
	private ArrayList<Integer> collectApplications() {
		ArrayList<Project> projList = listProjects();
		ArrayList<Integer> list = new ArrayList<>();
		
		for (Project p: projList) {
			list.add(p.applications);
		}
		return list;
	}
	
	/**
	 * this method is used to actually interact with the page and have it
	 * sort the project list by name/created date/last modified date/number of applications
	 * and toggle the ascending/descending order.
	 * @param sortOrder is the name of the sort (should be "Name", "Created date", "Last modified date", or "Number of applications")
	 * @param ascending is true for ascending order, false for descending
	 * @return true if these params are properly found.
	 */
	public boolean sortProjectList(String sortOrder, boolean ascending) {
		WebElement sorts = driver.findElement(By.cssSelector("wu-sort"));
		dropDown(sorts, sortOrder);
		
		try {
			WebElement order = driver.findElement(By.cssSelector("span.sort-direction.fa.fa-sort-alpha-asc"));
			if (ascending == false) {
				order.click();
			}
			return true;
		} catch (NoSuchElementException e) {
			try {
				WebElement order = driver.findElement(By.cssSelector("span.sort-direction.fa.fa-sort-alpha-desc"));
				if (ascending == true) {
					order.click();
					return true;
				}
				
			} catch (NoSuchElementException ex) {
				System.out.println("did not find descending button");
				return false;
			}
		}
		return false;
	}



	/**
	 * this will clear all filters added on the application list page
	 */
	public void clearFilters() {
		WebElement clear = driver.findElement(By.cssSelector("a#clear-filters"));
		clear.click();
	}

	/**
	 * helper method that interacts with the various drop-downs on whichever page
	 * the driver is on
	 * @param f is the web element holding the dropdown
	 * @param name is the name to be selected in the dropdown
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
				}
				x++;
			} catch (NoSuchElementException e) {
				break;
			}
		}
	}


/*
 * **********************
 * END OF SORTING METHODS
 * **********************
 */
	
	
	/**
	 * With a given index of which project to edit, this will click on the edit button, redirecting 
	 * the user to a different page. It will then look for the name input box and the description input
	 * box. If these are found then the new name is inputed. If neither the name nor the description inputs
	 * are found then false is returned, and after that it will check if the name box is enabled and
	 * that the description is enabled, and returns the outcome of that
	 * @param index starts at 1 and denotes which test to use
	 * @param s is the new name for the project
	 * @return true if the name and description input boxes are present and enabled.
	 */
	public boolean editProject(int index, String s) {
		String xpath = "(//*[@class='list-group-item  project-info  tile-click'])[" + index + "]";
		WebElement project = driver.findElement(By.xpath(xpath));
		
		WebElement edit = project.findElement(By.cssSelector("a.action-button.action-edit-project"));
		edit.click();
		WebElement name = null;
		WebElement description = null;
		try {

			name = driver.findElement(By.cssSelector("input#idProjectTitle"));
			name.clear();
			name.sendKeys(s);

			description = driver.findElement(By.cssSelector("textarea#idDescription"));
		} 
		catch (NoSuchElementException e) {
			return false;
		}
		return name.isEnabled() && description.isEnabled();
	}

	/**
	 * on the edit project page, once the project has been edited, this will click on the update
	 * button, redirecting to the project list page and showing the new changed project name/description
	 */
	public void updateProject() {
		WebElement updateProject = driver.findElement(By.cssSelector("button.btn.btn-primary"));
		updateProject.click();
	}
	
	/**
	 * With a given index for which project, and a new project name, this will check that
	 * the project name has been changed
	 * @param index starts at 1 and is the number of the project that was changed
	 * @param projName is the changed project name
	 * @return true if the name has been changed
	 */
	public boolean checkUpdateProject(int index, String projName) {
		String xpath = "(//*[@class='list-group-item  project-info  tile-click'])[" + index + "]";
		WebElement project = driver.findElement(By.xpath(xpath));
		
		WebElement title = project.findElement(By.cssSelector("h2.project-title"));
		return title.getText().equals(projName);
	}
	
	/**
	 * on the project list page, this will look up the given search parameter into the search
	 * bar, changing the project list.
	 * @param s
	 */
	public void projectSearch(String s) {
		WebElement searchContainer = driver.findElement(By.cssSelector("wu-search"));
		
		WebElement search = searchContainer.findElement(By.cssSelector("input.form-control"));
		search.sendKeys(s);
	}
	
	/**
	 * if the project search has been changed 
	 */
	public void clearProjectSearch() {
		WebElement searchContainer = driver.findElement(By.cssSelector("wu-search"));
		WebElement clear = searchContainer.findElement(By.cssSelector("button.clear"));
		clear.click();
	}
	

	/**
	 * closes the browser
	 */
	public void closeDriver() {
		driver.quit();
	}
}