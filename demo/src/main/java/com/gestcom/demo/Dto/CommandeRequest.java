package com.gestcom.demo.Dto;

import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.enums.EtatObjetTicket;

import java.util.List;

public class CommandeRequest {
    private String ref;
    private EtatObjetTicket typeCmd;
    private Etat etat;
    private List<ArticleCommandeRequest> articles; // List of articles included in the command

    // Default Constructor
    public CommandeRequest() {
    }

    // Getters and Setters
    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public EtatObjetTicket getTypeCmd() {
        return typeCmd;
    }

    public void setTypeCmd(EtatObjetTicket typeCmd) {
        this.typeCmd = typeCmd;
    }

    public Etat getEtat() {
        return etat;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }

    public List<ArticleCommandeRequest> getArticles() {
        return articles;
    }

    public void setArticles(List<ArticleCommandeRequest> articles) {
        this.articles = articles;
    }
}
