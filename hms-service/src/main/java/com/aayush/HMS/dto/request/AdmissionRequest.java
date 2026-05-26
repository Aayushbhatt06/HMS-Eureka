package com.aayush.HMS.dto.request;

import com.aayush.HMS.model.enums.RoomType;

public class AdmissionRequest {
    private Long patientId;
    private RoomType roomType;
    private String reason;

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
