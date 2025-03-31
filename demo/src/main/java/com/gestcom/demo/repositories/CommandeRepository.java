package com.gestcom.demo.repositories;

import com.gestcom.demo.entities.Commande;
import com.gestcom.demo.entities.Commande;
import com.gestcom.demo.enums.Etat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    Commande findByRef(String commande);

    List<Commande> findByEtat(Etat etat);
    Optional<Commande> findByIdAndEtat(Long id, Etat etat);

    //Optional<Commande> findByIdAndEtat(Long id, Etat etat);
}
