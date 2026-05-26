package com.aayush.HMS.service;

import com.aayush.HMS.dto.request.PaymentVerifyRequest;
import com.aayush.HMS.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse createPaymentOrder(Long admissionId);
    boolean verifyPayment(PaymentVerifyRequest request);
}
