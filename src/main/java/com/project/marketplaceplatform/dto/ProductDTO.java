package com.project.marketplaceplatform.dto;

import com.project.marketplaceplatform.model.Category;
import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private double price;
    private Category categoryId;
    private int stock;
    private String rating;
    private int sellerId;
}
