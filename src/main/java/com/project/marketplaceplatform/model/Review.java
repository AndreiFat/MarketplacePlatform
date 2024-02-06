package com.project.marketplaceplatform.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "reviews")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne  //mai multe reviews la un produs
    @JoinColumn(name = "product_id_id")
    @JsonBackReference(value = "review-product")
    private Product productId;

    @ManyToOne(optional = false)
    private User userId;
    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    private int numberOfStars;
}
