package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.Invoice;
import com.project.marketplaceplatform.model.Order;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.repository.InvoiceRepository;
import com.project.marketplaceplatform.repository.OrderRepository;
import com.project.marketplaceplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {
    @Autowired
    InvoiceRepository invoiceRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    public ResponseEntity<?> create(Invoice invoice) {
        Order order = orderRepository.findByOrderId(invoice.getOrderId().getId());
        User seller = userRepository.findBySellerId(invoice.getSellerId().getId());
        if (order != null && seller != null) {
            invoice.setSellerId(seller);
            invoice.setOrderId(order);
            try {
                return ResponseEntity.ok(invoiceRepository.save(invoice));
            } catch (Exception exception) {
                return ResponseEntity.ok("One to One Exception!!!");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<?> getAllInvoicesBySellerId(User seller) {
        User foundSeller = userRepository.findBySellerId(seller.getId());
        if (foundSeller != null) {
            return ResponseEntity.ok(invoiceRepository.findInvoiceBySellerId(seller));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<?> getOneInvoiceForOrder(Long orderId) {
        Order foundOrder = orderRepository.findByOrderId(orderId);
        if (foundOrder != null) {
            return ResponseEntity.ok(invoiceRepository.findByOrderId(foundOrder));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
