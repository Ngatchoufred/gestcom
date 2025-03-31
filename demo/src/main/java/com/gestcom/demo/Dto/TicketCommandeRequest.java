package com.gestcom.demo.Dto;

import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.Commande;
import com.gestcom.demo.entities.Ticket;

import java.util.List;

public class TicketCommandeRequest {
    private Ticket ticket;
    private CommandeRequest commandeRequest;

    // Getters and setters
    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public CommandeRequest getCommandeRequest() {
        return commandeRequest;
    }

    public void setCommandeRequest(CommandeRequest commandeRequest) {
        this.commandeRequest = commandeRequest;
    }
}

