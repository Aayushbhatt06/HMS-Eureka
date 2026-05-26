package com.aayush.HMS.service;

import com.aayush.HMS.dto.request.TreatmentRequest;
import com.aayush.HMS.model.TreatmentRecord;
import java.util.List;

public interface TreatmentService {
    TreatmentRecord addTreatment(TreatmentRequest request, String nurseUsername);
    List<TreatmentRecord> getTreatmentsByAdmission(Long admissionId);
}
