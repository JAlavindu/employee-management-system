package com.lavindu.employeeManagement.config;

import com.lavindu.employeeManagement.service.CustomUserDetailsService;
import com.lavindu.employeeManagement.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwt = null;
        
        // Extract JWT token from Authorization header
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("JWT Filter: Token received for user: " + username);
            } catch (Exception e) {
                logger.error("JWT Token extraction failed: " + e.getMessage());
                System.out.println("JWT Filter: Token extraction failed");
            }
        } else {
            System.out.println("JWT Filter: No Bearer token found in request to " + request.getRequestURI());
        }
        
        // Validate token and set authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    System.out.println("JWT Filter: Authentication successful for user: " + username);
                } else {
                    System.out.println("JWT Filter: Token validation failed for user: " + username);
                }
            } catch (Exception e) {
                logger.error("User validation failed: " + e.getMessage());
                System.out.println("JWT Filter: User validation failed: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
             if (username == null) {
                 System.out.println("JWT Filter: Username is null");
             } else {
                 System.out.println("JWT Filter: SecurityContext already has authentication");
             }
        }
        
        filterChain.doFilter(request, response);
    }
}