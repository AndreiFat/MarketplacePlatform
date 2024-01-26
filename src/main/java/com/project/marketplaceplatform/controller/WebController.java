package com.project.marketplaceplatform.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/web")
@CrossOrigin(origins = "http://localhost:5173/")
public class WebController {
    @GetMapping
    ResponseEntity<?> getHomepage() {
        return ResponseEntity.ok("Hello from server!");
    }
}
