package com.project.marketplaceplatform.dto;

import com.project.marketplaceplatform.model.Image;
import lombok.Data;

import java.util.List;

@Data
public class ProductRequestDTO {
    private Long id;
    private String name;
    private String description;
    private int quantity;
    private double price;
    private List<Image> images;
}
