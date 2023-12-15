package com.project.marketplaceplatform.model;

import java.sql.Time;

public class Order {

    private int id;
    private int productId;
    private int quantity;
    private String status;
    private double price;
    private Time deliveryTime;
    private int userId;
    private int discountId;
}
