package com.gestcom.demo.entities;

import com.gestcom.demo.enums.Etat;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.Date;

@Entity
public class Fournisseur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String nomFournisseur;

    @Column(nullable = false)
    private String tel;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Etat etatFournisseur;

    @ManyToMany
    private Collection<Article> articles;

    //Constructeurs
    public Fournisseur() {
    }
    public Fournisseur(long id, String nomFournisseur, String tel, String email, Etat etatFournisseur, Collection<Article> articles) {
        this.id = id;
        this.nomFournisseur = nomFournisseur;
        this.tel = tel;
        this.email = email;
        this.etatFournisseur = etatFournisseur;
        this.articles = articles;
    }

    //Getters et Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNomFournisseur() {
        return nomFournisseur;
    }

    public void setNomFournisseur(String nomFournisseur) {
        this.nomFournisseur = nomFournisseur;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Etat getEtatFournisseur() {
        return etatFournisseur;
    }

    public void setEtatFournisseur(Etat etatFournisseur) {
        this.etatFournisseur = etatFournisseur;
    }

    public Collection<Article> getArticles() {
        return articles;
    }

    public void setArticles(Collection<Article> articles) {
        this.articles = articles;
    }
}
