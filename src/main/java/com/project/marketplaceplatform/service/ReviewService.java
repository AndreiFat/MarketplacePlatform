package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.model.Review;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    ReviewRepository reviewRepository;

    public void create(Review review){
        reviewRepository.save(review);
    }

    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    public Optional<Review> findById(Long reviewId){
        return reviewRepository.findById(reviewId);
    }

    public ResponseEntity<Review> update(Long reviewId, Review review, User user) {
        if(Objects.equals(review.getUserId().getId(), user.getId())) {
            reviewRepository.findById(reviewId).ifPresent((foundReview -> {
                foundReview.setDescription(review.getDescription());
                foundReview.setNumberOfStars(review.getNumberOfStars());
                reviewRepository.save(foundReview);
            }));
        }
        return ResponseEntity.ok().build();
    }

    public void deleteById(Long reviewId){
        reviewRepository.deleteById(reviewId);
    }

}
