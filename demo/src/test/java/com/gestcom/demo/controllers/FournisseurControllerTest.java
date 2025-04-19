package com.gestcom.demo.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestcom.demo.entities.Fournisseur;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.services.FournisseurService;
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

class FournisseurControllerTest {

    private MockMvc mockMvc;

    @Mock
    private FournisseurService fournisseurService;

    @InjectMocks
    private FournisseurController fournisseurController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private Fournisseur fournisseur;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(fournisseurController).build();

        fournisseur = new Fournisseur();
        fournisseur.setNomFournisseur("Test Fournisseur");
        fournisseur.setTel("123456789");
        fournisseur.setEmail("test@example.com");
        fournisseur.setEtatFournisseur(Etat.VALIDE);
    }

    @Test
    void testCreerFournisseur() throws Exception {
        // Convert Fournisseur object to JSON
        String jsonRequest = objectMapper.writeValueAsString(fournisseur);

        // Perform POST request
        mockMvc.perform(post("/fournisseur")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isCreated());

        // Verify that the service's create method was called
        // Use any() to match the Fournisseur argument
        verify(fournisseurService, times(1)).creer(any(Fournisseur.class));
    }


    @Test
    void testRechercherFournisseurs() throws Exception {
        // Prepare mock response
        List<Fournisseur> fournisseurs = Arrays.asList(fournisseur);
        when(fournisseurService.recherche()).thenReturn(fournisseurs);

        // Perform GET request to fetch all fournisseurs
        mockMvc.perform(get("/fournisseur")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nomFournisseur").value("Test Fournisseur"));

        // Verify the service's search method is called
        verify(fournisseurService, times(1)).recherche();
    }

    @Test
    void testGetFournisseurById() throws Exception {
        // Prepare mock response
        when(fournisseurService.lire(1)).thenReturn(fournisseur);

        // Perform GET request to fetch a fournisseur by ID
        mockMvc.perform(get("/fournisseur/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomFournisseur").value("Test Fournisseur"));

        // Verify the service's read method is called
        verify(fournisseurService, times(1)).lire(1);
    }

    @Test
    void testUpdateFournisseur() throws Exception {
        // Create a Fournisseur object to update (example)
        Fournisseur fournisseurToUpdate = new Fournisseur();
        fournisseurToUpdate.setId(1);
        fournisseurToUpdate.setNomFournisseur("Updated Fournisseur");
        fournisseurToUpdate.setTel("123456789");
        fournisseurToUpdate.setEmail("updated@example.com");
        fournisseurToUpdate.setEtatFournisseur(Etat.VALIDE); // Make sure this is a valid enum value

        // Convert Fournisseur object to JSON
        String jsonRequest = objectMapper.writeValueAsString(fournisseurToUpdate);

        // Perform PUT request
        mockMvc.perform(put("/fournisseur/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isNoContent());

        // Verify that the modifier method was called with the correct arguments
        verify(fournisseurService, times(1)).modifier(eq(1), any(Fournisseur.class));
    }


    @Test
    void testUpdateEtatFournisseur() throws Exception {
        // Perform PUT request to update the fournisseur's state
        mockMvc.perform(put("/fournisseur/delete/1"))
                .andExpect(status().isNoContent());

        // Verify that the service's updateEtatFourById method was called
        verify(fournisseurService, times(1)).updateEtatFourById(1);
    }
}
