package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.id = :productId")
    Product findByProductId(@Param("productId") Long productId);
}
