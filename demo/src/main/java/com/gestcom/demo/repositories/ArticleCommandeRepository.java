package com.gestcom.demo.repositories;

import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.ArticleCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleCommandeRepository extends JpaRepository<ArticleCommande,Long> {
    List<ArticleCommande> findByCmd_IdAndArticle_Id (Long CmdId, Long ArticleId);
    List<ArticleCommande> findByCmd_Id(Long CmdId);


}
