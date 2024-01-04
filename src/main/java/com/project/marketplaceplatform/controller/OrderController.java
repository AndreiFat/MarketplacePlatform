package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Order;
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
    public ResponseEntity<?> createOrder(@RequestBody Order order){
        return orderService.create(order);
    }

    @GetMapping("/viewOrders")
    public ResponseEntity<?> getAllOrders(@RequestBody User user){
        return orderService.getOrdersByUserId(user);
    }

    @DeleteMapping("/deleteOrder/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId){
        orderService.deleteById(orderId);
        return ResponseEntity.ok("The order " + orderId + " was canceled!");
    }

}
