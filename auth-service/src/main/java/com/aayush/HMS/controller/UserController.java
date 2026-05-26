package com.aayush.HMS.controller;

import com.aayush.HMS.dto.request.UserProfileUpdateRequest;
import com.aayush.HMS.model.User;
import com.aayush.HMS.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })

@Tag(name = "User Profile Management", description = "Endpoints for updating user profiles")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Update user profile", description = "Allows a RECEPTIONIST or the users themselves to update their profile details.")
    @PutMapping("/profile/{username}")
    @PreAuthorize("hasRole('RECEPTIONIST') or authentication.name == #username")
    public ResponseEntity<User> updateProfile(
            @PathVariable String username,
            @RequestBody UserProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(username, request));
    }
}
