package com.project.marketplaceplatform.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "reviews")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne()  //mai multe reviews la un produs
    private Product productId;
    @ManyToOne(optional = false)
    private User userId;
    private String description;
    private int numberOfStars;
}
