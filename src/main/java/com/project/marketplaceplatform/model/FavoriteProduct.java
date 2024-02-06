package com.project.marketplaceplatform.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "favoriteProducts")
@Data
public class FavoriteProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Product productId;

    @ManyToOne(optional = false)
    private User userId;
}
