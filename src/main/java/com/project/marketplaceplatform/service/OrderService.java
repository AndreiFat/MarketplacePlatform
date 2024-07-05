package com.project.marketplaceplatform.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.marketplaceplatform.dto.*;
import com.project.marketplaceplatform.model.*;
import com.project.marketplaceplatform.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

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

    @Autowired
    OrderItemRepository orderItemRepository;

    private static LocalDate calculateDeliveryDate(LocalDate orderDate, int processingTimeInDays) {
        LocalDate deliveryDate = orderDate.plusDays(processingTimeInDays);

        // Adjust delivery date to the next working day if it falls on a weekend
        while (isWeekend(deliveryDate)) {
            deliveryDate = deliveryDate.plusDays(1);
        }

        return deliveryDate;
    }

    private static boolean isWeekend(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
    }

    private static ProductDTO getProductDTO(OrderItem orderItem) {
        ProductDTO productDTO = new ProductDTO();
        Product product = orderItem.getProduct();
        productDTO.setId(product.getId());
        productDTO.setName(product.getName());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setRating(product.getRating());
        productDTO.setStock(product.getStock());
        productDTO.setCategoryId(product.getCategoryId());
        productDTO.setStock(product.getStock());
        return productDTO;
    }

    @Transactional
    public ResponseEntity<?> createOrder(OrderRequestDTO orderRequest, User user) throws JsonProcessingException {
        Order order = new Order();
        Address address;
        List<ProductRequestDTO> productIds = orderRequest.getProductIds();
        int quantity = orderRequest.getQuantity();

        double price = orderRequest.getPrice();

        try {
            address = addressRepository.findById(orderRequest.getAddress().getId()).orElseThrow(()
                    -> new EntityNotFoundException("Address not found with id: " + orderRequest.getAddress().getId()));
        } catch (EntityNotFoundException ignored) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ignored.getMessage());
        }
        DiscountCoupon discountCoupon = discountCouponsRepository.findByDiscountCouponId(orderRequest.getDiscount().getId());

        // Create initial status object
        ObjectMapper objectMapper = new ObjectMapper();
        OrderStatus initialStatus = new OrderStatus("PENDING", new Date());
        // Serialize initial status to JSON
        String initialStatusJson = objectMapper.writeValueAsString(initialStatus);

        order.setTrackingNumber("ORD" + UUID.randomUUID().toString());
        // SET ORDER PROPERTIES
        order.setQuantity(quantity);
        order.setUserId(user);
        order.setStatus(initialStatusJson);
        order.setAddressId(address);
        order.setPrice(price);
        order.setDiscountId(discountCoupon);
        order.setDeliveryTime(calculateDeliveryDate(LocalDate.now(), 3));

        for (ProductRequestDTO productDTO : productIds) {
            try {
                Product product = productRepository.findById(productDTO.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productDTO.getId()));
                product.setStock(product.getStock() - productDTO.getQuantity());
                productRepository.save(product);
                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(product);
                orderItem.setQuantity(productDTO.getQuantity());
                orderItem.setOrder(order);
                order.getOrderItems().add(orderItem);
            } catch (EntityNotFoundException ignored) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ignored.getMessage());
            }
        }
        return ResponseEntity.ok(orderRepository.save(order));
    }

    public ResponseEntity<?> getOrdersByUserId(User user) {
        User foundUser = userRepository.findByUserId(user.getId());
        if (foundUser != null) {
            return ResponseEntity.ok(orderRepository.findOrderByUserId(user));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public void deleteById(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    public ResponseEntity<?> getOneOrder(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));
            return ResponseEntity.ok(order);
        } catch (EntityNotFoundException entityNotFoundException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(entityNotFoundException.getMessage());
        }
    }

    public ResponseEntity<?> getProductsFromOrder(Long orderId) {
        List<ProductDTO> products = new ArrayList<>();

        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));
            List<OrderItem> orderItems = order.getOrderItems();
            for (OrderItem orderItem : orderItems) {
                ProductDTO productDTO = getProductDTO(orderItem);
                products.add(productDTO);
            }
            return ResponseEntity.ok(products);
        } catch (EntityNotFoundException entityNotFoundException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(entityNotFoundException.getMessage());
        }
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public ResponseEntity<Order> updateOrderStatus(Long orderId, StatusRequestDTO statusUpdateDTO) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();

            // Convert StatusUpdateDTO to JSON string
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                String statusJson = objectMapper.writeValueAsString(statusUpdateDTO);
                order.setStatus(statusJson);

                // Save updated order
                orderRepository.save(order);

                return ResponseEntity.ok(order);
            } catch (JsonProcessingException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}