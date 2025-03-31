package com.gestcom.demo.controllers;

import com.gestcom.demo.entities.RoleEntity;
import com.gestcom.demo.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping
    public RoleEntity createRole(@RequestBody RoleEntity role) {
        return roleService.createRole(role);
    }

    @GetMapping("/{id}")
    public Optional<RoleEntity> getRoleById(@PathVariable Integer id) {
        return roleService.getRoleById(id);
    }

    @GetMapping
    public Iterable<RoleEntity> getAllRoles() {
        return roleService.getAllRoles();
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
    }
}
