package com.project.marketplaceplatform.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "invoices")
@Data
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne   //o singura factura apartine unei singure comenzi
    private Order orderId;
    private int invoiceNumber;
    private String invoiceSeries;
    @ManyToOne(optional = false)
    private User userId;
    @ManyToOne(optional = false)
    private User sellerId;
    private int discount;
}
