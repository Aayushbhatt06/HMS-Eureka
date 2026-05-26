package com.aayush.HMS.repository;

import com.aayush.HMS.model.Bed;
import com.aayush.HMS.model.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BedRepository extends JpaRepository<Bed, Long> {
    @Query("SELECT b FROM Bed b WHERE b.room.id = :roomId AND b.isOccupied = false")
    List<Bed> findAvailableBedsInRoom(@Param("roomId") Long roomId);

    Optional<Bed> findFirstByRoom_RoomTypeAndIsOccupiedFalse(RoomType roomType);
}
