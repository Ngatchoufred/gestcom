package com.gestcom.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.enums.StatutCommand;
import com.gestcom.demo.enums.EtatObjetTicket;
import jakarta.persistence.*;

import java.util.Date;
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String ref;

    @Column(nullable = false)
    private Date dateCmd;

    @Column(nullable = true)
    private String initiateur;

    @Column(nullable = false)
    private EtatObjetTicket typeCmd;

    @ManyToOne(fetch = FetchType.LAZY) // Foreign key to Ticket
    @JoinColumn(name = "ticket_id", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Ticket ticket;

    @Column(nullable = false)
    private StatutCommand statut;

    @Column(nullable = false)
    private Etat etat;

    // Constructor
    public Commande() {
        // Default constructor required by JPA
    }

    public Commande(String ref, Date dateCmd, String initiateur, EtatObjetTicket typeCmd, Ticket ticket, StatutCommand statut, Etat etat) {
        this.ref = ref;
        this.dateCmd = dateCmd;
        this.initiateur = initiateur;
        this.typeCmd = typeCmd;
        this.ticket = ticket;
        this.etat = etat;
        this.statut = statut;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public Date getDateCmd() {
        return dateCmd;
    }

    public void setDateCmd(Date dateCmd) {
        this.dateCmd = dateCmd;
    }

    public String getInitiateur() {
        return initiateur;
    }

    public void setInitiateur(String initiateur) {
        this.initiateur = initiateur;
    }

    public EtatObjetTicket getTypeCmd() {
        return typeCmd;
    }

    public void setTypeCmd(EtatObjetTicket typeCmd) {
        this.typeCmd = typeCmd;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public StatutCommand getStatut() {
        return statut;
    }

    public void setStatut(StatutCommand statut) {
        this.statut = statut;
    }

    public Etat getEtat() {
        return etat;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }
}
