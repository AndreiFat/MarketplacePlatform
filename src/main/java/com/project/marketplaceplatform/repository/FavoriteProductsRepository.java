package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.FavoriteProduct;
import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteProductsRepository extends JpaRepository<FavoriteProduct, Long> {

    List<FavoriteProduct> findFavoriteProductByUserId(User userId);

    FavoriteProduct findByUserIdAndProductId(User userId, Product productId);
}
