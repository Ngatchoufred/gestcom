package com.gestcom.demo.entities;

import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.entities.RoleEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.Date;

import static jakarta.persistence.CascadeType.MERGE;
import static jakarta.persistence.CascadeType.PERSIST;

@Entity
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String nomArticle;

    @Column(nullable = false)
    private long quantite;

    private String description;

    @Column(nullable = true)
    private Date datePeremption;

    private String reference;

    @Column(nullable = false)
    private double prixUnit;

    @Column(nullable = false)
    private Etat etatArticle;

    @JsonBackReference
    @ManyToOne(cascade = {PERSIST, MERGE}, fetch = FetchType.LAZY)
    @JoinColumn(name = "catArticle_id", nullable = false)
    //@JsonIgnore // pour Ignorer la sérialisation de la catégorie pour chaque article
    private CatArticle catArticle;

    @ManyToMany
    @JoinTable(name = "article_fournisseur", joinColumns = @JoinColumn(name = "article_id"), inverseJoinColumns = @JoinColumn(name = "fournisseur_id"))
    private Collection<Fournisseur> fournisseurs;

    //Constructeurs
    public Article() {
    }

    public Article(Long id, String nomArticle, long quantite, String description, Date datePeremption, String reference, double prixUnit, Etat etatArticle, CatArticle catArticle, Collection<Fournisseur> fournisseurs) {
        this.id = id;
        this.nomArticle = nomArticle;
        this.quantite = quantite;
        this.description = description;
        this.datePeremption = datePeremption;
        this.reference = reference;
        this.prixUnit = prixUnit;
        this.etatArticle = etatArticle;
        this.catArticle = catArticle;
        this.fournisseurs = fournisseurs;
    }

    //Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Date getDatePeremption() {
        return datePeremption;
    }

    public void setDatePeremption(Date datePeremption) {
        this.datePeremption = datePeremption;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Collection<Fournisseur> getFournisseurs() {
        return fournisseurs;
    }

    public void setFournisseurs(Collection<Fournisseur> fournisseurs) {
        this.fournisseurs = fournisseurs;
    }

    public CatArticle getCatArticle() {
        return catArticle;
    }

    public void setCatArticle(CatArticle catArticle) {
        this.catArticle = catArticle;
    }
}
