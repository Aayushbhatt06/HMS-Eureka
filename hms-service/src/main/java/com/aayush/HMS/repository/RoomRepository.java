package com.aayush.HMS.repository;

import com.aayush.HMS.model.Nurse;
import com.aayush.HMS.model.Room;
import com.aayush.HMS.model.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByRoomType(RoomType roomType);
    List<Room> findByNurse(Nurse nurse);
}
