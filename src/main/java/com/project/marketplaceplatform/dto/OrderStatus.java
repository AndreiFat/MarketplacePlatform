package com.project.marketplaceplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class OrderStatus {
    private String status;
    private Date timestamp;
}
