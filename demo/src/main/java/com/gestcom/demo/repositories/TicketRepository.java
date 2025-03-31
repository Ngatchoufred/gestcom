package com.gestcom.demo.repositories;

import com.gestcom.demo.entities.Ticket;
import com.gestcom.demo.enums.Etat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByNum(String Num);

    List<Ticket> findByEtat(Etat etat);
    Optional<Ticket> findByIdAndObjet(Long id, Etat etat);

    Optional<Ticket> findByIdAndEtat(Long id, Etat etat);
}
