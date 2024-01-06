package com.project.marketplaceplatform.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    private Date dateOfBirth;
    private String phoneNumber;
}
