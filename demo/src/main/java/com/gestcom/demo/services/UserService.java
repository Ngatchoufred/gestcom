package com.gestcom.demo.services;

import com.gestcom.demo.entities.UserEntity;
import com.gestcom.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public UserEntity createUser(UserEntity user) {
        String rawPassword = user.getPwd(); // The plain text password from the registration form
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPwd(encodedPassword); // Set the ENCODED password on the User object
        user.setlastConnection(LocalDateTime.now());
        return userRepository.save(user);
    }


    public Optional<UserEntity> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Iterable<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    //Method to authenticate user
    public UserEntity login(String userName, String pwd) {
        return userRepository.findByUserNameAndPwd(userName, pwd);
    }

    public UserEntity findRoleByUsername(String userName) {
        return userRepository.findRoleByUserName(userName);
    }
}
