package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.DiscountCoupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountCouponsRepository extends JpaRepository<DiscountCoupon, Long> {
}
