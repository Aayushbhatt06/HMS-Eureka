package com.aayush.HMS.service;

import com.aayush.HMS.model.Patient;
import java.util.List;

public interface PatientService {
    Patient getPatientById(Long id);
    Patient getPatientProfile(String username);
    List<Patient> getPatientByUsername(String username);
    List<Patient> getAllPatients();
}
