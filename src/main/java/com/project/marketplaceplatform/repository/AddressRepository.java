package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Address;
import com.project.marketplaceplatform.model.DiscountCoupon;
import com.project.marketplaceplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAddressByUserId(User userId);

    @Query("SELECT a FROM Address a WHERE a.id = :addressId")
    Address findByAddressId(@Param("addressId") Long addressId);
}
