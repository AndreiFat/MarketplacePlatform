package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.DiscountCoupon;
import com.project.marketplaceplatform.model.Product;
import com.project.marketplaceplatform.repository.DiscountCouponsRepository;
import com.project.marketplaceplatform.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiscoundCouponsService {
    @Autowired
    DiscountCouponsRepository discountCouponsRepository;

    public void create(DiscountCoupon discountCoupon){
        discountCouponsRepository.save(discountCoupon);
    }

    public List<DiscountCoupon> getAll() {
        return discountCouponsRepository.findAll();
    }

    public Optional<DiscountCoupon> findById(Long discountId){
        return discountCouponsRepository.findById(discountId);
    }

    public ResponseEntity<DiscountCoupon> update(Long discountId, DiscountCoupon discountCoupon) {
        discountCouponsRepository.findById(discountId).ifPresent((foundCoupon -> {
            foundCoupon.setCode(discountCoupon.getCode());
            foundCoupon.setDiscount(discountCoupon.getDiscount());
            foundCoupon.setCategoryId(discountCoupon.getCategoryId());
            discountCouponsRepository.save(foundCoupon);
        }));
        return ResponseEntity.ok().build();
    }

    public void deleteById(Long discountId){
        discountCouponsRepository.deleteById(discountId);
    }
}
