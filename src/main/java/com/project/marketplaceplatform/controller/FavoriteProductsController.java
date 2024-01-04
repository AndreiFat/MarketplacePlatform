package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.FavoriteProduct;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.service.FavoriteProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favoriteProducts")
public class FavoriteProductsController {

    @Autowired
    FavoriteProductsService favoriteProductsService;

    @PostMapping("/addFavoriteProduct")
    public ResponseEntity<?> createFavoriteProduct(@RequestBody FavoriteProduct favoriteProduct){
        return favoriteProductsService.create(favoriteProduct);
    }

    @GetMapping("/viewFavoriteProducts")
    public ResponseEntity<?> getAllFavoriteProducts(@RequestBody User user){
        return favoriteProductsService.getFavoriteProductsByUserId(user);
    }

    @DeleteMapping("/deleteFavoriteProduct/{favoriteProductId}")
    public ResponseEntity<?> deleteFavoriteProduct(@PathVariable Long favoriteProductId){
        favoriteProductsService.deleteById(favoriteProductId);
        return ResponseEntity.ok("The product " + favoriteProductId + " was deleted!");
    }
}
