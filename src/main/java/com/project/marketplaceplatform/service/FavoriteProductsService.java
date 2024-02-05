package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.FavoriteProduct;
import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.repository.FavoriteProductsRepository;
import com.project.marketplaceplatform.repository.ProductRepository;
import com.project.marketplaceplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class FavoriteProductsService {
    @Autowired
    FavoriteProductsRepository favoriteProductsRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    public ResponseEntity<?> toggleFavouriteProduct(FavoriteProduct favoriteProduct, User user) {
//        User user = userRepository.findByUserId(favoriteProduct.getUserId().getId());
        Product product = productRepository.findByProductId(favoriteProduct.getProductId().getId());
        if (product != null && user != null) {

            FavoriteProduct foundFavouriteProduct = favoriteProductsRepository.findByUserIdAndProductId(user, product);

            if (foundFavouriteProduct == null) {
                favoriteProduct.setUserId(user);
                favoriteProduct.setProductId(product);
                return ResponseEntity.ok(favoriteProductsRepository.save(favoriteProduct));
            } else {
                favoriteProductsRepository.delete(foundFavouriteProduct);
                return ResponseEntity.ok("Deleted!");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<?> getFavoriteProductsByUserId(Long userId) {
        User foundUser = userRepository.findByUserId(userId);
        if (foundUser != null) {
            return ResponseEntity.ok(favoriteProductsRepository.findFavoriteProductByUserId(foundUser));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public void deleteById(Long favoriteProductId) {
        favoriteProductsRepository.deleteById(favoriteProductId);
    }
}
