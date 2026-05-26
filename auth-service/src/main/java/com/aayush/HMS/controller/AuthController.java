package com.aayush.HMS.controller;

import com.aayush.HMS.dto.request.LoginRequest;
import com.aayush.HMS.dto.request.RegisterRequest;
import com.aayush.HMS.dto.response.JwtResponse;
import com.aayush.HMS.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })

@Tag(name = "Authentication", description = "Endpoints for user registration and login")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Register a new user", description = "Creates a new user. Supports all roles (PATIENT, DOCTOR, ADMIN, etc.)")
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Login user", description = "Authenticates a user and returns a JWT token.")
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
