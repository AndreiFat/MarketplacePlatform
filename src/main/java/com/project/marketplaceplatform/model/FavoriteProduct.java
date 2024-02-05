package com.project.marketplaceplatform.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "favoriteProducts")
@Data
public class FavoriteProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "product_id_id")
    @JsonBackReference(value = "favorite-product")
    private Product productId;
    @ManyToOne(optional = false)
    private User userId;
}
