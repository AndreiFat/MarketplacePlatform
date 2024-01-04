package com.project.marketplaceplatform.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.spi.LocaleNameProvider;

@Entity
@Table(name = "orders")
@Data
public class  Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)  //nu poate exista o comanda fara produse
    private Product productId;
    private int quantity;
    private String status;
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
