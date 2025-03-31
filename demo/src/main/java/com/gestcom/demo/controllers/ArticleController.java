package com.gestcom.demo.controllers;

import com.gestcom.demo.entities.ArticleFournisseurRequest;
import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.Fournisseur;
import com.gestcom.demo.services.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "/art")
public class ArticleController {
    @Autowired
    private ArticleService articleService;

    @Autowired
    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @ResponseStatus(value = HttpStatus.CREATED)
    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    //public void creer(@RequestBody Article article, @RequestBody Fournisseur fournisseur){
    public void creer(@RequestBody ArticleFournisseurRequest artFour){
        Article art = new Article();
        art.setNomArticle(artFour.getNomArticle());
        art.setDescription(artFour.getDescription());
        art.setDatePeremption(artFour.getDatePeremption());
        art.setReference(artFour.getReference());
        art.setPrixUnit(artFour.getPrixUnit());
        art.setEtatArticle(artFour.getEtatArticle());
        art.setQuantite(artFour.getQuantite());
        Long idCategorie = artFour.getCategorie().getId();

        this.articleService.creerArticleAvecFournisseur(idCategorie,art,artFour.getFournisseur());
    }
    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public List<Article> recherher(){
        return this.articleService.recherche();
    }
    @GetMapping(path = "{id}", produces = APPLICATION_JSON_VALUE)
    public Article article(@PathVariable int id){
        return this.articleService.lire(id);
    }
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "{id}", consumes = APPLICATION_JSON_VALUE)
    public void update(@PathVariable int id, @RequestBody ArticleFournisseurRequest artFour){
        Article art = new Article();
        art.setNomArticle(artFour.getNomArticle());
        art.setDescription(artFour.getNomArticle());
        art.setDatePeremption(artFour.getDatePeremption());
        art.setReference(artFour.getReference());
        art.setPrixUnit(artFour.getPrixUnit());
        art.setEtatArticle(artFour.getEtatArticle());
        art.setQuantite(artFour.getQuantite());
        Long idCategorie = artFour.getCategorie().getId();

        this.articleService.modifier(id,idCategorie, art, artFour.getFournisseur());
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "/delete/{id}")
    public void updateEtat(@PathVariable int id){
        this.articleService.updateEtatArticletById(id);
    }
}