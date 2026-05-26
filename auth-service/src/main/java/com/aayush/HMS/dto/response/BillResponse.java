package com.aayush.HMS.dto.response;

public class BillResponse {
    private Long admissionId;
    private String patientName;
    private String roomNumber;
    private String roomType;
    private Long daysStayed;
    private Double roomCharge;
    private Double medicineCharge;
    private Double additionalCharge;
    private Double totalAmount;
    private String status;

    public Long getAdmissionId() { return admissionId; }
    public void setAdmissionId(Long admissionId) { this.admissionId = admissionId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public Long getDaysStayed() { return daysStayed; }
    public void setDaysStayed(Long daysStayed) { this.daysStayed = daysStayed; }
    public Double getRoomCharge() { return roomCharge; }
    public void setRoomCharge(Double roomCharge) { this.roomCharge = roomCharge; }
    public Double getMedicineCharge() { return medicineCharge; }
    public void setMedicineCharge(Double medicineCharge) { this.medicineCharge = medicineCharge; }
    public Double getAdditionalCharge() { return additionalCharge; }
    public void setAdditionalCharge(Double additionalCharge) { this.additionalCharge = additionalCharge; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
