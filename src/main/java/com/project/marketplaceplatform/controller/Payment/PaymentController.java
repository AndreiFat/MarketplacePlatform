package com.project.marketplaceplatform.controller.Payment;

import com.project.marketplaceplatform.dto.PaymentRequestDTO;
import com.project.marketplaceplatform.dto.ProductRequestDTO;
import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.repository.ImageRepository;
import com.project.marketplaceplatform.repository.OrderRepository;
import com.project.marketplaceplatform.repository.ProductRepository;
import com.project.marketplaceplatform.service.ProductService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class PaymentController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ImageRepository imageRepository;

    @Autowired
    ProductService productService;

    @Autowired
    OrderRepository orderRepository;

    @PostMapping("/create-checkout-session")
    public Map<String, String> createCheckoutSession(@RequestBody PaymentRequestDTO paymentRequestDTO) throws StripeException {
        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:5173/");

        for (ProductRequestDTO productRequest : paymentRequestDTO.getProducts()) {
            Long productId = productRequest.getId();
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found for id: " + productId));

            long amountInBani = (long) (productRequest.getPrice() * 100); // Convert RON to bani
            // Build line item for Stripe session
            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setQuantity((long) productRequest.getQuantity())
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("ron")
                                    .setUnitAmount(amountInBani) // amount in bani
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(product.getName())
                                                    .setDescription(product.getDescription())
                                                    .build())
                                    .build())
                    .build();

            paramsBuilder.addLineItem(lineItem);

        }

        Session session = Session.create(paramsBuilder.build());

        Map<String, String> response = new HashMap<>();
        response.put("id", session.getId());

        return response;

    }

    @PostMapping("/confirm-and-update")
    public ResponseEntity<?> confirmAndStockUpdate(@RequestParam String session_id) throws StripeException {
        Session session = Session.retrieve(session_id);

        Map<String, Object> response = new HashMap<>();

        if ("paid".equals(session.getPaymentStatus())) {
//            // Retrieve the order by order_id
//            Order order = orderRepository.findById(order_id)
//                    .orElseThrow(() -> new IllegalArgumentException("Order not found for id: " + order_id));
//
//            // Iterate through each product in the order and update the stock
//            for (OrderItem orderItem : order.getOrderItems()) {
//                Long productId = orderItem.getProduct().getId();
//                int quantity = orderItem.getQuantity();
//                Product product = productRepository.findById(productId)
//                        .orElseThrow(() -> new IllegalArgumentException("Product not found for id: " + productId));
//
//                // Update stock logic here
//                product.setStock(product.getStock() - quantity);
//                productService.update(productId, product);
//            }

            response.put("stockUpdateResult", "Payment completed successfully");
//            response.put("order", order);
        } else {
            response.put("stockUpdateResult", "Payment not completed");
        }

        return ResponseEntity.ok(response);
    }
}
