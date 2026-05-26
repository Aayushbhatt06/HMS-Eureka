package com.aayush.HMS.service;

import com.aayush.HMS.model.Room;
import com.aayush.HMS.model.Bed;
import com.aayush.HMS.model.enums.RoomType;

import com.aayush.HMS.dto.request.RoomCreationRequest;

import java.util.List;

public interface RoomService {
    Room addRoom(RoomCreationRequest request);
    Bed addBed(Long roomId, Bed bed);
    List<Room> getAllRooms();
    List<Room> getRoomsByType(RoomType type);
    List<Bed> getAvailableBedsInRoom(Long roomId);
    Room assignNurseToRoom(Long roomId, Long nurseId);
}
