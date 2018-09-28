package org.jboss.windup.web.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * this code is intended for a RHAMT web application that does not have any
 * pre-made projects
 * 
 * @author elise
 *
 */

public class EditProject extends CommonProject {



	public EditProject() {

		WebElement header = (new WebDriverWait(driver, 10))
				.until(ExpectedConditions.presenceOfElementLocated(By.id("header-logo")));
	}

	/**
	 * returns the current URL of the page May have to wait a few seconds for it to
	 * properly load
	 * 
	 * @return the full URL
	 */
	public String checkURL()
	{
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
		driver.switchTo().window((String)tabs.get(index));
		driver.switchTo().defaultContent();
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
	 * this will return whichever page is activated on the left sidebar 
	 * @return the name of the page activated
	 */
	public String activePage() {
		WebElement list = driver.findElement(By.cssSelector("ul.list-group"));
		WebElement active = list.findElement(By.xpath("//*[@class='list-group-item active']"));
		
		return active.getText();
	}
	
	
	/**
	 * this will find the Analysis Configuration link and click it. 
	 * Should redirect to an Analysis Configuration page
	 */
	public void clickAnalysisConfiguration() {
		WebElement list = driver.findElement(By.cssSelector("ul.list-group"));
		WebElement analysisConfig =new WebDriverWait(driver,5).until(ExpectedConditions.visibilityOf( list.findElement(By.cssSelector("li:nth-child(3)"))));
		analysisConfig.click();
	}
	
	/**
	 * this will find the Applications link and click it. 
	 * Should redirect to an Applications page
	 */
	public void clickApplications() {
		WebElement list = driver.findElement(By.cssSelector("ul.list-group"));
		WebDriverWait wait = new WebDriverWait(driver,10);
		WebElement applications = wait.until(ExpectedConditions.elementToBeClickable(list.findElement(By.cssSelector("li:nth-child(2)"))));
		applications.click();
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
	 * this will collect the information from the project dropdown
	 * @return "Project" a new line, and the project name
	 */
	public String dropDownInfo() {
		WebElement dropDown = driver.findElement(By.className("dropdown-toggle"));
		return dropDown.getText();
	}
	
	/**
	 * this will click on the projects dropdown and select a project
	 * from the parameter given.
	 * @param projName is the exact name of the project
	 */
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


	
	/**
	 * on the Analysis Results page, this will return the analysis number based
	 * on the index given
	 * @param index starts at 1
	 * @return the analysis number
	 */
	public String analysisName(int index) {
		String xpath = "(//*[@class='success'])[" + index + "]";
		WebElement result = (new WebDriverWait(driver, 5)).until(ExpectedConditions.presenceOfElementLocated(
				By.xpath(xpath)));
		WebElement name = result.findElement(By.cssSelector("td:nth-child(1)"));
		return name.getText();
	}

	/**
	 * on the Analysis Results page, this will click the delete button based
	 * on the index given
	 * @param index starts at 1
	 */
	public void deleteAnalysisResults(int index) {
		String xpath = "(//*[@class='success'])[" + index + "]";
		WebElement result = driver.findElement(By.xpath(xpath));
		
		WebElement delete = result.findElement(By.cssSelector("td:nth-child(5) > a:nth-child(3)"));
		delete.click();
	}
	
	/**
	 * on the Analysis Results page, this will click the reports button based on the 
	 * index given
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
	
	/**
	 * finds the amount of completed analyses, then returns the number
	 * @return the number of completed analyses
	 */
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
	
	
	/*
	 * ***************
	 * SORTING METHODS
	 * ***************
	 */
	

	/**
	 * with a table, this will find the given sort paramater and click on it
	 * @param sortParam the name of the sort to be clicked
	 */
	public void tableHeaderSort(String sortParam) {
		WebElement table = driver.findElement(By.cssSelector("table"));
		WebElement header = table.findElement(By.cssSelector("thead > tr:nth-child(1)"));
		int x = 1;
		while (true) {
			try {
				WebElement sort = header.findElement(By.cssSelector("th:nth-child(" + x + ")"));
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
	
	/**
	 * will collect all of the elements in a column for the table on the given page.
	 * It collects the elements into string form in an arraylist
	 * @param index starts at 1 and continues down the table
	 * @return A string arraylist of the elements of the table
	 */
	public ArrayList<String> collectTableCol(int index) {
		WebElement body = driver.findElement(By.cssSelector("tbody"));
		ArrayList<String> list = new ArrayList<>();
		int x = 1;
		while (true) {
			try {
				WebElement name = body.findElement(By.cssSelector("tr:nth-child(" + x + ") > td:nth-child(" + index + ")"));
				list.add(name.getText());
				x++;
			} catch (NoSuchElementException e) {
				return list;
			}
		}
	}
	
	
	/*
	 * Date Sorting
	 */
	/**
	 * Will sort the results in a table that are dates
	 * everything is done automatically, so if the table sorting works then it will
	 * reurn true
	 * @param index starting at 1, it denotes the column where the dates are in the table
	 * @param headerName is the name of the sort parameter (e.g. "Start Date")
	 * @return true if the table does sort the dates properly
	 * @throws ParseException
	 */
	public boolean sortDate(int index, String headerName) throws ParseException {
		//collects the dates before the start date 
		ArrayList<Date> toSort = collectDate(index);
		//clicks on the Start Date header
		tableHeaderSort(headerName);
		if (headerName.equals("Date Added")) {
			tableHeaderSort(headerName);
		}
		//uses private methods to auto sort the date list by ascending
		ArrayList<Date> sort = ascDate(toSort);
		//collects the post sorted list from the table
		ArrayList<Date> list = collectDate(index);

		if (list.equals(sort)) {
			
			//collects the dates before the start date 
			toSort = collectDate(index);
			//clicks on the Start Date header
			tableHeaderSort(headerName);
			//uses private methods to auto sort the date list by descending
			sort = descDate(toSort);
			//collects the post sorted list from the table
			list = collectDate(index);
			
			if (list.equals(sort))
				return true;
		}
		return false;
	}
	
	/**
	 * Uses the collectTableCol method to collect the date column in string form, then
	 * converts it from an ArrayList of strings to an ArrayList of Dates. 
	 * Parses the strings into a Date object using SimpleDateFormat
	 * @param index is the location of the column of dates
	 * @return an ArrayList of dates
	 * @throws ParseException
	 */
	private ArrayList<Date> collectDate(int index) throws ParseException {
		ArrayList<Date> list = new ArrayList<>();
		ArrayList<String> collectedDates = collectTableCol(index);
		
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy, hh:mm aa");
		
		for (String d: collectedDates) {
			Date date = format.parse(d);
			list.add(date);
		}
		return list;
	}
	
	/**
	 * Sorts an ArrayList of dates by ascending order
	 * @param list is an ArrayList of dates to be sorted
	 * @return the sorted ArrayList
	 */
	private ArrayList<Date> ascDate(ArrayList<Date> list) {
		ArrayList<Date> sorted = list;
		Collections.sort(sorted);
		return sorted;
	}
	
	/**
	 * Sorts an ArrayList of dates by descending order
	 * @param list is an ArrayList of dates to be sorted
	 * @return the sorted ArrayList
	 */
	private ArrayList<Date> descDate(ArrayList<Date> list) {
		ArrayList<Date> sorted = list;
		Collections.sort(sorted, Collections.reverseOrder());
		return sorted;
	}
	
	/*
	 * String Sorting
	 */
	/**
	 * Will sort the results in a table that are strings
	 * everything is done automatically, so if the table sorting works then it will
	 * return true
	 * @param index starting at 1, it denotes the column where the elements are in the table
	 * @param headerName is the name of the sort parameter (e.g. "Analysis")
	 * @return true if the table does sort the strings properly
	 */
	public boolean sortString(int index, String sortName){
		//collects the dates before the start date 
		ArrayList<String> toSort = collectTableCol(index);
		
		if (sortName.equals("Analysis") || sortName.equals("Applications"))
			tableHeaderSort(sortName);
		
		//clicks on the header sort
		tableHeaderSort(sortName);
		
		//uses private methods to auto sort the date list by ascending
		ArrayList<String> sort = ascString(toSort);
		
		//collects the post sorted list from the table
		ArrayList<String> list = collectTableCol(index);
		
		if (list.equals(sort)) {
			//collects the dates before the start date 
			toSort = collectTableCol(index);
			//clicks on the Start Date header
			tableHeaderSort(sortName);
			//uses private methods to auto sort the date list by descending
			sort = descString(toSort);
			//collects the post sorted list from the table
			list = collectTableCol(index);
			
			if (list.equals(sort))
				return true;
		}
		return false;
	}
	
	/**
	 * Sorts an ArrayList of Strings by ascending order
	 * @param list is an ArrayList of Strings to be sorted
	 * @return the sorted ArrayList
	 */
	private ArrayList<String> ascString(ArrayList<String> list) {
		ArrayList<String> sorted = list;
		Collections.sort(sorted);
		return sorted;
	}
	
	/**
	 * Sorts an ArrayList of Strings by descending order
	 * @param list is an ArrayList of Strings to be sorted
	 * @return the sorted ArrayList
	 */
	private ArrayList<String> descString(ArrayList<String> list) {
		ArrayList<String> sorted = list;
		Collections.sort(sorted, Collections.reverseOrder());
		return sorted;
	}
	
	/*
	 * Status Sorting
	 */
	/**
	 * sortStatus automatically collects and sorts an ArrayList of Status objects
	 * if that is equal to the table's sort then true is returned
	 * @return true if the table sorts by Status properly
	 */
	public boolean sortStatus() {
		ArrayList<Status> preSort = collectStatus();
		Collections.reverse(preSort);

		//sorts the pre-sorted list by descending order
		Collections.sort(preSort, new SortByStatus().reversed());
		
		//clicks on the status header which sorts by descending order first
		tableHeaderSort("Status");
		ArrayList<Status> postSort = collectStatus();
		
		//checks if the auto sorted list and list from the table are equal
		if (preSort.equals(postSort)) {

			//auto sorts the pre-sorted list by ascending order
			Collections.sort(preSort, new SortByStatus());
			
			//clicks on the Status header and sorts by ascending order
			tableHeaderSort("Status");
			postSort = collectStatus();
			
			//checks if the auto sorted list and list from the table are equal
			if (postSort.equals(preSort)) 
				return true;
		}
		return false;
	}
	
	/**
	 * Collects the statuses and stores it in a Status object that is later returned 
	 * as an Arraylist of statuses
	 * @return an arraylist of Status objects
	 */
	private ArrayList<Status> collectStatus() {
		WebElement body = driver.findElement(By.cssSelector("tbody"));
		ArrayList<Status> list = new ArrayList<>();
		int x = 1;
		while (true) {
			try {
				WebElement tr = body.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				WebElement name = body.findElement(By.cssSelector("tr:nth-child(" + x + ") > td:nth-child(2)"));
				Status s = new Status(tr.getAttribute("class"), name.getText());
				list.add(s);
				x++;
			} catch (NoSuchElementException e) {
				
				return list;
			}
		}
	}
	
	
	/**
	 * this class implements comparator to be used in 
	 * sorting Status objects
	 * @author edixon
	 *
	 */	
	class SortByStatus implements Comparator<Status>
	{
	    public int compare(Status a, Status b)
	    {
	        if (a.type.equals(b.type)) {
	        	return 0;
	        }
	        else if (a.type.equals("warning")) {
	        	if (b.type.equals("success")) {
	        		return -1;
	        	}
	        	else if (b.type.equals("danger")) {
	        		return -2;
	        	}
	        	else if (b.type.equals("info")) {
	        		return -3;
	        	}
	        }
	        else if (a.type.equals("success")) {
	        	if (b.type.equals("warning")) {
	        		return 1;
	        	}
	        	else if (b.type.equals("danger")) {
	        		return -1;
	        	}
	        	else if (b.type.equals("info")) {
	        		return -2;
	        	}
	        }
	        else if (a.type.equals("danger")) {
	        	if (b.type.equals("warning")) {
	        		return 2;
	        	}
	        	else if (b.type.equals("success")) {
	        		return 1;
	        	}
	        	else if (b.type.equals("info")) {
	        		return -1;
	        	}
	        }

	        else if (a.type.equals("info")) {
	        	if (b.type.equals("warning")) {
	        		return 3;
	        	}
	        	else if (b.type.equals("success")) {
	        		return 2;
	        	}
	        	else if (b.type.equals("damger")) {
	        		return 1;
	        	}
	        }
	        return 0;
	    }
	}
	
	/**
	 * The Status class has a type and output, the type can be warning, success
	 * danger, and info, which are found from the output's class name.
	 * @author edixon
	 *
	 */
	class Status {
		//Ascending order
		//warning
		//success
		//danger
		//info
		
	    String type;
	    String output;
	 
	    // Constructor
	    public Status(String type, String output){
	        this.type = type;
	        this.output = output;
	    }
	 
	    public String toString()
	    {
	        return this.type + ", " + this.output + "\n";
	    }
	    
	    public boolean equals(Object o) {
	    	if (o == this) 
	    		return true;
	    	if (o == null || o.getClass() != Status.class) {
	    		return false;
	    	}
	    	Status other = (Status)o;
	    	return (this.type.equals(other.type)) && (this.output.equals(other.output));
	    }
	}
	
	/*
	 * **********************
	 * END OF SORTING METHODS
	 * **********************
	 */
	

	/**
	 * This deletes an application from the applications page by string
	 * @param app is the full name of the application
	 */
	public void deleteApplication(String app) {
		WebElement body = driver.findElement(By.cssSelector("tbody"));
		
		int x = 1;
		while (true) {
			try {
				WebElement application = body.findElement(By.cssSelector("tr:nth-child(" + x + ")"));
				WebElement name = application.findElement(By.cssSelector("td:nth-child(1"));
				if (name.getText().equals(app)) {
					WebElement delete = application.findElement(By.cssSelector("span.fa-lg.action-item"));
					delete.click();
				}
				x++;
			}
			catch (NoSuchElementException e) {
				System.out.println("did not work");
				break;
			}
		}	
	}

	/**
	 * this will locate the search bar and input a search parameter. It must be run
	 * @param searchParam is the string inputed into the search box
	 */
	public void search(String searchParam) {
		WebElement searchBox = driver.findElement(By.cssSelector("wu-search"));
		WebElement input = searchBox.findElement(By.cssSelector("input"));
		input.sendKeys(searchParam);
	}

	/**
	 * this will clear the text in the search box.
	 * can only be run if the search() method has been run first
	 */
	public void cancelSearch() {
		WebElement clear = driver.findElement(By.cssSelector("button.clear"));
		clear.click();
	}
	

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
			WebElement dialog = (new WebDriverWait(driver, 5)).until(ExpectedConditions.presenceOfElementLocated(
					By.cssSelector("div#" + s + ".modal.fade.in")));
		} catch (TimeoutException e) {
			return true;
		}
		return false;
	}
	
	

	/**
	 * closes the browser
	 */
	public void closeDriver() {
		driver.quit();
	}

	public void waitForProjectLoad(String projectName)
	{

		WebDriverWait wait = new WebDriverWait(driver, 5);
		wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".activated-item")));

	}

}