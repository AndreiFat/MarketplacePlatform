package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    ProductService productService;

    @PostMapping("/addProduct")
    public Product createProduct(@RequestBody Product product){
        productService.create(product);
        return product;
    }

    @GetMapping("/viewProducts")
    public List<?> getAllProducts(){
        return productService.getAll();
    }

    @GetMapping("/{productId}")
    public Optional<Product> getProduct(@PathVariable Long productId){
        return productService.findById(productId);
    }

    @PutMapping("/editProduct/{productId}")
    public ResponseEntity<Product> editProduct(@PathVariable Long productId, @RequestBody Product product){
        return productService.update(productId, product);
    }

    @DeleteMapping("/deleteProduct/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId){
        productService.deleteById(productId);
        return ResponseEntity.ok("The product was deleted!");
    }
}
