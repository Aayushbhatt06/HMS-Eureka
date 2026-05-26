package com.aayush.HMS.controller;

import com.aayush.HMS.model.Nurse;
import com.aayush.HMS.repository.NurseRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nurses")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })
@Tag(name = "Nurse Management", description = "APIs for nurse operations")
public class NurseController {

    @Autowired
    private NurseRepository nurseRepository;

    @Operation(summary = "Get all registered nurses", description = "Accessible by ADMIN, RECEPTIONIST. Retrieves the list of all registered nurses in the registry.")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<List<Nurse>> getAllNurses() {
        return ResponseEntity.ok(nurseRepository.findAll());
    }
}
