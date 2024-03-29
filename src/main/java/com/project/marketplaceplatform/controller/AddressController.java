package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Address;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/address")
@CrossOrigin(origins = "http://localhost:5173/")
public class AddressController {

    @Autowired
    AddressService addressService;

    @PostMapping("/addAddress")
    public ResponseEntity<?> createAddress(@RequestBody Address address, @AuthenticationPrincipal User user) {
        return addressService.create(address, user);
    }

    @GetMapping("/viewAddresses")
    public ResponseEntity<?> getAllAddressesOfUser(@AuthenticationPrincipal User user) {
        return addressService.getAddressesByUserId(user);
    }

    @PutMapping("/editAddress/{addressId}")
    public ResponseEntity<?> updateAddress(@RequestBody Address address, @PathVariable Long addressId) {
        return addressService.update(addressId, address);
    }

    @DeleteMapping("/deleteAddress/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteById(addressId);
        return ResponseEntity.ok().build();
    }
}
