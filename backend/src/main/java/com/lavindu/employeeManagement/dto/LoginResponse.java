package com.lavindu.employeeManagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String fullName;
    private String email;
    private String role;
    
    public LoginResponse(String token, String username, String fullName, String email, String role) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    // Explicit getters for JSON serialization
    public String getToken() {
        return token;
    }

    public String getType() {
        return type;
    }

    public String getUsername() {
        return username;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}