package com.gestcom.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.enums.EtatObjetTicket;
import jakarta.persistence.*;

import java.util.Date;
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String num;

    @Column(nullable = false)
    private Date openDate;

    @Column(nullable = true)
    private Date closeDate;

    @Column(nullable = false)
    private EtatObjetTicket objet;

    @Column(nullable = false)
    private String initUser;

    @Column(nullable = true)
    private String nextUser;

    @Column(nullable = true)
    private String nextRole;

    @Column(nullable = false)
    private String motifs;

    @Column(nullable = true)
    private String treatedUsers;

    @Column(nullable = false)
    private Etat etat;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNum() {
        return num;
    }

    public void setNum(String num) {
        this.num = num;
    }

    public Date getOpenDate() {
        return openDate;
    }

    public void setOpenDate(Date openDate) {
        this.openDate = openDate;
    }

    public Date getCloseDate() {
        return closeDate;
    }

    public void setCloseDate(Date closeDate) {
        this.closeDate = closeDate;
    }

    public EtatObjetTicket getObjet() {
        return objet;
    }

    public void setObjet(EtatObjetTicket objet) {
        this.objet = objet;
    }

    public String getInitUser() {
        return initUser;
    }

    public void setInitUser(String initUser) {
        this.initUser = initUser;
    }

    public String getNextUser() {
        return nextUser;
    }

    public void setNextUser(String nextUser) {
        this.nextUser = nextUser;
    }

    public String getNextRole() {
        return nextRole;
    }

    public void setNextRole(String nextRole) {
        this.nextRole = nextRole;
    }

    public String getMotifs() {
        return motifs;
    }

    public void setMotifs(String motifs) {
        this.motifs = motifs;
    }

    public String getTreatedUsers() {
        return treatedUsers;
    }

    public void setTreatedUsers(String treatedUsers) {
        this.treatedUsers = treatedUsers;
    }

    public Etat getEtat() {
        return etat;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }

    public Ticket() {
    }

    public Ticket(com.gestcom.demo.enums.Etat etat, String treatedUsers, String motifs, String nextRole, String nextUser, String initUser, EtatObjetTicket objet, Date closeDate, Date openDate, String num, Long id) {
        this.etat = etat;
        this.treatedUsers = treatedUsers;
        this.motifs = motifs;
        this.nextRole = nextRole;
        this.nextUser = nextUser;
        this.initUser = initUser;
        this.objet = objet;
        this.closeDate = closeDate;
        this.openDate = openDate;
        this.num = num;
        this.id = id;
    }
}
