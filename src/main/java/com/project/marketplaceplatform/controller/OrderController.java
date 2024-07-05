package com.project.marketplaceplatform.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.project.marketplaceplatform.dto.OrderRequestDTO;
import com.project.marketplaceplatform.dto.ProductRequestDTO;
import com.project.marketplaceplatform.dto.StatusRequestDTO;
import com.project.marketplaceplatform.model.OrderItem;
import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.repository.OrderItemRepository;
import com.project.marketplaceplatform.repository.ProductRepository;
import com.project.marketplaceplatform.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173/")
public class OrderController {
    @Autowired
    OrderService orderService;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    ProductRepository productRepository;


    @PostMapping("/addOrder")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest, @AuthenticationPrincipal User user) throws JsonProcessingException {
        return orderService.createOrder(orderRequest, user);
    }

    @GetMapping("/viewOrders")
    public ResponseEntity<?> getAllOrders(@AuthenticationPrincipal User user) {
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

    @PutMapping("/editOrderStatus/{orderId}")
    public ResponseEntity<?> editOrderStatus(@PathVariable Long orderId, @RequestBody StatusRequestDTO status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    @GetMapping("/admin/viewOrders")
    public List<?> getAllOrders() {
        return orderService.getAll();
    }

    @PostMapping("/user/orderItems")
    public ResponseEntity<?> getAllOrderItems(@RequestBody ArrayList<ProductRequestDTO> orderItems) {
        List<Product> products = new ArrayList<>();
        for (ProductRequestDTO item : orderItems) {
            OrderItem orderorderItem = orderItemRepository.findById(item.getId()).orElse(null);
            if (orderorderItem != null) {
                Product product = productRepository.findById(orderorderItem.getProduct().getId()).orElse(null);
                products.add(product);
            }
        }
        return ResponseEntity.ok(products);
    }


}
