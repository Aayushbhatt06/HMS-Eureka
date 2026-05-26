package com.aayush.HMS.service.impl;

import com.aayush.HMS.dto.request.TreatmentRequest;
import com.aayush.HMS.model.Admission;
import com.aayush.HMS.model.Medicine;
import com.aayush.HMS.model.Nurse;
import com.aayush.HMS.model.TreatmentRecord;
import com.aayush.HMS.repository.AdmissionRepository;
import com.aayush.HMS.repository.MedicineRepository;
import com.aayush.HMS.repository.NurseRepository;
import com.aayush.HMS.repository.TreatmentRepository;
import com.aayush.HMS.service.TreatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TreatmentServiceImpl implements TreatmentService {

    @Autowired
    private TreatmentRepository treatmentRepository;

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private NurseRepository nurseRepository;

    @Override
    public TreatmentRecord addTreatment(TreatmentRequest request, String nurseUsername) {
        Admission admission = admissionRepository.findById(request.getAdmissionId())
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        if (admission.getDischargeDate() != null) {
            throw new RuntimeException("Cannot add treatment: patient is already discharged");
        }

        Nurse nurse = nurseRepository.findByUsername(nurseUsername)
                .orElseThrow(() -> new RuntimeException("Nurse profile not found"));

        Medicine medicine = null;
        if (request.getMedicineId() != null) {
            medicine = medicineRepository.findById(request.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));
        }

        TreatmentRecord record = new TreatmentRecord();
        record.setAdmission(admission);
        record.setNurse(nurse);
        record.setMedicine(medicine);
        record.setDescription(request.getDescription());
        record.setTimestamp(LocalDateTime.now());

        return treatmentRepository.save(record);
    }

    @Override
    public List<TreatmentRecord> getTreatmentsByAdmission(Long admissionId) {
        if (!admissionRepository.existsById(admissionId)) {
            throw new RuntimeException("Admission not found");
        }
        return treatmentRepository.findByAdmissionId(admissionId);
    }
}
