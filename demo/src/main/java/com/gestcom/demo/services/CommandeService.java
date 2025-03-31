package com.gestcom.demo.services;

import com.gestcom.demo.entities.Commande;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.enums.StatutCommand;
import com.gestcom.demo.repositories.CommandeRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;
    private HttpSession session;
    @Transactional
    public Commande creer(Commande commande) {
        return commandeRepository.save(commande);
    }
    @Transactional
    public Commande lire (Long id){
        Optional<Commande> optionalCommande;
        optionalCommande = this.commandeRepository.findByIdAndEtat(id, Etat.VALIDE);
        if (optionalCommande.isPresent()){
            return optionalCommande.get();
        }
        return null;
    }
    public CommandeService(CommandeRepository commandeRepository) {
        this.commandeRepository = commandeRepository;
    }

    @Transactional
    public Commande lire2 (Long id){
        Optional<Commande> optionalCommande;
        optionalCommande = this.commandeRepository.findById(id);
        if (optionalCommande.isPresent()){
            return optionalCommande.get();
        }
        return null;
    }

    @Transactional
    public void edit(Long id, Commande commande){
        Commande commandeBdd = this.lire2(id);
        if(commandeBdd.getId() == commande.getId()){
            this.commandeRepository.save(commande);
        }
    }

    @Transactional
    public List<Commande> recherche() {
        List<Commande> commandes;
        // Use the injected repository to call the method
        commandes = commandeRepository.findByEtat(Etat.VALIDE);
        if (commandes.isEmpty()) {
            return new ArrayList<>();
        }
        return commandes;
    }

    @Transactional
    public void updateEtatCatById(Long id) {
        //this.catArticleRepository.updateEtatCatById(id, Etat.NON_VALIDE);
        Commande commandeBdd = this.lire(id);
        if(commandeBdd.getId() != null){
            commandeBdd.setEtat(Etat.NON_VALIDE);
            this.commandeRepository.save(commandeBdd);
        }
    }


}

