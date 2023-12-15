package com.project.marketplaceplatform.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "addresses")
@Data
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String address;
    private String region;
    private String country;
    @ManyToOne(optional = false)  //relatia dintre entitati e obligatorie (nu poate exista adresa fara un user)
    private User userId;
}
