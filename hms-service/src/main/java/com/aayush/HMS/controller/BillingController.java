package com.aayush.HMS.controller;

import com.aayush.HMS.dto.response.BillResponse;
import com.aayush.HMS.model.Admission;
import com.aayush.HMS.repository.AdmissionRepository;
import com.aayush.HMS.service.BillingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bill")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })

@Tag(name = "Billing Management", description = "APIs for calculating and retrieving patient bills")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @Autowired
    private AdmissionRepository admissionRepository;

    @Operation(summary = "Get bill details by admission ID", description = "Accessible by ADMIN, RECEPTIONIST, and the admitted PATIENT themselves.")
    @GetMapping("/{admissionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<BillResponse> getBill(@PathVariable Long admissionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isPatient = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"));

        if (isPatient) {
            Admission admission = admissionRepository.findById(admissionId)
                    .orElseThrow(() -> new RuntimeException("Admission record not found"));
            if (!admission.getPatient().getUsername().equals(username)) {
                throw new RuntimeException("Access denied: You can only view your own bills.");
            }
        }

        return ResponseEntity.ok(billingService.getBillForAdmission(admissionId));
    }
}
