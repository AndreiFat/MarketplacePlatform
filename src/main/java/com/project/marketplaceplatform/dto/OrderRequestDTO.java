package com.project.marketplaceplatform.dto;

import com.project.marketplaceplatform.model.Address;
import com.project.marketplaceplatform.model.DiscountCoupon;
import com.project.marketplaceplatform.model.User;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    private List<ProductRequestDTO> productIds;
    private int quantity;
    private User user;
    private Address address;
    private double price;
    private DiscountCoupon discount;
}
