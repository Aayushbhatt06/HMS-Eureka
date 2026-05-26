package com.aayush.HMS.service;

import com.aayush.HMS.dto.request.AdmissionRequest;
import com.aayush.HMS.model.Admission;
import java.util.List;

public interface AdmissionService {
    Admission admitPatient(AdmissionRequest request);
    Admission dischargePatient(Long admissionId);
    List<Admission> getAdmissionsByPatientId(Long patientId);
    Admission getActiveAdmissionByPatientUsername(String username);
    List<Admission> getActiveAdmissions();
    List<Admission> getAdmissionsByNurse(String nurseUsername);
    Admission assignNurse(Long admissionId, Long nurseId);
    List<Admission> getAllAdmissions();
}
