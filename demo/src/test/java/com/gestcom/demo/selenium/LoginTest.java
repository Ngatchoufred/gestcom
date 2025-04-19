package com.gestcom.demo.selenium;
import org.openqa.selenium.By;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class LoginTest {

    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        // Indique le chemin vers ton chromedriver
        // Set the path to the msedgedriver executable
        System.setProperty("webdriver.edge.driver", "F:/APP/msedgedriver.exe");

        // Optional: Set Edge options (like headless, incognito, etc.)
        EdgeOptions options = new EdgeOptions();
        // options.addArguments("--headless"); // Uncomment to run headless

        // Launch Edge browser
        driver = new EdgeDriver(options); // no 'WebDriver' here
        driver.get("http://localhost:4200");
    }

    @Test
    public void testLogin() {
        // Wait for the input to be present (up to 10 seconds)
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("email")));

        // Now interact safely
        driver.findElement(By.name("email")).sendKeys("admin");
        driver.findElement(By.name("pwd")).sendKeys("fred");
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // Optional: verify login
        // assertTrue(driver.getPageSource().contains("Bienvenue"));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
