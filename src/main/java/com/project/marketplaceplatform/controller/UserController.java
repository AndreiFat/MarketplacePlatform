package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173/")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/viewUser")
    public ResponseEntity<?> getUserByEmail(@RequestBody User user) {
        return userService.getUserByEmail(user);
    }

    @PutMapping("/edit/{userId}")
    public ResponseEntity<?> editUserById(@PathVariable Long userId, @RequestBody User user) {
        return userService.editUserById(userId, user);
    }
}
