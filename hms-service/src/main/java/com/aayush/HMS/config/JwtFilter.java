package com.aayush.HMS.config;

import com.aayush.HMS.service.CustomUserDetailsService;
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
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        System.out.println("[DEBUG] JwtFilter: Request URI: " + request.getRequestURI() + ", Method: " + request.getMethod());
        System.out.println("[DEBUG] JwtFilter: Auth Header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(token);
                System.out.println("[DEBUG] JwtFilter: Extracted username: " + username);
            } catch (Exception e) {
                System.out.println("[DEBUG] JwtFilter: Error extracting username: " + e.getMessage());
            }
        } else {
            System.out.println("[DEBUG] JwtFilter: No Bearer token found.");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("[DEBUG] JwtFilter: Loaded userDetails. Username: " + userDetails.getUsername() + ", Authorities: " + userDetails.getAuthorities());

                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("[DEBUG] JwtFilter: Set Authentication in SecurityContextHolder.");
                } else {
                    System.out.println("[DEBUG] JwtFilter: Token validation failed.");
                }
            } catch (Exception e) {
                System.out.println("[DEBUG] JwtFilter: Exception loading user details or validating token: " + e.getMessage());
                e.printStackTrace();
            }
        } else if (username != null) {
            System.out.println("[DEBUG] JwtFilter: Username found, but authentication already exists: " + SecurityContextHolder.getContext().getAuthentication().getName());
        }
        filterChain.doFilter(request, response);
    }
}
