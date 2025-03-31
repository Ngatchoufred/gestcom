package com.gestcom.demo.controllers;

import com.gestcom.demo.Dto.TicketCommandeRequest;
import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.entities.Commande;
import com.gestcom.demo.entities.Ticket;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.enums.EtatObjetTicket;
import com.gestcom.demo.services.CartArticleService;
import com.gestcom.demo.services.CommandeService;
import com.gestcom.demo.services.TicketService;
import com.gestcom.demo.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "ticket")
public class TicketController {

    private  TicketService ticketService;
    private UserService userService;
    @Autowired
    private CommandeService commandeService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }


    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "{id}", consumes = APPLICATION_JSON_VALUE)
    public void edit(@PathVariable Long id, @RequestBody Ticket ticket){
        this.ticketService.edit(id,ticket);
    }

    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public List<Ticket> recherher(){
        return this.ticketService.recherche();
    }


    @GetMapping(path = "{id}", produces = APPLICATION_JSON_VALUE)
    public Ticket ticket (@PathVariable Long id){
        return this.ticketService.lire(id);
    }


    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "/delete/{id}")
    public void updateEtat(@PathVariable long id){
        this.ticketService.updateEtatCatById(id);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "/close/{id}", consumes = APPLICATION_JSON_VALUE)
    public void addCloseDate(@PathVariable Long id, @RequestBody Ticket ticket){
        ticket.setCloseDate(new Date());
        this.ticketService.edit(id,ticket);
    }

    /*@ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "/close/{id}", consumes = APPLICATION_JSON_VALUE)
    public void adCloseDate(@PathVariable Long id, @RequestBody Ticket ticket){
        ticket.setCloseDate(new Date());
        this.ticketService.edit(id,ticket);
    }*/
}
