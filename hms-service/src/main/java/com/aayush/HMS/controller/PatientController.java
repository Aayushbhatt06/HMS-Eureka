package com.aayush.HMS.controller;

import com.aayush.HMS.model.Patient;
import com.aayush.HMS.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })

@Tag(name = "Patient Management", description = "APIs for accessing patient profiles")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Operation(summary = "Get Patient by ID", description = "Accessible by ADMIN, DOCTOR, RECEPTIONIST. Returns full patient details.")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @Operation(summary = "Get Patient by Username", description = "Accessible by ADMIN, DOCTOR, RECEPTIONIST. Returns list of matching patient details including ID.")
    @GetMapping("/username/{username}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<List<Patient>> getPatientByUsername(@PathVariable String username) {
        return ResponseEntity.ok(patientService.getPatientByUsername(username));
    }

    @Operation(summary = "Get all patients", description = "Accessible by ADMIN, DOCTOR, RECEPTIONIST.")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @Operation(summary = "Get My Profile", description = "Accessible by PATIENT. Securely fetches the profile of the currently logged-in patient.")
    @GetMapping("/my-profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Patient> getMyProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(patientService.getPatientProfile(username));
    }
}
