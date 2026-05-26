package com.aayush.HMS.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity

public class TreatmentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "admission_id")
    private Admission admission;

    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    @ManyToOne
    @JoinColumn(name = "nurse_id")
    private Nurse nurse;

    private String description;
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime timestamp;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Admission getAdmission() { return admission; }
    public void setAdmission(Admission admission) { this.admission = admission; }
    public Medicine getMedicine() { return medicine; }
    public void setMedicine(Medicine medicine) { this.medicine = medicine; }
    public Nurse getNurse() { return nurse; }
    public void setNurse(Nurse nurse) { this.nurse = nurse; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
