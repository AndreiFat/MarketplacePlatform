package com.project.marketplaceplatform.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Time;
@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)  //nu poate exista o comanda fara produse
    private Product productId;
    private int quantity;
    private String status;
    private double price;
    private Time deliveryTime;
    @ManyToOne(optional = false)
    private User userId;
    @ManyToOne()
    private DiscountCoupon discountId;
}
