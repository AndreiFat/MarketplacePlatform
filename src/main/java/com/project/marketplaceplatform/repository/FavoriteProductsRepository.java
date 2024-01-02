package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.FavoriteProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteProductsRepository extends JpaRepository<FavoriteProduct, Long> {
}
