package com.gestcom.demo.entities;

import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.Fournisseur;
import com.gestcom.demo.enums.Etat;
import jakarta.persistence.Column;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

public class ArticleFournisseurRequest {
    private String nomArticle;
    private long quantite;
    private String description;
    private Date datePeremption;
    private String reference;
    private double prixUnit;
    private Etat etatArticle;
    private CatArticle categorie;
    private List<Long> fournisseur = new ArrayList<>();;

    public ArticleFournisseurRequest() {
    }

    public ArticleFournisseurRequest(String nomArticle, long quantite, String description, Date datePeremption, String reference, double prixUnit, Etat etatArticle, CatArticle categorie, List<Long> fournisseur) {
        this.nomArticle = nomArticle;
        this.quantite = quantite;
        this.description = description;
        this.datePeremption = datePeremption;
        this.reference = reference;
        this.prixUnit = prixUnit;
        this.etatArticle = etatArticle;
        this.categorie = categorie;
        this.fournisseur = fournisseur;
    }

    public String getNomArticle() {
        return nomArticle;
    }

    public void setNomArticle(String nomArticle) {
        this.nomArticle = nomArticle;
    }

    public long getQuantite() {
        return quantite;
    }

    public void setQuantite(long quantite) {
        this.quantite = quantite;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDatePeremption() {
        return datePeremption;
    }

    public void setDatePeremption(Date datePeremption) {
        this.datePeremption = datePeremption;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public double getPrixUnit() {
        return prixUnit;
    }

    public void setPrixUnit(double prixUnit) {
        this.prixUnit = prixUnit;
    }

    public Etat getEtatArticle() {
        return etatArticle;
    }

    public void setEtatArticle(Etat etatArticle) {
        this.etatArticle = etatArticle;
    }

    public CatArticle getCategorie() {
        return categorie;
    }

    public void setCategorie(CatArticle categorie) {
        this.categorie = categorie;
    }

    public Collection<Long> getFournisseur() {
        return fournisseur;
    }

    public void setFournisseur(List<Long> fournisseur) {
        this.fournisseur = fournisseur;
    }
}
