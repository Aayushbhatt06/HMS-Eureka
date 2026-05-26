package com.aayush.HMS.service.impl;

import com.aayush.HMS.model.Admission;
import com.aayush.HMS.model.Doctor;
import com.aayush.HMS.model.Patient;
import com.aayush.HMS.repository.AdmissionRepository;
import com.aayush.HMS.repository.DoctorRepository;
import com.aayush.HMS.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AdmissionRepository admissionRepository;

    @Override
    public List<Patient> getAssignedPatients(String doctorUsername) {
        Doctor doctor = doctorRepository.findByUsername(doctorUsername)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Admission> activeAdmissions = admissionRepository.findByDoctorAndDischargeDateIsNull(doctor);

        return activeAdmissions.stream()
                .map(Admission::getPatient)
                .collect(Collectors.toList());
    }
}
