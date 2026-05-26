package com.aayush.HMS.model;

import jakarta.persistence.Entity;



@Entity


public class Receptionist extends User {
    private String counterNumber;

    public String getCounterNumber() { return counterNumber; }
    public void setCounterNumber(String counterNumber) { this.counterNumber = counterNumber; }
}
