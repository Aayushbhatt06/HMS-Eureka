package com.aayush.HMS.controller;

import com.aayush.HMS.model.Bed;
import com.aayush.HMS.model.Room;
import com.aayush.HMS.model.enums.RoomType;
import com.aayush.HMS.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.aayush.HMS.dto.request.RoomCreationRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = { "http://localhost:5173", "https://hospital-management-system-lilac-theta.vercel.app" })

@Tag(name = "Room Management", description = "APIs for managing hospital rooms and beds")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Operation(summary = "Add a new Room with auto-generated beds", description = "Accessible by ADMIN. Pass the roomType and capacity to automatically create the room and its beds.")
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> addRoom(@RequestBody RoomCreationRequest request) {
        return ResponseEntity.ok(roomService.addRoom(request));
    }

    @Operation(summary = "Add an extra bed to an existing room", description = "Accessible by ADMIN. Adds a single bed to the specified room.")
    @PostMapping("/{roomId}/beds/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bed> addBed(@PathVariable Long roomId, @RequestBody Bed bed) {
        return ResponseEntity.ok(roomService.addBed(roomId, bed));
    }

    @Operation(summary = "Get all rooms", description = "Accessible by ADMIN, RECEPTIONIST.")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @Operation(summary = "Get rooms by type", description = "Accessible by ADMIN, RECEPTIONIST. Pass ICU or GENERAL_WARD etc.")
    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<List<Room>> getRoomsByType(@PathVariable RoomType type) {
        return ResponseEntity.ok(roomService.getRoomsByType(type));
    }

    @Operation(summary = "Get available beds in a room", description = "Accessible by ADMIN, RECEPTIONIST. Returns unoccupied beds.")
    @GetMapping("/{roomId}/beds/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<List<Bed>> getAvailableBedsInRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getAvailableBedsInRoom(roomId));
    }

    @Operation(summary = "Assign a nurse to a room", description = "Accessible by ADMIN, RECEPTIONIST.")
    @PutMapping("/{roomId}/assign-nurse/{nurseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Room> assignNurseToRoom(@PathVariable Long roomId, @PathVariable Long nurseId) {
        return ResponseEntity.ok(roomService.assignNurseToRoom(roomId, nurseId));
    }
}
