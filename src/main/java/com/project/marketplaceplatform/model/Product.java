package com.project.marketplaceplatform.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    private double price;
    @Column(nullable = true) // This makes priceAfterDiscount nullable
    private double priceAfterDiscount;
    @Column(nullable = true) // This makes priceAfterDiscount nullable
    private int priceDiscount;
    @ManyToOne(optional = false)
    private Category categoryId;
    private int stock;
    private String rating;
    //    private int sellerId;
    @JsonManagedReference(value = "review-product")
    @OneToMany(mappedBy = "productId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "product-items")
    private List<OrderItem> orderItems;

    @JsonManagedReference(value = "image-product")
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();

    @JsonManagedReference(value = "favorite-products")
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteProduct> favoriteProducts = new ArrayList<>();
}
