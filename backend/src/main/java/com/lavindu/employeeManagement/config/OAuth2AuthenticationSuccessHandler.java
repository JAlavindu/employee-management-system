package com.lavindu.employeeManagement.config;

import java.io.IOException;
import java.util.Optional;

import com.lavindu.employeeManagement.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.lavindu.employeeManagement.repo.UserRepo;
import com.lavindu.employeeManagement.util.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler{

    @Autowired
    private JwtUtil jwtUtil; // Utility to generate tokens

    @Autowired
    private UserRepo userRepo; // Repository to check/save users

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Get the OAuthUser details from the authentication object
        OAuth2User oAauth2User = (OAuth2User) authentication.getPrincipal();

       // 2. Extract email (this will be the username)
        String email = oAauth2User.getAttribute("email");
        String name =  oAauth2User.getAttribute("name");
        
        if(name == null){
            name = email;
        }

        // 3. Check if user exists in DB, if not, register them
        Optional<User> userOptional = userRepo.findByUsername(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            // Register new user from Google data
            user = new User();
            user.setUsername(email);
            user.setEmail(email);
            user.setRole("USER"); // Default role
            user.setPassword(""); // No password for OAuth users
            user.setFullName(name);
            // user.setCreatedAt();
            userRepo.save(user);
        }

        //genarate application's tokens
        String accessToken = jwtUtil.generateToken(user.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        // 5. Construct the redirect URL to Angular
        // We pass tokens as query parameters (Not HttpOnly, as requested)
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:4200/login")
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();

        // 6. Perform the redirect
        getRedirectStrategy().sendRedirect(request, response, targetUrl);


    }

    


    
}
