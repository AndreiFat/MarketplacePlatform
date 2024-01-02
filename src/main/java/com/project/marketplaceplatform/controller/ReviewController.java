package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.model.Review;
import com.project.marketplaceplatform.service.ProductService;
import com.project.marketplaceplatform.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    @PostMapping("/products/{productId}/addReview")
    public ResponseEntity<?> createReview(@RequestBody Review review, @PathVariable Long productId){
           return reviewService.create(review, productId);
    }

    @GetMapping("/products/{productId}/viewReviews")
    public ResponseEntity<?> getAllReviewsOfProduct(@PathVariable Long productId){
        return reviewService.getAllReviewsByProductId(productId);
    }

//todo de facut dupa ce facem autentificarea

//    @PutMapping("/editProduct/{productId}")
//    public ResponseEntity<Product> editProduct(@PathVariable Long productId, @RequestBody Product product){
//        return productService.update(productId, product);
//    }
//
//    @DeleteMapping("/deleteProduct/{productId}")
//    public ResponseEntity<?> deleteProduct(@PathVariable Long productId){
//        productService.deleteById(productId);
//        return ResponseEntity.ok("The product was deleted!");
//    }
}
