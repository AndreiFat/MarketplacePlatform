package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:5173/")
public class ProductController {

    @Autowired
    ProductService productService;

    @RequestMapping(value = "/addProduct", method = RequestMethod.POST, consumes = {"multipart/form-data"})
    public Product createProduct(@RequestParam Product product) throws IOException {
        productService.create(product);
        return product;
    }

    @GetMapping("/viewProducts")
    public List<?> getAllProducts() {
        return productService.getAll();
    }

    @GetMapping("/{productId}")
    public Optional<Product> getProduct(@PathVariable Long productId) {
        return productService.findById(productId);
    }

    @PutMapping("/editProduct/{productId}")
    public ResponseEntity<Product> editProduct(@PathVariable Long productId, @RequestBody Product product) {
        return productService.update(productId, product);
    }

    @DeleteMapping("/deleteProduct/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        productService.deleteById(productId);
        return ResponseEntity.ok("The product was deleted!");
    }
}
