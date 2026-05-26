package com.aayush.HMS.controller;

import com.aayush.HMS.model.Patient;
import com.aayush.HMS.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })

@Tag(name = "Doctor Management", description = "APIs for doctor operations")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Operation(summary = "Get assigned patients", description = "Accessible by DOCTOR. Retrieves the list of currently admitted patients assigned to the logged-in doctor.")
    @GetMapping("/my-patients")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<?> getMyPatients() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        System.out.println("[DEBUG] getMyPatients called");
        System.out.println("[DEBUG] Username: " + auth.getName());
        System.out.println("[DEBUG] Authorities: " + auth.getAuthorities());
        System.out.println("[DEBUG] Principal Type: " + auth.getPrincipal().getClass().getName());
        
        try {
            String username = auth.getName();
            return ResponseEntity.ok(doctorService.getAssignedPatients(username));
        } catch (Exception e) {
            System.err.println("[DEBUG] Exception in getMyPatients:");
            e.printStackTrace();
            throw e;
        }
    }
}
