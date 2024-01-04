package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.*;
import com.project.marketplaceplatform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DiscountCouponsRepository discountCouponsRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    AddressRepository addressRepository;

    public ResponseEntity<?> create(Order order){
        User user = userRepository.findByUserId(order.getUserId().getId());
        DiscountCoupon discountCoupon = discountCouponsRepository.findByDiscountCouponId(order.getDiscountId().getId());
        Product product = productRepository.findByProductId(order.getProductId().getId());
        Address address = addressRepository.findByAddressId(order.getAddressId().getId());
        order.setDiscountId(discountCoupon);
        order.setProductId(product);
        order.setUserId(user);
        order.setAddressId(address);
        if(user != null && product != null){
            return ResponseEntity.ok(orderRepository.save(order));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<?> getOrdersByUserId(User user){
        User foundUser = userRepository.findByUserId(user.getId());
        if(foundUser != null) {
            return ResponseEntity.ok(orderRepository.findOrderByUserId(user));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    public void deleteById(Long orderId){
        orderRepository.deleteById(orderId);
    }

}