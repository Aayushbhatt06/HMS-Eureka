package com.aayush.HMS.model;

import com.aayush.HMS.model.enums.PaymentStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "bill")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "admission_id")
    private Admission admission;

    private Double roomCharge;
    private Double medicineCharge;
    private Double additionalCharge;
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Admission getAdmission() {
        return admission;
    }

    public void setAdmission(Admission admission) {
        this.admission = admission;
    }

    public Double getRoomCharge() {
        return roomCharge;
    }

    public void setRoomCharge(Double roomCharge) {
        this.roomCharge = roomCharge;
    }

    public Double getMedicineCharge() {
        return medicineCharge;
    }

    public void setMedicineCharge(Double medicineCharge) {
        this.medicineCharge = medicineCharge;
    }

    public Double getAdditionalCharge() {
        return additionalCharge;
    }

    public void setAdditionalCharge(Double additionalCharge) {
        this.additionalCharge = additionalCharge;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }
}
