package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.DiscountCoupon;
import com.project.marketplaceplatform.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DiscountCouponsRepository extends JpaRepository<DiscountCoupon, Long> {
    @Query("SELECT d FROM DiscountCoupon d WHERE d.id = :discountCouponId")
    DiscountCoupon findByDiscountCouponId(@Param("discountCouponId") Long discountCouponId);
}
