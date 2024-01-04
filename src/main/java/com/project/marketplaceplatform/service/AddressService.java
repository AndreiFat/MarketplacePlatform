package com.project.marketplaceplatform.service;

import com.project.marketplaceplatform.model.Address;
import com.project.marketplaceplatform.model.User;
import com.project.marketplaceplatform.repository.AddressRepository;
import com.project.marketplaceplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AddressService {

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    UserRepository userRepository;

    public ResponseEntity<?> create(Address address){
        User user = userRepository.findByUserId(address.getUserId().getId());
        address.setUserId(user);
        if(user != null)
            return ResponseEntity.ok(addressRepository.save(address));
        else
            return ResponseEntity.notFound().build();
    }

    public ResponseEntity<?> getAddressesByUserId(User user){
        User foundUser = userRepository.findByUserId(user.getId());
        if(foundUser != null) {
            return ResponseEntity.ok(addressRepository.findAddressByUserId(user));
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    //todo de facut editarea si stergerea in functie de user
}
