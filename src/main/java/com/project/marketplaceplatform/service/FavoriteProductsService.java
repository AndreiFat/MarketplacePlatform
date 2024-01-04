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

    public ResponseEntity<?> create(FavoriteProduct favoriteProduct){
        User user = userRepository.findByUserId(favoriteProduct.getUserId().getId());
        Product product = productRepository.findByProductId(favoriteProduct.getProductId().getId());
        favoriteProduct.setUserId(user);
        favoriteProduct.setProductId(product);
        if(user != null){
            return ResponseEntity.ok(favoriteProductsRepository.save(favoriteProduct));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<?> getFavoriteProductsByUserId(User user){
        User foundUser = userRepository.findByUserId(user.getId());
        if(foundUser != null) {
            return ResponseEntity.ok(favoriteProductsRepository.findFavoriteProductByUserId(user));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    public void deleteById(Long favoriteProductId){
        favoriteProductsRepository.deleteById(favoriteProductId);
    }
}
