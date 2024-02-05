package com.project.marketplaceplatform.dto;

import com.project.marketplaceplatform.model.Address;
import com.project.marketplaceplatform.model.DiscountCoupon;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    private List<ProductRequestDTO> productIds;
    private int quantity;
    private Address address;
    private double price;
    private DiscountCoupon discount;
}
