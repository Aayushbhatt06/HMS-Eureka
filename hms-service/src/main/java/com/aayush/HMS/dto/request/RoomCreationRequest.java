package com.aayush.HMS.dto.request;

import com.aayush.HMS.model.enums.RoomType;

public class RoomCreationRequest {
    private RoomType roomType;
    private Double pricePerDay;
    private Integer capacity;

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }
    public Double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(Double pricePerDay) { this.pricePerDay = pricePerDay; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}
