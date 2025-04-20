package com.gestcom.demo.dto;

import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.Fournisseur;

import java.util.Collection;

public class ArticleFournisseurRequest {
    private Article article;
    private Collection<Fournisseur> fournisseur;

    public ArticleFournisseurRequest() {
    }

    public ArticleFournisseurRequest(Article article, Collection<Fournisseur> fournisseur) {
        this.article = article;
        this.fournisseur = fournisseur;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public Collection<Fournisseur> getFournisseur() {
        return fournisseur;
    }

    public void setFournisseur(Collection<Fournisseur> fournisseur) {
        this.fournisseur = fournisseur;
    }
}
