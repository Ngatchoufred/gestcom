package com.gestcom.demo.controllers;

import com.gestcom.demo.entities.RoleEntity;
import com.gestcom.demo.entities.UserEntity;
import com.gestcom.demo.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping("api")
public class LoginController {

    @Autowired
    private UserService userService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserEntity credentials, HttpSession session) {
        UserEntity user = userService.login(credentials.getUserName(), credentials.getPwd());
        if (user != null) {
            session.setAttribute("user", credentials.getUserName());
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        }
    }
    @PostMapping(path = "/signup" ,consumes = APPLICATION_JSON_VALUE)
    public UserEntity create(@RequestBody UserEntity credentials){
        RoleEntity role = new RoleEntity();
        role.setName("admin");
        UserEntity user = new UserEntity();
        user.setUserName(credentials.getUserName());
        user.setNom(credentials.getNom());
        user.setPwd(credentials.getPwd());
        user.setEmail(credentials.getEmail());
        user.setRole(role);
        user.setlastConnection(LocalDateTime.now());

        System.out.println(credentials.getUserName());
        return userService.createUser(user);
    }
}