package com.project.marketplaceplatform.dto;

import lombok.Data;

@Data
public class AuthCredentialsRequest {

    private String email;
    private String password;
}