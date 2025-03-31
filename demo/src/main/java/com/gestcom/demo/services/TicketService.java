package com.gestcom.demo.services;

import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.entities.Ticket;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.enums.EtatObjetTicket;
import com.gestcom.demo.repositories.TicketRepository;
import com.gestcom.demo.entities.UserEntity;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;
    private HttpSession session;
    @Transactional
    public Ticket creer(Ticket ticket) {
        return ticketRepository.save(ticket);
    }
    @Transactional
    public Ticket lire (Long id){
        Optional<Ticket> optionalTicket;
        optionalTicket = this.ticketRepository.findByIdAndEtat(id, Etat.VALIDE);
        if (optionalTicket.isPresent()){
            return optionalTicket.get();
        }
        return null;
    }

    @Transactional
    public Ticket lire2 (Long id){
        Optional<Ticket> optionalTicket;
        optionalTicket = this.ticketRepository.findById(id);
        if (optionalTicket.isPresent()){
            return optionalTicket.get();
        }
        return null;
    }

    @Transactional
    public void edit(Long id, Ticket ticket){
        Ticket ticketBdd = this.lire2(id);
        if(ticketBdd.getId() == ticket.getId()){
            this.ticketRepository.save(ticket);
        }
    }

    @Transactional
    public List<Ticket> recherche(){
        List<Ticket> tickets;
        //articles = catArticleRepository.findAll();
        tickets = ticketRepository.findByEtat(Etat.VALIDE);
        if(tickets.isEmpty()){
            return new ArrayList<>();
        }
        return tickets;
    }

    @Transactional
    public void updateEtatCatById(Long id) {
        //this.catArticleRepository.updateEtatCatById(id, Etat.NON_VALIDE);
        Ticket ticketBdd = this.lire(id);
        if(ticketBdd.getId() != null){
            ticketBdd.setEtat(Etat.NON_VALIDE);
            this.ticketRepository.save(ticketBdd);
        }
    }
}
