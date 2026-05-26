package com.aayush.HMS.controller;

import com.aayush.HMS.dto.request.AdmissionRequest;
import com.aayush.HMS.model.Admission;
import com.aayush.HMS.model.Patient;
import com.aayush.HMS.service.AdmissionService;
import com.aayush.HMS.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admissions")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })
@Tag(name = "Admission & Discharge Management", description = "APIs for admitting and discharging patients using automatic bed allocation")
public class AdmissionController {

    @Autowired
    private AdmissionService admissionService;

    @Autowired
    private PatientService patientService;

    @Operation(summary = "Admit a patient", description = "Accessible by RECEPTIONIST and ADMIN. Automatically allocates the first available bed based on the requested Room Type.")
    @PostMapping
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<Admission> admitPatient(@RequestBody AdmissionRequest request) {
        return ResponseEntity.ok(admissionService.admitPatient(request));
    }

    @Operation(summary = "Discharge a patient", description = "Accessible by RECEPTIONIST, DOCTOR, and ADMIN. Discharges the patient and marks the bed as unoccupied.")
    @PostMapping("/discharge/{id}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<Admission> dischargePatient(@PathVariable Long id) {
        return ResponseEntity.ok(admissionService.dischargePatient(id));
    }

    @Operation(summary = "Get all admissions of a patient", description = "Accessible by ADMIN, RECEPTIONIST, DOCTOR, and the PATIENT themselves.")
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<java.util.List<Admission>> getAdmissionsByPatientId(@PathVariable Long patientId) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        String username = auth.getName();
        boolean isPatient = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"));

        if (isPatient) {
            Patient patient = patientService.getPatientProfile(username);
            if (patient == null || !patient.getId().equals(patientId)) {
                throw new RuntimeException("Access denied: You can only view your own admissions history.");
            }
        }
        return ResponseEntity.ok(admissionService.getAdmissionsByPatientId(patientId));
    }

    @Operation(summary = "Get currently active admission of the logged-in patient", description = "Accessible by PATIENT.")
    @GetMapping("/active/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Admission> getActiveAdmission() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ResponseEntity.ok(admissionService.getActiveAdmissionByPatientUsername(username));
    }

    @Operation(summary = "Get all active admissions in the hospital", description = "Accessible by ADMIN, RECEPTIONIST, DOCTOR.")
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<java.util.List<Admission>> getActiveAdmissions() {
        return ResponseEntity.ok(admissionService.getActiveAdmissions());
    }

    @Operation(summary = "Get all admissions in the hospital", description = "Accessible by ADMIN, RECEPTIONIST.")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<java.util.List<Admission>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }

    @Operation(summary = "Get active admissions assigned to a nurse", description = "Accessible by NURSE, ADMIN.")
    @GetMapping("/nurse/{username}")
    @PreAuthorize("hasAnyRole('NURSE', 'ADMIN')")
    public ResponseEntity<java.util.List<Admission>> getAdmissionsByNurse(@PathVariable String username) {
        return ResponseEntity.ok(admissionService.getAdmissionsByNurse(username));
    }

    @Operation(summary = "Manually assign or update a nurse for an admission", description = "Accessible by ADMIN, RECEPTIONIST.")
    @PutMapping("/{id}/assign-nurse/{nurseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Admission> assignNurse(@PathVariable Long id, @PathVariable Long nurseId) {
        return ResponseEntity.ok(admissionService.assignNurse(id, nurseId));
    }
}
