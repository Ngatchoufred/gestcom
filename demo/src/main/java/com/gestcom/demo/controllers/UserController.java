package com.gestcom.demo.controllers;

import com.gestcom.demo.entities.UserEntity;
import com.gestcom.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

        @Autowired
        private UserService userService;

        @PostMapping
        public UserEntity createUser(@RequestBody UserEntity user) {
            return userService.createUser(user);
        }

        @GetMapping("/{id}")
        public Optional<UserEntity> getUserById(@PathVariable Long id) {return userService.getUserById(id);}

        @GetMapping
        public Iterable<UserEntity> getAllUsers() {
            return userService.getAllUsers();
        }

        @DeleteMapping("/{id}")
        public void deleteUser(@PathVariable Long id) {
            userService.deleteUser(id);
        }
}
