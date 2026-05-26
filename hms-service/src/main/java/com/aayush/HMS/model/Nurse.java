package com.aayush.HMS.model;

import jakarta.persistence.Entity;



@Entity


public class Nurse extends User {
    private String shiftTiming;
    private String department;

    public String getShiftTiming() { return shiftTiming; }
    public void setShiftTiming(String shiftTiming) { this.shiftTiming = shiftTiming; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
