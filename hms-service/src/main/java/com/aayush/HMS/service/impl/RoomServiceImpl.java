package com.aayush.HMS.service.impl;

import com.aayush.HMS.model.Bed;
import com.aayush.HMS.model.Room;
import com.aayush.HMS.model.Nurse;
import com.aayush.HMS.model.enums.RoomType;
import com.aayush.HMS.repository.BedRepository;
import com.aayush.HMS.repository.RoomRepository;
import com.aayush.HMS.repository.NurseRepository;
import com.aayush.HMS.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.aayush.HMS.dto.request.RoomCreationRequest;
import java.util.UUID;
import java.util.ArrayList;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private NurseRepository nurseRepository;

    @Override
    public Room addRoom(RoomCreationRequest request) {
        Room room = new Room();
        room.setRoomType(request.getRoomType());
        room.setPricePerDay(request.getPricePerDay());
        room.setRoomNumber(UUID.randomUUID().toString()); // Temp unique number
        
        // Auto-assign nurse to the room if any nurse exists
        List<Nurse> nurses = nurseRepository.findAll();
        if (!nurses.isEmpty()) {
            Nurse assignedNurse = null;
            int minRooms = Integer.MAX_VALUE;
            for (Nurse n : nurses) {
                int count = roomRepository.findByNurse(n).size();
                if (count < minRooms) {
                    minRooms = count;
                    assignedNurse = n;
                }
            }
            room.setNurse(assignedNurse);
        }

        room = roomRepository.save(room);
        
        // Update room number with actual ID
        room.setRoomNumber("ROOM-" + room.getId());
        room = roomRepository.save(room);
        
        // Auto-generate beds
        List<Bed> beds = new ArrayList<>();
        if (request.getCapacity() != null && request.getCapacity() > 0) {
            for (int i = 1; i <= request.getCapacity(); i++) {
                Bed bed = new Bed();
                bed.setRoom(room);
                bed.setIsOccupied(false);
                bed.setBedNumber("B-" + room.getId() + "-" + i);
                beds.add(bedRepository.save(bed));
            }
        }
        room.setBeds(beds);
        return room;
    }

    @Override
    public Bed addBed(Long roomId, Bed bed) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        bed.setRoom(room);
        bed.setIsOccupied(false);
        return bedRepository.save(bed);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public List<Room> getRoomsByType(RoomType type) {
        return roomRepository.findByRoomType(type);
    }

    @Override
    public List<Bed> getAvailableBedsInRoom(Long roomId) {
        return bedRepository.findAvailableBedsInRoom(roomId);
    }

    @Override
    public Room assignNurseToRoom(Long roomId, Long nurseId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        Nurse nurse = nurseRepository.findById(nurseId)
                .orElseThrow(() -> new RuntimeException("Nurse not found"));
        room.setNurse(nurse);
        return roomRepository.save(room);
    }
}
