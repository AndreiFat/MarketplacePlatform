package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
