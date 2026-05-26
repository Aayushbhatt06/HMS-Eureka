package com.aayush.HMS.dto.request;

import java.time.LocalDate;

public class UserProfileUpdateRequest {
    // Generic User fields
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    // Patient specific fields
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String address;
    private String emergencyContact;

    // Doctor specific fields
    private String specialization;
    private String qualifications;
    private Integer experienceYears;

    // Nurse specific fields
    private String shiftTiming;
    private String department;

    // Receptionist specific fields
    private String counterNumber;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getQualifications() { return qualifications; }
    public void setQualifications(String qualifications) { this.qualifications = qualifications; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getShiftTiming() { return shiftTiming; }
    public void setShiftTiming(String shiftTiming) { this.shiftTiming = shiftTiming; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCounterNumber() { return counterNumber; }
    public void setCounterNumber(String counterNumber) { this.counterNumber = counterNumber; }
}
