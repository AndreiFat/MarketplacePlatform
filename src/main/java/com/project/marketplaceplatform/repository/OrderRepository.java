package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.*;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findOrderByUserId(User userId);
    @Query("SELECT o FROM Order o WHERE o.id = :orderId")
    Order findByOrderId(@Param("orderId") Long orderId);
}
