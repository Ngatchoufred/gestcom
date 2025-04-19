package com.gestcom.demo.controllers;

import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.entities.Fournisseur;
import com.gestcom.demo.services.CartArticleService;
import com.gestcom.demo.services.FournisseurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

    @RestController
    @RequestMapping(path = "fournisseur")
    public class FournisseurController {
        @Autowired
        private FournisseurService fournisseurService;

        public FournisseurController(FournisseurService fournisseurService) {
            this.fournisseurService = fournisseurService;
        }

        @ResponseStatus(value = HttpStatus.CREATED)
        @PostMapping(consumes = APPLICATION_JSON_VALUE)
        public void creer(@RequestBody Fournisseur fournisseur){
            this.fournisseurService.creer(fournisseur);
        }

        @GetMapping(produces = APPLICATION_JSON_VALUE)
        public List<Fournisseur> recherher(){
            return this.fournisseurService.recherche();
        }

        @GetMapping(path = "{id}", produces = APPLICATION_JSON_VALUE)
        public Fournisseur fournisseur(@PathVariable int id){
            return this.fournisseurService.lire(id);
        }
        @ResponseStatus(HttpStatus.NO_CONTENT)
        @PutMapping(path = "{id}", consumes = APPLICATION_JSON_VALUE)
        public void update(@PathVariable int id, @RequestBody Fournisseur fournisseur){
            this.fournisseurService.modifier(id,fournisseur);
        }

        @ResponseStatus(HttpStatus.NO_CONTENT)
        @PutMapping(path = "/delete/{id}")
        public void updateEtat(@PathVariable int id){
            this.fournisseurService.updateEtatFourById(id);
        }
    }
