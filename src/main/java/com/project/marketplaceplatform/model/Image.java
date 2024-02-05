package com.project.marketplaceplatform.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //    private String imagePath;
    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    private String imageData;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference(value = "image-product")
    private Product product;
}
