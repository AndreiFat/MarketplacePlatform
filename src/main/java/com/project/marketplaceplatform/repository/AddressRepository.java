package com.project.marketplaceplatform.repository;

import com.project.marketplaceplatform.model.Address;
import com.project.marketplaceplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAddressByUserId(User userId);
}
