package com.gestcom.demo.controllers;

import com.gestcom.demo.entities.*;
import com.gestcom.demo.repositories.ArticleRepository;
import com.gestcom.demo.repositories.CommandeRepository;
import com.gestcom.demo.services.ArticleCommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "/commande/article")
public class ArticleCommandeController {
    @Autowired
    private ArticleCommandeService articleCommandeService;
    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private ArticleRepository articleRepository;
    @GetMapping(path = "{id}", produces = APPLICATION_JSON_VALUE)
    public List<ArticleCommande> articleCommande (@PathVariable int id){
        return this.articleCommandeService.lire(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticleCommande(@PathVariable Long id) {
        boolean isDeleted = articleCommandeService.deleteArticleCommandeById(id);

        if (isDeleted) {
            return ResponseEntity.ok("Article Commande deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Article Commande not found.");
        }
    }

    @ResponseStatus(value = HttpStatus.CREATED)
    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createArticleCommande(@RequestBody ArticleCommande newArticleCommande) {
        try {
            // Ensure required fields are present
            if (newArticleCommande.getCmd_id() == null || newArticleCommande.getArticle_id() == null) {
                return ResponseEntity.badRequest().body("cmd_id and article_id are required.");
            }

            // Check if the referenced Commande and Article exist
            Commande commande = commandeRepository.findById(newArticleCommande.getCmd_id().getId())
                    .orElseThrow(() -> new RuntimeException("Commande not found"));

            Article article = articleRepository.findById(newArticleCommande.getArticle_id().getId())
                    .orElseThrow(() -> new RuntimeException("Article not found"));

            // Create a new ArticleCommande
            ArticleCommande articleCommande = new ArticleCommande();
            articleCommande.setCmd_id(commande);
            articleCommande.setArticle_id(article);
            articleCommande.setQte_cmd(newArticleCommande.getQte_cmd());
            articleCommande.setQte_livre(newArticleCommande.getQte_livre());
            articleCommande.setPrix_U(newArticleCommande.getPrix_U());
            articleCommande.setReference(newArticleCommande.getReference());
            articleCommande.setReferences_recues(newArticleCommande.getReferences_recues());

            // Save in database
            ArticleCommande savedArticleCommande = articleCommandeService.creer(articleCommande);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedArticleCommande);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating ArticleCommande: " + e.getMessage());
        }
    }


    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "{id}/{article_id}")
    public void update(@PathVariable int id, @RequestBody ArticleCommande articleCommande,@PathVariable long article_id){
        this.articleCommandeService.modifier(id,articleCommande,article_id);
    }

}
