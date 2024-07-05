package com.project.marketplaceplatform.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data

public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonManagedReference(value = "order-items")
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    private int quantity;
    @Column(columnDefinition = "LONGTEXT")
    private String status;
    @Column(columnDefinition = "TEXT")
    private String trackingNumber;
    private double price;
    private LocalDate deliveryTime;
    @CreationTimestamp
    private LocalDate createdAt;
    @ManyToOne(optional = false)
    private User userId;
    @ManyToOne()
    private DiscountCoupon discountId;
    @ManyToOne   //mai multe comenzi la aceasi adresa
    private Address addressId;
}
