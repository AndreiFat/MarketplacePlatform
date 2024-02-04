package com.project.marketplaceplatform.dto;

import com.project.marketplaceplatform.model.Authority;
import com.project.marketplaceplatform.model.Role;
import lombok.Data;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String surname;
    private String email; // emailul utilizatorului va fi username-ul

    private Role role;
    private List<Authority> authorities = new ArrayList<>();

    private Date dateOfBirth;
    private String phoneNumber;
}
