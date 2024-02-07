package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.OrderItem;
import com.project.marketplaceplatform.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByProduct(Product productId);
}
