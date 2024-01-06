package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;

    public void create(Product product) {
        productRepository.save(product);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long productId) {
        return productRepository.findById(productId);
    }

    public ResponseEntity<Product> update(Long productId, Product product) {
        productRepository.findById(productId).ifPresent((foundProduct -> {
            foundProduct.setName(product.getName());
            foundProduct.setCategoryId(product.getCategoryId());
            foundProduct.setDescription(product.getDescription());
            foundProduct.setPrice(product.getPrice());
            foundProduct.setRating(product.getRating());
            foundProduct.setStock(product.getStock());
//            foundProduct.setSellerId(product.getSellerId());
            productRepository.save(foundProduct);
        }));
        return ResponseEntity.ok().build();
    }

    public void deleteById(Long productId) {
        productRepository.deleteById(productId);
    }
}
