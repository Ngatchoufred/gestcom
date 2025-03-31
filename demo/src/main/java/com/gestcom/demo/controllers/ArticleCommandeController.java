package com.gestcom.demo.controllers;

import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.ArticleCommande;
import com.gestcom.demo.entities.ArticleFournisseurRequest;
import com.gestcom.demo.entities.Fournisseur;
import com.gestcom.demo.services.ArticleCommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "/commande/article")
public class ArticleCommandeController {
    @Autowired
    private ArticleCommandeService articleCommandeService;
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
    public void creer(@RequestBody ArticleCommande articleCommande){
        this.articleCommandeService.creer(articleCommande);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "{id}")
    public void update(@PathVariable int id, @RequestBody ArticleCommande articleCommande){
        this.articleCommandeService.modifier(id,articleCommande);
    }

}
