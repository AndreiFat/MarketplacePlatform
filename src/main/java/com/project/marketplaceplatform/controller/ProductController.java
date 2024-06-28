package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:5173/")
public class ProductController {

    @Autowired
    ProductService productService;

    @PostMapping("/addProduct")
    public Product createProduct(@RequestBody Product product) {
        productService.create(product);
        return product;
    }

    @PostMapping("/saveImagesToProduct/{productId}")
    public ResponseEntity<?> saveImagesToProduct(@PathVariable Long productId, @RequestParam("files") MultipartFile[] files) throws IOException {
        return productService.saveImagesToProduct(productId, files);
    }

//    @GetMapping("/getAllImages/{productId}")
//    public ResponseEntity<?> getAllImages(@PathVariable Long productId) throws IOException {
//        return productService.getAllImages(productId);
//    }

    @GetMapping("/viewProducts")
    public List<?> getAllProducts() {
        return productService.getAll();
    }

    @GetMapping("/{productId}")
    public Product getProduct(@PathVariable Long productId) {
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

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String query) {
        return productService.searchProductsByName(query);
    }

    @GetMapping("/productsInCategory")
    public List<Product> getProductsByCategory(@RequestParam Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }
}
