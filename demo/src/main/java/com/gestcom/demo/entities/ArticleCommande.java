package com.gestcom.demo.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;


@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id") // 🔹 Indique que l'id doit être utilisé comme référence
public class ArticleCommande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "article_id", nullable = false)
    //@JsonIdentityReference(alwaysAsId = true)  // ✅ Ensures only the ID is serialized
    private Article article;

    @Column(nullable = false)
    private long qte_cmd;

    @Column(nullable = false)
    private long qte_livre;
   // @JsonIgnoreProperties({"nomArticle", "quantite", "description", "datePeremption", "reference", "prixUnit", "etatArticle", "fournisseurs"})

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinColumn(name = "cmd_id", nullable = false)
    //@JsonIdentityReference(alwaysAsId = true)  // ✅ Ensures only the ID is serialized
    private Commande cmd;

    @Column(nullable = false)
    private long prix_U;

    @Column(nullable = false)
    private long reference;

    @Column(nullable = false)
    private long references_recues;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Article getArticle_id() {
        return article;
    }

    public void setArticle_id(Article article) {
        this.article = article;
    }

    public long getQte_cmd() {
        return qte_cmd;
    }

    public void setQte_cmd(long qte_cmd) {
        this.qte_cmd = qte_cmd;
    }

    public long getQte_livre() {
        return qte_livre;
    }

    public void setQte_livre(long qte_livre) {
        this.qte_livre = qte_livre;
    }

    public Commande getCmd_id() {
        return cmd;
    }

    public void setCmd_id(Commande cmd_id) {
        this.cmd = cmd_id;
    }

    public long getPrix_U() {
        return prix_U;
    }

    public void setPrix_U(long prix_U) {
        this.prix_U = prix_U;
    }

    public long getReference() {
        return reference;
    }

    public void setReference(long reference) {
        this.reference = reference;
    }

    public long getReferences_recues() {
        return references_recues;
    }

    public void setReferences_recues(long references_recues) {
        this.references_recues = references_recues;
    }
}
