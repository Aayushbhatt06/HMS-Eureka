package com.aayush.HMS.controller;

import com.aayush.HMS.dto.request.PaymentVerifyRequest;
import com.aayush.HMS.dto.response.PaymentResponse;
import com.aayush.HMS.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bill")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })

@Tag(name = "Payment Management", description = "APIs for handling Razorpay payment checkouts and verification")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Operation(summary = "Initiate payment order", description = "Accessible by PATIENT, RECEPTIONIST, and ADMIN. Generates a Razorpay Order ID for checkout.")
    @PostMapping("/pay/{admissionId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<PaymentResponse> initiatePayment(@PathVariable Long admissionId) {
        return ResponseEntity.ok(paymentService.createPaymentOrder(admissionId));
    }

    @Operation(summary = "Verify payment signature", description = "Accessible by PATIENT, RECEPTIONIST, and ADMIN. Verifies the signature from Razorpay callback and updates the bill status.")
    @PostMapping("/verify")
    @PreAuthorize("hasAnyRole('PATIENT', 'RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<String> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        boolean success = paymentService.verifyPayment(request);
        if (success) {
            return ResponseEntity.ok("Payment verified and completed successfully!");
        } else {
            return ResponseEntity.badRequest().body("Payment verification failed!");
        }
    }
}
