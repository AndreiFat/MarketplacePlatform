package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Category;
import com.project.marketplaceplatform.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.id = :productId")
    Product findByProductId(@Param("productId") Long productId);

    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryId(Category category);
}
