package com.gestcom.demo.controllers;

import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.ArticleFournisseurRequest;
import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.entities.Fournisseur;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.services.ArticleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.catalina.startup.Catalina;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@JdbcTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class ArticleControllerTest {
    private MockMvc mockMvc;

    @Mock
    private ArticleService articleService;

    @InjectMocks
    private ArticleController articleController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(articleController).build();
    }


    @Test
    public void testcreerArticle() throws Exception {
        Long articleId = 1L;
        ArticleFournisseurRequest request = new ArticleFournisseurRequest();
        request.setNomArticle("Updated Article");
        request.setDescription("Nouvelle description");
        request.setDatePeremption(new Date());
        request.setReference("NEW-REF");
        request.setPrixUnit(150.0);
        request.setEtatArticle(Etat.VALIDE);
        request.setQuantite(20);
        // Catégorie (sans changement)
        CatArticle categorie = new CatArticle();
        categorie.setId(2L);
        request.setCategorie(categorie);
        // 🔹 Si ton service attend une liste d’IDs au lieu d'un objet `Fournisseur`
        List<Long> fournisseursIds = Arrays.asList(3L, 5L); // Ex: Plusieurs fournisseurs
        request.setFournisseur(fournisseursIds); // Assure-toi que `setFournisseurs` existe !
        // Conversion en JSON
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequest = objectMapper.writeValueAsString(request);
        mockMvc.perform(post("/articles/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk());
        verify(articleService, times(1))
                .creerArticleAvecFournisseur(eq(articleId),any(Article.class), any(ArticleFournisseurRequest.class).getFournisseur());
    }


    @Test
    void testRechercherArticles() throws Exception {
        List<Article> articles = Arrays.asList(new Article(), new Article());
        when(articleService.recherche()).thenReturn(articles);

        mockMvc.perform(get("/art")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(articleService, times(1)).recherche();
    }

    @Test
    void testGetArticleById() throws Exception {
        Article article = new Article();
        article.setNomArticle("Test Article");
        when(articleService.lire(1)).thenReturn(article);

        mockMvc.perform(get("/art/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomArticle").value("Test Article"));

        verify(articleService, times(1)).lire(1);
    }

    @Test
    void testUpdateArticle() throws Exception {
        ArticleFournisseurRequest request = new ArticleFournisseurRequest();
        request.setNomArticle("Updated Article");
        request.setDescription("Updated Description");
        request.setDatePeremption(new Date());
        request.setReference("REF123");
        request.setPrixUnit(200.0);
        request.setEtatArticle(Etat.VALIDE);
        request.setQuantite(5);
        //Catégorie et fournisseur
        CatArticle categorie = new CatArticle();
        categorie.setId(1L);
        request.setCategorie(categorie);
        //request.setFournisseur(1);

        mockMvc.perform(put("/art/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());

        verify(articleService, times(1)).modifier(eq(1), anyLong(), any(Article.class), any(Fournisseur.class));
    }

    @Test
    void testDeleteArticle() throws Exception {
        mockMvc.perform(put("/art/delete/1"))
                .andExpect(status().isNoContent());

        verify(articleService, times(1)).updateEtatArticletById(1);
    }
}


