package com.aayush.HMS.service.impl;

import com.aayush.HMS.model.Patient;
import com.aayush.HMS.model.User;
import com.aayush.HMS.repository.PatientRepository;
import com.aayush.HMS.repository.UserRepository;
import com.aayush.HMS.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    @Override
    public Patient getPatientProfile(String username) {
        return (Patient) userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
    }

    @Override
    public List<Patient> getPatientByUsername(String username) {
        return patientRepository.searchPatients(username);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
}
