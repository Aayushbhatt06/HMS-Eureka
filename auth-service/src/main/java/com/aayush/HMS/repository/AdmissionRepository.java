package com.aayush.HMS.repository;

import com.aayush.HMS.model.Admission;
import com.aayush.HMS.model.Doctor;
import com.aayush.HMS.model.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    List<Admission> findByDoctorAndDischargeDateIsNull(Doctor doctor);
    List<Admission> findByPatientId(Long patientId);
    Optional<Admission> findByPatientUsernameAndDischargeDateIsNull(String username);
    List<Admission> findByDischargeDateIsNull();
    List<Admission> findByNurseAndDischargeDateIsNull(Nurse nurse);
    List<Admission> findByNurse(Nurse nurse);
}
