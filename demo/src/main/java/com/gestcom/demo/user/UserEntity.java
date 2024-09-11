package com.gestcom.demo.user;
import jakarta.persistence.*;

import java.time.DateTimeException;

@Entity
@Table(name = "user")
public class UserEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private Integer id;

        @Column(name = "nom", nullable = false, length = 255)
        private String nom;

        @Column(name = "user_name", nullable = false, length = 255)
        private String userName;

        @Column(name = "email", nullable = false, length = 255)
        private String email;

        @Column(name = "pwd", nullable = false, length = 255)
        private String pwd;

        // Mapping the role field as a foreign key
        @ManyToOne
        @JoinColumn(name = "role", nullable = false)  // 'role' is the foreign key column in the 'user' table
        private RoleEntity role;

        @Column(name = "last_connection", nullable = false, length = 255)
        private DateTimeException lastConnection;

        // Getters and Setters

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getNom() {
            return nom;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPwd() {
            return pwd;
        }

        public void setPwd(String pwd) {
            this.pwd = pwd;
        }

        public RoleEntity getRole() {
            return role;
        }

        public void setRole(RoleEntity role) {
            this.role = role;
        }

    public DateTimeException getlastConnection() {
        return lastConnection;
    }

    public void setlastConnection(DateTimeException lastConnection) {
        this.lastConnection = lastConnection;
    }
}
