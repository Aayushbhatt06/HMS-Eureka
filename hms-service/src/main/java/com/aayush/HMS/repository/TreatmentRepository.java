package com.aayush.HMS.repository;

import com.aayush.HMS.model.TreatmentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TreatmentRepository extends JpaRepository<TreatmentRecord, Long> {
    List<TreatmentRecord> findByAdmissionId(Long admissionId);
}
