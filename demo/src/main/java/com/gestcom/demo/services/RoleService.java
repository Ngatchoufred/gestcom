package com.gestcom.demo.services;

import com.gestcom.demo.entities.RoleEntity;
import com.gestcom.demo.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleService {
    @Autowired
    public RoleRepository roleRepository;
    
    public RoleEntity createRole(RoleEntity role){  return roleRepository.save(role);  }
    public Optional<RoleEntity> getRoleById(Integer id) {
        return roleRepository.findById(id);
    }

    public Iterable<RoleEntity> getAllRoles() {
        return roleRepository.findAll();
    }

    public void deleteRole(Integer id) {
        roleRepository.deleteById(id);
    }
}
