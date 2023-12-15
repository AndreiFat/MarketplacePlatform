package com.project.marketplaceplatform.model;

import jakarta.persistence.*;
import lombok.Data;

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
    private int sellerId;
}
