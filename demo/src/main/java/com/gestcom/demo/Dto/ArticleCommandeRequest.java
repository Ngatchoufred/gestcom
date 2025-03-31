package com.gestcom.demo.Dto;

import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.Commande;

import java.util.Collection;

public class ArticleCommandeRequest {
    private Long article_id;
    private Long qte_cmd;
    private Long qte_livre;
    private Long prix_U;
    private Long reference;
    private Long references_recues;

    // Getters
    public Long getArticle_id() {
        return article_id;
    }

    public Long getQte_cmd() {
        return qte_cmd;
    }

    public Long getQte_livre() {
        return qte_livre;
    }

    public Long getPrix_U() {
        return prix_U;
    }

    public Long getReference() {
        return reference;
    }

    public Long getReferences_recues() {
        return references_recues;
    }

    // Setters
    public void setArticle_id(Long article_id) {
        this.article_id = article_id;
    }

    public void setQte_cmd(Long qte_cmd) {
        this.qte_cmd = qte_cmd;
    }

    public void setQte_livre(Long qte_livre) {
        this.qte_livre = qte_livre;
    }

    public void setPrix_U(Long prix_U) {
        this.prix_U = prix_U;
    }

    public void setReference(Long reference) {
        this.reference = reference;
    }

    public void setReferences_recues(Long references_recues) {
        this.references_recues = references_recues;
    }
}

