package com.project.marketplaceplatform.controller;

import com.project.marketplaceplatform.model.Address;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.service.AddressService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/address")
public class AddressController {

    @Autowired
    AddressService addressService;

    @PostMapping("/addAddress")
    public ResponseEntity<?> createAddress(@RequestBody Address address){
        return addressService.create(address);
    }

    @GetMapping("/viewAddresses")
    public ResponseEntity<?> getAllAddressesOfUser(@RequestBody User user){
        return addressService.getAddressesByUserId(user);
    }
 }
