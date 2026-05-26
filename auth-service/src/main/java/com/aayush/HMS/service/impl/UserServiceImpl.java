package com.aayush.HMS.service.impl;

import com.aayush.HMS.dto.request.UserProfileUpdateRequest;
import com.aayush.HMS.model.*;
import com.aayush.HMS.repository.UserRepository;
import com.aayush.HMS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User updateProfile(String username, UserProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Update generic User fields if provided
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        // Update polymorphic fields based on actual user role subclass
        if (user instanceof Patient) {
            Patient patient = (Patient) user;
            if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
            if (request.getBloodGroup() != null) patient.setBloodGroup(request.getBloodGroup());
            if (request.getAddress() != null) patient.setAddress(request.getAddress());
            if (request.getEmergencyContact() != null) patient.setEmergencyContact(request.getEmergencyContact());
        } else if (user instanceof Doctor) {
            Doctor doctor = (Doctor) user;
            if (request.getSpecialization() != null) doctor.setSpecialization(request.getSpecialization());
            if (request.getQualifications() != null) doctor.setQualifications(request.getQualifications());
            if (request.getExperienceYears() != null) doctor.setExperienceYears(request.getExperienceYears());
        } else if (user instanceof Nurse) {
            Nurse nurse = (Nurse) user;
            if (request.getShiftTiming() != null) nurse.setShiftTiming(request.getShiftTiming());
            if (request.getDepartment() != null) nurse.setDepartment(request.getDepartment());
        } else if (user instanceof Receptionist) {
            Receptionist receptionist = (Receptionist) user;
            if (request.getCounterNumber() != null) receptionist.setCounterNumber(request.getCounterNumber());
        }

        return userRepository.save(user);
    }
}
