package com.aayush.HMS.service;

import com.aayush.HMS.model.Patient;
import java.util.List;

public interface DoctorService {
    List<Patient> getAssignedPatients(String doctorUsername);
}
