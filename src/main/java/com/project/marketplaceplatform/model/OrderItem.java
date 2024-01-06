package com.project.marketplaceplatform.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "orderItems")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference(value = "product-items")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference(value = "order-items")
    private Order order;

    private int quantity;

    // other fields and methods
}