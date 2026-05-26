package com.aayush.HMS.service;

import com.aayush.HMS.dto.response.BillResponse;

public interface BillingService {
    BillResponse getBillForAdmission(Long admissionId);
}
