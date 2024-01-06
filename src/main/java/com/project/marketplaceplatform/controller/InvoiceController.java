package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Invoice;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @PostMapping("/invoices/addInvoice")
    public ResponseEntity<?> createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.create(invoice);
    }

    @GetMapping("/invoices/getAllInvoicesForSeller")
    public ResponseEntity<?> getAllInvoicesForSeller(@RequestBody User seller) {
        return invoiceService.getAllInvoicesBySellerId(seller);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> getOneInvoiceByOrder(@PathVariable Long orderId) {
        return invoiceService.getOneInvoiceForOrder(orderId);
    }
}
