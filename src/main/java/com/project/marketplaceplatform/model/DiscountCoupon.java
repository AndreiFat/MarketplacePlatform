package com.project.marketplaceplatform.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "discountCoupons")
@Data
public class DiscountCoupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private int discount;
    @ManyToOne()   //optional = true pt ca poate exista o categorie fara discount
//    @JoinColumn(name = "category_id_id")
    private Category categoryId;
}
