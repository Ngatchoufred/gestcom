package com.gestcom.demo.repositories;

import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.enums.Etat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatArticleRepository extends JpaRepository<CatArticle, Long> {
    CatArticle findByCategorie(String categie);

    @Modifying
    @Query("UPDATE CatArticle cat SET cat.etatCat = :etat WHERE cat.id = :id")
    void updateEtatCatById(Long id, Etat etat);

    List<CatArticle> findByEtatCat(Etat etat);
    Optional<CatArticle> findByIdAndEtatCat(Long id, Etat etat);
}
