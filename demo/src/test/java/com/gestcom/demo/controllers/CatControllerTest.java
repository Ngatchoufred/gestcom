package com.gestcom.demo.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.services.CartArticleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CatControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CartArticleService cartArticleService;

    @InjectMocks
    private CatController catController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private CatArticle catArticle;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(catController).build();

        catArticle = new CatArticle();
        catArticle.setId(1L);
        catArticle.setCategorie("Électroniques");
    }

    @Test
    void testCreerCategorie() throws Exception {
        mockMvc.perform(post("/cat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(catArticle)))
                .andExpect(status().isCreated());

        verify(cartArticleService, times(1)).creer(any(CatArticle.class));
    }

    @Test
    void testRechercherCategories() throws Exception {
        List<CatArticle> list = Arrays.asList(catArticle);
        when(cartArticleService.recherche()).thenReturn(list);

        mockMvc.perform(get("/cat")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categorie").value("Électroniques"));

        verify(cartArticleService, times(1)).recherche();
    }

    @Test
    void testLireCategorie() throws Exception {
        when(cartArticleService.lire(1)).thenReturn(catArticle);

        mockMvc.perform(get("/cat/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categorie").value("Électroniques"));

        verify(cartArticleService, times(1)).lire(1);
    }

    @Test
    void testUpdateCategorie() throws Exception {
        mockMvc.perform(put("/cat/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(catArticle)))
                .andExpect(status().isNoContent());

        verify(cartArticleService, times(1)).modifier(eq(1), any(CatArticle.class));
    }

    @Test
    void testUpdateEtatCategorie() throws Exception {
        mockMvc.perform(put("/cat/delete/1"))
                .andExpect(status().isNoContent());

        verify(cartArticleService, times(1)).updateEtatCatById(1L);
    }
}
