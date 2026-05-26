package com.aayush.HMS.controller;

import com.aayush.HMS.dto.request.TreatmentRequest;
import com.aayush.HMS.model.Admission;
import com.aayush.HMS.model.TreatmentRecord;
import com.aayush.HMS.repository.AdmissionRepository;
import com.aayush.HMS.service.TreatmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/treatments")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })

@Tag(name = "Treatment Management", description = "APIs for recording and retrieving patient treatments and medicines")
public class TreatmentController {

    @Autowired
    private TreatmentService treatmentService;

    @Autowired
    private AdmissionRepository admissionRepository;

    @Operation(summary = "Add a treatment / medicine record", description = "Accessible by NURSE or ADMIN. Records medicine administration and treatment details.")
    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN')")
    public ResponseEntity<TreatmentRecord> addTreatment(@RequestBody TreatmentRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(treatmentService.addTreatment(request, username));
    }

    @Operation(summary = "Get treatment records for an admission", description = "Accessible by ADMIN, DOCTOR, NURSE. PATIENT can access only their own admission records.")
    @GetMapping("/admission/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT')")
    public ResponseEntity<List<TreatmentRecord>> getTreatmentsByAdmission(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isPatient = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"));

        if (isPatient) {
            Admission admission = admissionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Admission record not found"));
            if (!admission.getPatient().getUsername().equals(username)) {
                throw new RuntimeException("Access denied: You can only view your own treatment records.");
            }
        }

        return ResponseEntity.ok(treatmentService.getTreatmentsByAdmission(id));
    }
}
