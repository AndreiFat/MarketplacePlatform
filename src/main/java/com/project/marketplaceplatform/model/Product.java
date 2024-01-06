package com.project.marketplaceplatform.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String description;
    private double price;
    @ManyToOne(optional = false)
    private Category categoryId;
    private int stock;
    private double rating;
//    private int sellerId;

    @OneToMany(mappedBy = "product")
    @JsonManagedReference(value = "product-items")
    private List<OrderItem> orderItems;
}
