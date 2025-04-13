package com.gestcom.demo.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestcom.demo.Dto.ArticleCommandeRequest;
import com.gestcom.demo.Dto.CommandeRequest;
import com.gestcom.demo.Dto.TicketCommandeRequest;
import com.gestcom.demo.entities.Commande;
import com.gestcom.demo.entities.Ticket;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.services.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.Date;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ExtendWith(MockitoExtension.class)
class CommandeControllerTest {
    @Mock
    private ArticleService articleService;

    @Mock
    private CommandeService commandeService;

    @Mock
    private TicketService ticketService;

    @Mock
    private JwtService jwtService;
    @Mock
    private ArticleCommandeService articleCommandeService;

    @InjectMocks
    private CommandeController commandeController;


    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(commandeController).build();
    }

    @Test
    void testCreerCommande() throws Exception {
        // Simulation d'un utilisateur extrait du JWT
        String mockUser = "testUser";
        String mockToken = "Bearer mockJwtToken";

        // Création d'un ticket fictif
        Ticket mockTicket = new Ticket();
        mockTicket.setId(1L);
        mockTicket.setNum("T123");
        mockTicket.setOpenDate(new Date());
        mockTicket.setInitUser(mockUser);
        mockTicket.setEtat(Etat.VALIDE);

        // Création d'une commande fictive
        Commande mockCommande = new Commande();
        mockCommande.setId(1L);
        mockCommande.setRef("CMD-001");
        mockCommande.setDateCmd(new Date());
        mockCommande.setInitiateur(mockUser);
        mockCommande.setEtat(Etat.VALIDE);
        mockCommande.setTicket(mockTicket);

        // Données de la requête
        ArticleCommandeRequest articleCommandeRequest = new ArticleCommandeRequest();
        articleCommandeRequest.setArticle_id(1L);
        articleCommandeRequest.setQte_cmd(10L);
        articleCommandeRequest.setQte_livre(5L);
        articleCommandeRequest.setPrix_U(100L);
        articleCommandeRequest.setReference(123L);
        articleCommandeRequest.setReferences_recues(1L);

        CommandeRequest commandeRequest = new CommandeRequest();
        commandeRequest.setRef("CMD-001");
        commandeRequest.setArticles(Collections.singletonList(articleCommandeRequest));

        TicketCommandeRequest request = new TicketCommandeRequest();
        request.setTicket(mockTicket);
        request.setCommandeRequest(commandeRequest);

        // Simuler le service JWT
        when(jwtService.extractUsername(Mockito.anyString())).thenReturn(mockUser);

        // Simuler les créations
        when(ticketService.creer(any(Ticket.class))).thenReturn(mockTicket);
        when(commandeService.creer(any(Commande.class))).thenReturn(mockCommande);

        // Envoi de la requête HTTP POST
        mockMvc.perform(post("/commande")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", mockToken)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().string("Commande ID: 1 et Ticket ID: 1 créés avec succès."));
    }


    @Test
    void testRechercherCommandes() throws Exception {
        when(commandeService.recherche()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/commande")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void testLireCommande() throws Exception {
        Commande mockCommande = new Commande();
        mockCommande.setId(1L);
        mockCommande.setRef("CMD-001");
        when(commandeService.lire(1L)).thenReturn(mockCommande);

        mockMvc.perform(get("/commande/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.ref").value("CMD-001"));
    }

    @Test
    void testUpdateCommande() throws Exception {
        Commande mockCommande = new Commande();
        mockCommande.setId(1L);
        mockCommande.setRef("CMD-001");

        mockMvc.perform(put("/commande/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockCommande)))
                .andExpect(status().isNoContent());
    }

    @Test
    void testUpdateEtatCommande() throws Exception {
        mockMvc.perform(put("/commande/delete/1"))
                .andExpect(status().isNoContent());
    }
}