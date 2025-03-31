package com.gestcom.demo.services;

import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.repositories.CatArticleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartArticleService {
    @Autowired
    private CatArticleRepository catArticleRepository;

    @Transactional
    public void creer(CatArticle catArticle){
        CatArticle categorieExistBdd = this.catArticleRepository.findByCategorie(catArticle.getCategorie());
        if (categorieExistBdd == null){
            this.catArticleRepository.save(catArticle);
        }
    }

    @Transactional
    public CatArticle lireOuCreer(CatArticle catArticle){
        CatArticle categorieExistBdd = this.catArticleRepository.findByCategorie(catArticle.getCategorie());
        if (categorieExistBdd == null){
            categorieExistBdd = this.catArticleRepository.save(catArticle);
        }
        return  categorieExistBdd;
    }

    @Transactional
    public List<CatArticle> recherche(){
        List<CatArticle> articles;
        //articles = catArticleRepository.findAll();
        articles = catArticleRepository.findByEtatCat(Etat.VALIDE);
        if(articles.isEmpty()){
            return new ArrayList<>();
        }
        return articles;
    }

    @Transactional
    public CatArticle lire(long id){
        Optional<CatArticle> optionalCategorie;
        /* optionalCategorie = this.catArticleRepository.findById(id); */
        optionalCategorie = this.catArticleRepository.findByIdAndEtatCat(id, Etat.VALIDE);
        if (optionalCategorie.isPresent()){
            return optionalCategorie.get();
        }
        return null;
        //return optionalClient.orElse(null);
    }

    @Transactional
    public CatArticle lire2(long id){
        Optional<CatArticle> optionalCategorie;
        optionalCategorie = this.catArticleRepository.findById(id);
        if (optionalCategorie.isPresent()){
            return optionalCategorie.get();
        }
        return null;
        //return optionalClient.orElse(null);
    }

    @Transactional
    public void updateEtatCatById(Long id) {
        //this.catArticleRepository.updateEtatCatById(id, Etat.NON_VALIDE);
        CatArticle catArticleBdd = this.lire(id);
        if(catArticleBdd.getId() != null){
            catArticleBdd.setEtatCat(Etat.NON_VALIDE);
            this.catArticleRepository.save(catArticleBdd);
        }
    }

    @Transactional
    public void modifier(int id, CatArticle catArticle) {
        CatArticle catArticleBdd = this.lire2(id);
        if(catArticleBdd.getId() == catArticle.getId()){
            if(catArticleBdd.getEtatCat() != catArticle.getEtatCat()){
                catArticleBdd.setEtatCat(catArticle.getEtatCat());
            }
            if(catArticleBdd.getArticles() != catArticle.getArticles()){
                catArticleBdd.setArticles(catArticle.getArticles());
            }
            if(catArticleBdd.getCategorie() != catArticle.getCategorie()){
                catArticleBdd.setCategorie(catArticle.getCategorie());
            }

            this.catArticleRepository.save(catArticleBdd);
        }
    }
}
