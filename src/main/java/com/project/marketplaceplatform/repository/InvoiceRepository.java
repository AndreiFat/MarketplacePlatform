package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Invoice;
import com.project.marketplaceplatform.model.Order;
import com.project.marketplaceplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findInvoiceBySellerId(User user);

    Invoice findByOrderId(Order orderId);
}
