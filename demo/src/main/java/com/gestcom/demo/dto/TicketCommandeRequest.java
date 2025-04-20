package com.gestcom.demo.dto;

import com.gestcom.demo.entities.Ticket;

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

