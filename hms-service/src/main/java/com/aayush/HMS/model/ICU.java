package com.aayush.HMS.model;

import jakarta.persistence.Entity;



@Entity


public class ICU extends Room {
    private Boolean hasVentilator;
    private Boolean hasDefibrillator;

    public Boolean getHasVentilator() { return hasVentilator; }
    public void setHasVentilator(Boolean hasVentilator) { this.hasVentilator = hasVentilator; }
    public Boolean getHasDefibrillator() { return hasDefibrillator; }
    public void setHasDefibrillator(Boolean hasDefibrillator) { this.hasDefibrillator = hasDefibrillator; }
}
