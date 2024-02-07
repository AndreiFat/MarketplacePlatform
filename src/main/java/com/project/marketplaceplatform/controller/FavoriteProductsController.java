package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.dto.FavProductDTO;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.service.FavoriteProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favoriteProducts")
@CrossOrigin(origins = "http://localhost:5173/")
public class FavoriteProductsController {

    @Autowired
    FavoriteProductsService favoriteProductsService;

    @PostMapping("/toggleProduct")
    public ResponseEntity<?> toggleFavoriteProduct(@RequestBody FavProductDTO favProductDTO, @AuthenticationPrincipal User user) {
        return favoriteProductsService.toggleFavouriteProduct(favProductDTO, user);
    }

    @GetMapping("/viewFavoriteProducts/")
    public ResponseEntity<?> getAllFavoriteProducts(@AuthenticationPrincipal User user) {
        return favoriteProductsService.getFavoriteProductsByUserId(user);
    }

    @DeleteMapping("/deleteFavoriteProduct/{favoriteProductId}")
    public ResponseEntity<?> deleteFavoriteProduct(@PathVariable Long favoriteProductId) {
        favoriteProductsService.deleteById(favoriteProductId);
        return ResponseEntity.ok("The product " + favoriteProductId + " was deleted!");
    }
}
