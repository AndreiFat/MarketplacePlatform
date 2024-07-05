package com.project.marketplaceplatform.dto;

import lombok.Data;

import java.util.List;

@Data
public class PaymentRequestDTO {
    List<ProductRequestDTO> products;
    private int orderId;
}
