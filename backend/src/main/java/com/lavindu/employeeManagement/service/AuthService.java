package com.lavindu.employeeManagement.service;

import com.lavindu.employeeManagement.dto.LoginRequest;
import com.lavindu.employeeManagement.dto.LoginResponse;
import com.lavindu.employeeManagement.model.User;
import com.lavindu.employeeManagement.repo.UserRepo;
import com.lavindu.employeeManagement.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepo userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    // Login method
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            // Get user details
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            // Generate JWT token
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            
            // Return response
            LoginResponse response = new LoginResponse(token, user.getUsername(), user.getFullName(), user.getEmail(), user.getRole());

            return response;
            
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public LoginResponse refreshToken(String refreshToken){


        // validate the refresh token
        if(jwtUtil.validateToken(refreshToken)){
            //extract username
            String username = jwtUtil.extractUsername(refreshToken);

            //generate new access token
            String newAccessToken = jwtUtil.generateToken(username);

            // 4. Return new pair (optionally rotate refresh token too, here we just return the old one)
            return new LoginResponse(newAccessToken, refreshToken);
        }
        throw new RuntimeException("Invalid Refresh token");
        

        
    }
    
    // Register new user (optional - for testing)
    public User register(User user) {
        // Check if username exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Save user
        return userRepository.save(user);
    }
}