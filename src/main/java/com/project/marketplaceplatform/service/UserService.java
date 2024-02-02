package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.Authority;
import com.project.marketplaceplatform.model.Role;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public ResponseEntity<?> save(User requestUser) {
        long userCount = userRepository.countByEmail(requestUser.getEmail());
        if (userCount == 0) {
            User user = new User();
            user.setName(requestUser.getName());
            user.setSurname(requestUser.getSurname());
            user.setEmail(requestUser.getEmail());
            user.setPassword(passwordEncoder().encode(requestUser.getPassword()));
            user.setDateOfBirth(requestUser.getDateOfBirth());
            user.setPhoneNumber(requestUser.getPhoneNumber());


            // Check if there are any users in the database
            if (userRepository.count() == 0) {
                // First user gets the "ADMIN" role
                Authority authority = new Authority("ROLE_ADMIN");
                authority.setUser(user);
                user.getAuthorities().add(authority);
                user.setRole(Role.ROLE_ADMIN);
            } else {
                // Subsequent users get the "USER" role
                Authority authority = new Authority("ROLE_USER");
                authority.setUser(user);
                user.getAuthorities().add(authority);
                user.setRole(Role.ROLE_USER);
            }
            return ResponseEntity.ok(userRepository.save(user));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: User is null");
        }
    }
}