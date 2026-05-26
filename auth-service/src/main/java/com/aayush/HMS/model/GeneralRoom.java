package com.aayush.HMS.model;

import jakarta.persistence.Entity;



@Entity


public class GeneralRoom extends Room {
    private Boolean isAc;
    private Boolean hasTv;

    public Boolean getIsAc() { return isAc; }
    public void setIsAc(Boolean isAc) { this.isAc = isAc; }
    public Boolean getHasTv() { return hasTv; }
    public void setHasTv(Boolean hasTv) { this.hasTv = hasTv; }
}
