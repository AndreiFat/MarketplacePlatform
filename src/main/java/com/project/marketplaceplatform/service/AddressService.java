package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.Address;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.repository.AddressRepository;
import com.project.marketplaceplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AddressService {

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    UserRepository userRepository;

    public ResponseEntity<?> create(Address address, User user) {
        address.setUserId(user);
        if (user != null)
            return ResponseEntity.ok(addressRepository.save(address));
        else
            return ResponseEntity.notFound().build();
    }

    public ResponseEntity<?> getAddressesByUserId(User user) {
        User foundUser = userRepository.findByUserId(user.getId());
        if (foundUser != null) {
            return ResponseEntity.ok(addressRepository.findAddressByUserId(user));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<Address> update(Long addressId, Address address) {
        addressRepository.findById(addressId).ifPresent((foundAddress -> {
            foundAddress.setRegion(address.getRegion());
            foundAddress.setAddress(address.getAddress());
            foundAddress.setCountry(address.getCountry());
            addressRepository.save(foundAddress);
        }));
        return ResponseEntity.ok().build();
    }

    public void deleteById(Long addressId) {
        addressRepository.deleteById(addressId);
    }
}
