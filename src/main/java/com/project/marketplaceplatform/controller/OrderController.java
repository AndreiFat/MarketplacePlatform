package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.dto.OrderRequestDTO;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    OrderService orderService;

    @PostMapping("/addOrder")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest) {
        return orderService.createOrder(orderRequest);
    }

    @GetMapping("/viewOrders")
    public ResponseEntity<?> getAllOrders(@RequestBody User user) {
        return orderService.getOrdersByUserId(user);
    }

    @DeleteMapping("/deleteOrder/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteById(orderId);
        return ResponseEntity.ok("The order " + orderId + " was canceled!");
    }

    @GetMapping("/{orderId}/view")
    public ResponseEntity<?> getOneOrder(@PathVariable Long orderId) {
        return orderService.getOneOrder(orderId);
    }

    @GetMapping("/{orderId}/viewProducts")
    public ResponseEntity<?> getProducts(@PathVariable Long orderId) {
        return orderService.getProductsFromOrder(orderId);
    }
}
