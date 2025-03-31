package com.gestcom.demo.controllers;

import com.gestcom.demo.Dto.ArticleCommandeRequest;
import com.gestcom.demo.Dto.TicketCommandeRequest;
import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.ArticleCommande;
import com.gestcom.demo.entities.Commande;
import com.gestcom.demo.entities.Ticket;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.enums.StatutCommand;
import com.gestcom.demo.services.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "commande")
public class CommandeController {

    private final CommandeService commandeService;
    private final TicketService ticketService;
    private final ArticleCommandeService articleCommandeService;
    private final ArticleService articleService;
    private final JwtService jwtService;

    @Autowired
    public CommandeController(CommandeService commandeService,
                              TicketService ticketService,
                              ArticleCommandeService articleCommandeService,
                              ArticleService articleService,
                              JwtService jwtService) {
        this.commandeService = commandeService;
        this.ticketService = ticketService;
        this.articleCommandeService = articleCommandeService;
        this.articleService = articleService;
        this.jwtService = jwtService;
    }

    @ResponseStatus(value = HttpStatus.CREATED)
    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<?> creer(@RequestBody TicketCommandeRequest request, HttpServletRequest httpRequest) {
        try {
            // Étape 1 : Récupération et validation du JWT
            String authHeader = httpRequest.getHeader("Authorization");

            String token = authHeader.substring(7);
            String user = jwtService.extractUsername(token);


            // 📝 Étape 2 : Création du Ticket
            Ticket ticket = new Ticket();
            ticket.setNum(request.getTicket().getNum());
            ticket.setOpenDate(new Date());
            ticket.setInitUser(user);
            ticket.setNextUser(user);
            ticket.setMotifs(request.getTicket().getMotifs());
            ticket.setObjet(request.getTicket().getObjet());
            ticket.setEtat(Etat.VALIDE); // État par défaut

            Ticket createdTicket = ticketService.creer(ticket);

            // 📦 Étape 3 : Création de la Commande liée au Ticket
            Commande commande = new Commande();
            commande.setRef(request.getCommandeRequest().getRef());
            commande.setDateCmd(new Date());
            commande.setInitiateur(user);
            commande.setEtat(Etat.VALIDE);
            commande.setStatut(StatutCommand.Attente); // État par défaut
            commande.setTypeCmd(request.getTicket().getObjet());
            commande.setTicket(createdTicket);

            Commande createdCommande = commandeService.creer(commande);

            // 🏷️ Étape 4 : Traitement des articles
            for (ArticleCommandeRequest articleRequest : request.getCommandeRequest().getArticles()) {
                ArticleCommande articleCommande = new ArticleCommande();

                // Vérification de l'article
                Article article = articleService.lire2(articleRequest.getArticle_id());

                // Association des données
                articleCommande.setArticle_id(article);
                articleCommande.setCmd_id(createdCommande);
                articleCommande.setQte_cmd(articleRequest.getQte_cmd());
                articleCommande.setQte_livre(articleRequest.getQte_livre());
                articleCommande.setPrix_U(articleRequest.getPrix_U());
                articleCommande.setReference(articleRequest.getReference());
                articleCommande.setReferences_recues(articleRequest.getReferences_recues());

                // Sauvegarde de l'article lié à la commande
                articleCommandeService.creer(articleCommande);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    String.format("Commande ID: %d et Ticket ID: %d créés avec succès.",
                            createdCommande.getId(), createdTicket.getId())
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request data: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "{id}", consumes = APPLICATION_JSON_VALUE)
    public void edit(@PathVariable Long id, @RequestBody Commande commande){

        this.commandeService.edit(id, commande);
    }

    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public List<Commande> rechercher(){
        return this.commandeService.recherche();
    }

    @GetMapping(path = "{id}", produces = APPLICATION_JSON_VALUE)
    public Commande lireCommande(@PathVariable Long id){
        return this.commandeService.lire(id);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "/delete/{id}")
    public void updateEtat(@PathVariable long id){
        this.commandeService.updateEtatCatById(id);
    }
}
