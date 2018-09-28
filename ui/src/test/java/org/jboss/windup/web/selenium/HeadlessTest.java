package org.jboss.windup.web.selenium;

import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
//import org.openqa.selenium.safari.SafariDriver;

import java.io.IOException;

public class HeadlessTest {

	@Test
	public void createChromeDriverHeadless() throws IOException {

//		System.setProperty("webdriver.chrome.driver", "usr/bin/chromedriver");

		ChromeOptions chromeOptions = new ChromeOptions();
		chromeOptions.setBinary("/usr/bin/chromedriver");
		chromeOptions.addArguments("headless");
		chromeOptions.addArguments("window-size=1200x600");
		chromeOptions.addArguments("--no-sandbox");

		WebDriver driver = new ChromeDriver(chromeOptions);
		
		 driver.get("http://seleniumhq.org");
	        
	        // a guarantee that the test was really executed
		 Assert.assertTrue(driver.findElement(By.id("q")).isDisplayed());
		
//		driver.get("http://127.0.0.1:8080/");

//		WebElement header = (new WebDriverWait(driver, 15))
//				.until(ExpectedConditions.presenceOfElementLocated(By.id("header-logo")));
//		System.out.println(header.getText());

		// WebDriverWait waitForUsername = new WebDriverWait(Driver, 5000);
		// waitForUsername.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));
		//
		// Driver.findElement(By.id("username")).sendKeys("tomsmith");
		// Driver.findElement(By.cssSelector("button.radius")).click();
		//
		// WebDriverWait waitForError = new WebDriverWait(Driver, 5000);
		// waitForError.until(ExpectedConditions.visibilityOfElementLocated(By.id("flash")));
		//
		// Assert.assertTrue(Driver.findElement(By.id("flash")).getText().contains("Your
		// password is invalid!"));
		driver.quit();
	}
}