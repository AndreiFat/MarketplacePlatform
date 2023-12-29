package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
