package com.gestcom.demo.selenium;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class ArticleTest {
/*
*
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
        // Wait for the input to be present (up to 10 seconds)
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("email")));

        // Now interact safely
        driver.findElement(By.name("email")).sendKeys("admin");
        driver.findElement(By.name("pwd")).sendKeys("fred");
        driver.findElement(By.cssSelector("button[type='submit']")).click();
    }

    @Test
    void testAddArticle() {
        driver.get("http://localhost:4200/#/articles/liste");
        // Cliquer sur le bouton "Ajouter" pour ouvrir le modal
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        // Wait for the "Ajouter" button to be clickable
        WebElement addButton = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".btn.btn-success")));

        // Click on the "Add" button to open the modal
        addButton.click();

        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("reference")));

        // Remplir le formulaire d'ajout
        WebElement referenceInput = driver.findElement(By.id("reference"));
        referenceInput.sendKeys("REF123");

        WebElement nomInput = driver.findElement(By.name("nomArticle"));
        nomInput.sendKeys("Article Test");

        WebElement selectElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("categorie")));

// Utiliser la classe Select pour manipuler la dropdown
        Select select = new Select(selectElement);

// Sélectionner par la valeur (ex: id de la catégorie)
        select.selectByValue("2");

        WebElement quantiteInput = driver.findElement(By.name("quantite"));
        quantiteInput.sendKeys("10");

        WebElement descriptionInput = driver.findElement(By.name("description"));
        descriptionInput.sendKeys("C'est un article de test.");

        WebElement prixUnitInput = driver.findElement(By.name("prixUnitaire"));
        prixUnitInput.sendKeys("15.50");

        WebElement dateInput = driver.findElement(By.name("date"));
        dateInput.sendKeys("2025-12-31");

        WebElement submitButton = driver.findElement(By.cssSelector(".btn.btn-primary"));
        submitButton.click();

        // Attendre un peu que l'action se termine (facultatif, peut être amélioré avec WebDriverWait)
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Vérifier si l'article a été ajouté à la table (par exemple, par la présence de la référence)
        WebElement addedArticle = driver.findElement(By.xpath("//td[contains(text(), 'REF123')]"));
        assertNotNull(addedArticle, "L'article ajouté n'est pas visible dans la liste.");
    }

    @Test
    void testSearchArticle() {
        // Effectuer une recherche sur la page
        WebElement searchInput = driver.findElement(By.cssSelector("input.form-control"));
        searchInput.sendKeys("chips");

        // Vérifier si l'article est bien trouvé dans la table
        WebElement articleRow = driver.findElement(By.xpath("//td[contains(text(), 'Article Test')]"));
        assertNotNull(articleRow, "L'article recherché n'a pas été trouvé.");
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();  // Ferme le navigateur après le test
        }
    }
* */
}


