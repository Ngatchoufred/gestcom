package com.gestcom.demo.services;

import com.gestcom.demo.entities.Fournisseur;
import com.gestcom.demo.enums.Etat;
import com.gestcom.demo.repositories.FournisseurRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FournisseurService {
    @Autowired
    private FournisseurRepository fournisseurRepository;

    public void creer(Fournisseur fournisseur){
        Fournisseur fournisseurExistBdd = this.fournisseurRepository.findByNomFournisseur(fournisseur.getNomFournisseur());
        if (fournisseurExistBdd == null){
            this.fournisseurRepository.save(fournisseur);
        }
    }

    @Transactional
    public Fournisseur lireOuCreer(Fournisseur fournisseur){
        Fournisseur fournisseurExistBdd = this.fournisseurRepository.findByNomFournisseur(fournisseur.getNomFournisseur());
        if (fournisseurExistBdd == null){
            fournisseurExistBdd = this.fournisseurRepository.save(fournisseur);
        }
        return  fournisseurExistBdd;
    }

    @Transactional
    public List<Fournisseur> recherche(){
        List<Fournisseur> fournisseurs;
        //articles = catArticleRepository.findAll();
        fournisseurs = fournisseurRepository.findByEtatFournisseur(Etat.VALIDE);
        if(fournisseurs.isEmpty()){
            return new ArrayList<>();
        }
        return fournisseurs;
    }

    @Transactional
    public Fournisseur lire(long id){
        Optional<Fournisseur> optionalFournisseur;
        /* optionalCategorie = this.catArticleRepository.findById(id); */
        optionalFournisseur = this.fournisseurRepository.findByIdAndEtatFournisseur(id, Etat.VALIDE);
        if (optionalFournisseur.isPresent()){
            return optionalFournisseur.get();
        }
        return null;
        //return optionalClient.orElse(null);
    }

    @Transactional
    public Fournisseur lire2(long id){
        Optional<Fournisseur> optionalFournisseur;
        optionalFournisseur = this.fournisseurRepository.findById(id);
        if (optionalFournisseur.isPresent()){
            return optionalFournisseur.get();
        }
        return null;
        //return optionalClient.orElse(null);
    }

    @Transactional
    public void updateEtatFourById(int id) {
        //this.catArticleRepository.updateEtatCatById(id, Etat.NON_VALIDE);
        Fournisseur fournisseurBdd = this.lire(id);
        if(fournisseurBdd != null){
            fournisseurBdd.setEtatFournisseur(Etat.NON_VALIDE);
            this.fournisseurRepository.save(fournisseurBdd);
        }
    }

    @Transactional
    public void modifier(int id, Fournisseur fournisseur) {
        Fournisseur fournissuerBdd = this.lire2(id);
        if(fournissuerBdd.getId() == fournisseur.getId()){
            if(fournissuerBdd.getNomFournisseur() != fournisseur.getNomFournisseur()){
                fournissuerBdd.setNomFournisseur(fournisseur.getNomFournisseur());
            }

            if(fournissuerBdd.getEmail() != fournisseur.getEmail()){
                fournissuerBdd.setEmail(fournisseur.getEmail());
            }

            if(fournissuerBdd.getEtatFournisseur() != fournisseur.getEtatFournisseur()){
                fournissuerBdd.setEtatFournisseur(fournisseur.getEtatFournisseur());
            }

            if(fournissuerBdd.getTel() != fournisseur.getTel()){
                fournissuerBdd.setTel(fournisseur.getTel());
            }

            if(fournissuerBdd.getArticles() != fournisseur.getArticles()){
                fournissuerBdd.setArticles(fournisseur.getArticles());
            }
            this.fournisseurRepository.save(fournissuerBdd);
        }
    }
}
