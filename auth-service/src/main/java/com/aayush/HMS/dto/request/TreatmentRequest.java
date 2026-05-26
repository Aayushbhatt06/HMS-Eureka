package com.aayush.HMS.dto.request;

public class TreatmentRequest {
    private Long admissionId;
    private Long medicineId;
    private String description;

    public Long getAdmissionId() { return admissionId; }
    public void setAdmissionId(Long admissionId) { this.admissionId = admissionId; }
    public Long getMedicineId() { return medicineId; }
    public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
