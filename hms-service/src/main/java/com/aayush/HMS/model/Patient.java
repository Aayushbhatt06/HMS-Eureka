package com.aayush.HMS.model;

import jakarta.persistence.Entity;


import java.time.LocalDate;

@Entity


public class Patient extends User {
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String address;
    private String emergencyContact;

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
}
