package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.dto.FavProductDTO;
import com.project.marketplaceplatform.model.FavoriteProduct;
import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.repository.FavoriteProductsRepository;
import com.project.marketplaceplatform.repository.ProductRepository;
import com.project.marketplaceplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FavoriteProductsService {
    @Autowired
    FavoriteProductsRepository favoriteProductsRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    public ResponseEntity<?> toggleFavouriteProduct(FavProductDTO favProductDTO, User requestUser) {
        User user = userRepository.findById(requestUser.getId()).orElse(null);

        Product product = productRepository.findById(favProductDTO.getProduct()).orElse(null);

        if (product != null && user != null) {

            FavoriteProduct foundFavouriteProduct = favoriteProductsRepository.findByUserIdAndProductId(user, product.getId());
            if (foundFavouriteProduct == null) {
                FavoriteProduct favoriteProduct = new FavoriteProduct();
                favoriteProduct.setUserId(user);
                favoriteProduct.setProduct(product);
                return ResponseEntity.ok(favoriteProductsRepository.save(favoriteProduct));
            } else {
                favoriteProductsRepository.deleteById(foundFavouriteProduct.getId());
                return ResponseEntity.ok().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<?> getFavoriteProductsByUserId(User user) {
        User foundUser = userRepository.findById(user.getId()).orElse(null);
        List<Product> products = new ArrayList<>();
        if (foundUser != null) {
            List<FavoriteProduct> favoriteProducts = favoriteProductsRepository.findFavoriteProductsByUserId(foundUser);
            for (FavoriteProduct favoriteProduct : favoriteProducts) {
                Product product = productRepository.findById(favoriteProduct.getProduct().getId()).orElse(null);
                products.add(product);
            }
            return ResponseEntity.ok(products);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public void deleteById(Long favoriteProductId) {
        favoriteProductsRepository.deleteById(favoriteProductId);
    }
}
