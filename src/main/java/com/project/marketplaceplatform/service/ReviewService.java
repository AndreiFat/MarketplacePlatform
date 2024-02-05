package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.model.Review;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.repository.ProductRepository;
import com.project.marketplaceplatform.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    ProductRepository productRepository;

    public ResponseEntity<?> create(Review review, Long productId) {
        Product product = productRepository.findByProductId(productId);
        review.setProductId(product);
        if (product != null) {
            return ResponseEntity.ok(reviewRepository.save(review));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<?> getAllReviewsByProductId(Long productId) {
        Product product = productRepository.findByProductId(productId);
        if (product != null) {
            return ResponseEntity.ok(reviewRepository.findReviewByProductId(product));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public Optional<Review> findById(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    public ResponseEntity<Review> update(Long reviewId, Review review, User user) {
        reviewRepository.findById(reviewId).ifPresent((foundReview -> {
            foundReview.setDescription(review.getDescription());
            foundReview.setNumberOfStars(review.getNumberOfStars());
            reviewRepository.save(foundReview);
        }));
        return ResponseEntity.ok().build();
    }

    public void deleteById(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId).orElse(null);
        if (review != null && Objects.equals(review.getUserId().getId(), user.getId())) {
            reviewRepository.deleteById(reviewId);
        }
    }
}
