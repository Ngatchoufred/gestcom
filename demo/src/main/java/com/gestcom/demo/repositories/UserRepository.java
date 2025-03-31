package com.gestcom.demo.repositories;

import com.gestcom.demo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    // Find a user by username
    UserEntity findByUserNameAndPwd(String userName, String pwd);
    UserEntity findRoleByUserName(String userName);

    UserEntity findByUserName(String userName);
}
