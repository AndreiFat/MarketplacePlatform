package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Review;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173/")
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    @PostMapping("/products/{productId}/addReview")
    public ResponseEntity<?> createReview(@RequestBody Review review, @PathVariable Long productId) {
        return reviewService.create(review, productId);
    }

    @GetMapping("/products/{productId}/viewReviews")
    public ResponseEntity<?> getAllReviewsOfProduct(@PathVariable Long productId) {
        return reviewService.getAllReviewsByProductId(productId);
    }

    @PutMapping("/products/editReview/{reviewId}")
    public ResponseEntity<?> editReview(@PathVariable Long reviewId, @RequestBody Review review, @AuthenticationPrincipal User user) {
        return reviewService.update(reviewId, review, user);
    }

    @DeleteMapping("/products/deleteReview/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, @AuthenticationPrincipal User user) {
        reviewService.deleteById(reviewId, user);
        return ResponseEntity.ok("The review was deleted!");
    }
}
