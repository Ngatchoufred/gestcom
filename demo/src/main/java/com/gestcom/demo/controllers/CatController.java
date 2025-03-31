package com.gestcom.demo.controllers;

import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.services.CartArticleService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "cat")
public class CatController {
    private CartArticleService cartArticleService;

    public CatController(CartArticleService cartArticleService) {
        this.cartArticleService = cartArticleService;
    }

    @ResponseStatus(value = HttpStatus.CREATED)
    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    public void creer(@RequestBody CatArticle catArticle){
        this.cartArticleService.creer(catArticle);
    }

    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public List<CatArticle> recherher(){
        return this.cartArticleService.recherche();
    }

    @GetMapping(path = "{id}", produces = APPLICATION_JSON_VALUE)
    public CatArticle catArticle(@PathVariable int id){
        return this.cartArticleService.lire(id);
    }
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "{id}", consumes = APPLICATION_JSON_VALUE)
    public void update(@PathVariable int id, @RequestBody CatArticle catArticle){
        this.cartArticleService.modifier(id,catArticle);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(path = "/delete/{id}")
    public void updateEtat(@PathVariable long id){
        this.cartArticleService.updateEtatCatById(id);
    }
}
