package com.gestcom.demo.repositories;

import com.gestcom.demo.entities.CatArticle;
import com.gestcom.demo.entities.Fournisseur;
import com.gestcom.demo.enums.Etat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
    Fournisseur findByNomFournisseur(String nomFournisseur);

    @Modifying
    @Query("UPDATE CatArticle cat SET cat.etatCat = :etat WHERE cat.id = :id")
    void updateEtatFournisseurById(Long id, Etat etat);

    List<Fournisseur> findByEtatFournisseur(Etat etat);
    Optional<Fournisseur> findByIdAndEtatFournisseur(Long id, Etat etat);
}
