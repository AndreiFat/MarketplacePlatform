package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.DiscountCoupon;
import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.service.DiscoundCouponsService;
import com.project.marketplaceplatform.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/discountCoupons")
public class DiscountCouponsController {
    @Autowired
    DiscoundCouponsService discoundCouponsService;

    @PostMapping("/addCoupon")
    public DiscountCoupon createCoupon(@RequestBody DiscountCoupon discountCoupon){
        discoundCouponsService.create(discountCoupon);
        return discountCoupon;
    }

    @GetMapping("/viewCoupons")
    public List<?> getAllCoupons(){
        return discoundCouponsService.getAll();
    }

    @GetMapping("/{couponId}")
    public Optional<DiscountCoupon> getCoupon(@PathVariable Long couponId){
        return discoundCouponsService.findById(couponId);
    }

    @PutMapping("/editCoupon/{couponId}")
    public ResponseEntity<DiscountCoupon> editCoupon(@PathVariable Long couponId, @RequestBody DiscountCoupon discountCoupon){
        return discoundCouponsService.update(couponId, discountCoupon);
    }

    @DeleteMapping("/deleteCoupon/{couponId}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long couponId){
        discoundCouponsService.deleteById(couponId);
        return ResponseEntity.ok("The coupon was deleted!");
    }
}
