package com.gestcom.demo.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestcom.demo.entities.Ticket;
import com.gestcom.demo.services.CommandeService;
import com.gestcom.demo.services.TicketService;
import com.gestcom.demo.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TicketControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TicketService ticketService;

    @Mock
    private UserService userService;

    @Mock
    private CommandeService commandeService;

    @InjectMocks
    private TicketController ticketController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private Ticket ticket;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(ticketController).build();

        ticket = new Ticket();
        ticket.setId(1L);
        ticket.setMotifs("Problème de livraison");
        ticket.setOpenDate(new Date());
        ticket.setCloseDate(null);
    }

    @Test
    void testEditTicket() throws Exception {
        mockMvc.perform(put("/ticket/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ticket)))
                .andExpect(status().isNoContent());

        verify(ticketService, times(1)).edit(eq(1L), any(Ticket.class));
    }

    @Test
    void testRechercherTickets() throws Exception {
        List<Ticket> tickets = Arrays.asList(ticket);
        when(ticketService.recherche()).thenReturn(tickets);

        mockMvc.perform(get("/ticket")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].motifs").value("Problème de livraison"));

        verify(ticketService, times(1)).recherche();
    }

    @Test
    void testLireTicket() throws Exception {
        when(ticketService.lire(1L)).thenReturn(ticket);

        mockMvc.perform(get("/ticket/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.motifs").value("Problème de livraison"));

        verify(ticketService, times(1)).lire(1L);
    }

    @Test
    void testUpdateEtatTicket() throws Exception {
        mockMvc.perform(put("/ticket/delete/1"))
                .andExpect(status().isNoContent());

        verify(ticketService, times(1)).updateEtatCatById(1L);
    }

    @Test
    void testAddCloseDate() throws Exception {
        ticket.setCloseDate(new Date());

        mockMvc.perform(put("/ticket/close/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ticket)))
                .andExpect(status().isNoContent());

        verify(ticketService, times(1)).edit(eq(1L), any(Ticket.class));
    }
}
