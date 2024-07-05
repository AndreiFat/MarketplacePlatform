package com.project.marketplaceplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class StatusRequestDTO {
    private List<OrderStatus> statusHistory;

    public StatusRequestDTO() {
        this.statusHistory = new ArrayList<>();  // Initialize the list here
    }

    public void addStatus(OrderStatus status) {
        this.statusHistory.add(status);
    }
}

