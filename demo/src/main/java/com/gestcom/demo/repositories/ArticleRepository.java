package com.gestcom.demo.repositories;

import com.gestcom.demo.entities.Article;
import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.enums.Etat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article,Long> {
    List<Article> findByEtatArticle(Etat etat);
    Optional<Article> findByIdAndEtatArticle(Long id, Etat etat);
    List<Article> findByCatArticle_id(long catArticle_id);
}
