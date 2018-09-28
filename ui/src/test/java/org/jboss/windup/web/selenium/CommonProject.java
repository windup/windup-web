package org.jboss.windup.web.selenium;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public abstract class CommonProject {

    protected WebDriver driver;

    public CommonProject()
    {
        // Create a new instance of the driver
        // Notice that the remainder of the code relies on the interface,
        // not the implementation.
        System.setProperty("webdriver.chrome.driver","/usr/bin/chromedriver");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--allow-insecure-localhost");
        options.addArguments("--networkConnectionEnabled");
        driver = new ChromeDriver(options);

        // opens up the browser
        driver.get("http://127.0.0.1:8080/");
    }
}
