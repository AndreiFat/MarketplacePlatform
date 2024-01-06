package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
}
