package com.gestcom.demo.services;


import com.gestcom.demo.entities.ArticleCommande;
import com.gestcom.demo.repositories.ArticleCommandeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleCommandeService {
    @Autowired
    private ArticleCommandeRepository articleCommandeRepository;

    public ArticleCommande creer(ArticleCommande articleCommande) {

        return articleCommandeRepository.save(articleCommande);
    }
    @Transactional
    public List<ArticleCommande> lire(long CmdId){
        List<ArticleCommande> articleCommandes;

        articleCommandes = this.articleCommandeRepository.findByCmd_Id(CmdId);
        if(articleCommandes.isEmpty()){
            return new ArrayList<>();
        }

        return articleCommandes;

    }
    @Transactional
    public List<String> getCommandArticles(long CmdId) {
        List<ArticleCommande> articleCommandes = this.articleCommandeRepository.findByCmd_Id(CmdId);

        if (articleCommandes.isEmpty()) {
            return new ArrayList<>();
        }

        return articleCommandes.stream()
                .map(ac -> ac.getArticle_id().getNomArticle()) // Extract command reference
                .distinct() // Ensure unique references
                .collect(Collectors.toList());

    }

    public boolean deleteArticleCommandeById(Long id) {
        if (articleCommandeRepository.existsById(id)) {
            articleCommandeRepository.deleteById(id);
            return true;
        }
        return false;
    }
    @Transactional
    public void modifier(long cmdId, ArticleCommande updatedArticleCommande, long articleId) {

        // Fetch the existing ArticleCommande
        ArticleCommande articleCommandeBdd = articleCommandeRepository
                .findByCmd_IdAndArticle_Id(cmdId, articleId)
                .stream()
                .findFirst()  // Ensure we get a single result
                .orElseThrow(() -> new RuntimeException(
                        "ArticleCommande with cmdId " + cmdId + " and articleId " + articleId + " not found"
                ));


        if (updatedArticleCommande.getQte_cmd() != articleCommandeBdd.getQte_cmd()) {
            articleCommandeBdd.setQte_cmd(updatedArticleCommande.getQte_cmd());
        }

        if (updatedArticleCommande.getQte_livre() != articleCommandeBdd.getQte_livre()) {
            articleCommandeBdd.setQte_livre(updatedArticleCommande.getQte_livre());
        }

        if (updatedArticleCommande.getPrix_U() != articleCommandeBdd.getPrix_U()) {
            articleCommandeBdd.setPrix_U(updatedArticleCommande.getPrix_U());
        }

        if (updatedArticleCommande.getReference() != articleCommandeBdd.getReference()) {
            articleCommandeBdd.setReference(updatedArticleCommande.getReference());
        }

        if (updatedArticleCommande.getReferences_recues() != articleCommandeBdd.getReferences_recues()) {
            articleCommandeBdd.setReferences_recues(updatedArticleCommande.getReferences_recues());
        }



        // Save only if changes were made
        articleCommandeRepository.save(articleCommandeBdd);
    }

}

