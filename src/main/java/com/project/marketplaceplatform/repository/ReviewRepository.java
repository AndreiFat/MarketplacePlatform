package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    //functie declarata pentru a returna doar reviewurile de la un anumit produs
    List<Review> findReviewByProductId(Product productId);

    Long countByProductId(Product product);
}
