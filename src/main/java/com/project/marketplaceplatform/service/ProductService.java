package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.Image;
import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.model.Review;
import com.project.marketplaceplatform.repository.ImageRepository;
import com.project.marketplaceplatform.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ImageRepository imageRepository;

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);


    public void create(Product product) {
        productRepository.save(product);
    }

    public ResponseEntity<?> saveImagesToProduct(Long productId, MultipartFile[] files) throws IOException {
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            for (MultipartFile file : files) {

                byte[] imageBytes = file.getBytes();
                String base64Image = Base64.encodeBase64String(imageBytes);

                Image productImage = new Image();
                productImage.setProduct(product);
                productImage.setImageData(base64Image);
                imageRepository.save(productImage);
            }
            return ResponseEntity.ok().build();
        } else return ResponseEntity.notFound().build();
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product findById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
        DecimalFormat decimalFormat = new DecimalFormat("#.#");
        product.setRating(decimalFormat.format(calculateGeneralRating(product)));
        productRepository.save(product);
        return product;
    }

    public ResponseEntity<Product> update(Long productId, Product product) {
        productRepository.findById(productId).ifPresent((foundProduct -> {
            foundProduct.setName(product.getName());
            foundProduct.setCategoryId(product.getCategoryId());
            foundProduct.setDescription(product.getDescription());
            foundProduct.setPrice(product.getPrice());
            foundProduct.setRating(product.getRating());
            foundProduct.setStock(product.getStock());
            foundProduct.setPriceAfterDiscount(product.getPriceAfterDiscount());
            foundProduct.setPriceDiscount(product.getPriceDiscount());
//            foundProduct.setSellerId(product.getSellerId());
            productRepository.save(foundProduct);
        }));
        return ResponseEntity.ok().build();
    }

    @Transactional
    public void deleteById(Long productId) {
        productRepository.deleteById(productId);
    }

    public double calculateGeneralRating(Product product) {
        List<Review> reviews = product.getReviews();
        if (reviews.isEmpty()) {
            return 0.0; // or any default value if there are no reviews
        }

        double totalRating = 0.0;
        for (Review review : reviews) {
            totalRating += review.getNumberOfStars();
        }

        return totalRating / reviews.size();
    }

    public List<Product> searchProductsByNameAndCategory(String name) {
        logger.info("Searching for products with name containing '{}'", name);
        List<Product> products = productRepository.findByNameContainingIgnoreCase(name);
        logger.info("Found {} products", products.size()); // Log the number of products found
        return products;
    }
}
