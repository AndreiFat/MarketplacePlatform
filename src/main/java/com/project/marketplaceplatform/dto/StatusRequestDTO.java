package com.project.marketplaceplatform.dto;

import lombok.Data;

import java.util.List;

@Data
public class StatusRequestDTO {
    private List<OrderStatus> statusHistory;
}
