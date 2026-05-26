package com.aayush.HMS.service.impl;

import com.aayush.HMS.dto.request.AdmissionRequest;
import com.aayush.HMS.model.Admission;
import com.aayush.HMS.model.Bed;
import com.aayush.HMS.model.Patient;
import com.aayush.HMS.model.Doctor;
import com.aayush.HMS.model.Bill;
import com.aayush.HMS.model.TreatmentRecord;
import com.aayush.HMS.model.enums.PaymentStatus;
import com.aayush.HMS.model.Nurse;
import com.aayush.HMS.repository.NurseRepository;
import com.aayush.HMS.repository.AdmissionRepository;
import com.aayush.HMS.repository.BedRepository;
import com.aayush.HMS.repository.PatientRepository;
import com.aayush.HMS.repository.DoctorRepository;
import com.aayush.HMS.repository.BillRepository;
import com.aayush.HMS.repository.TreatmentRepository;
import com.aayush.HMS.service.AdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdmissionServiceImpl implements AdmissionService {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private TreatmentRepository treatmentRepository;

    @Autowired
    private NurseRepository nurseRepository;

    @Override
    public Admission admitPatient(AdmissionRequest request) {
        // 1. Validate Patient
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 2. Find first available bed for the requested RoomType
        Bed bed = bedRepository.findFirstByRoom_RoomTypeAndIsOccupiedFalse(request.getRoomType())
                .orElseThrow(() -> new RuntimeException("No available beds found for RoomType: " + request.getRoomType()));

        // 3. Mark bed as occupied
        bed.setIsOccupied(true);
        bedRepository.save(bed);

        // 4. Create and save Admission
        Admission admission = new Admission();
        admission.setPatient(patient);
        admission.setBed(bed);
        admission.setReason(request.getReason());
        admission.setAdmissionDate(LocalDateTime.now());

        // 5. Find and assign the doctor with the minimum number of active patients
        List<Doctor> doctors = doctorRepository.findAll();
        if (doctors.isEmpty()) {
            throw new RuntimeException("No doctors found in the system. Cannot admit patient without an available doctor.");
        }

        Doctor assignedDoctor = null;
        int minPatients = Integer.MAX_VALUE;

        for (Doctor doc : doctors) {
            int count = admissionRepository.findByDoctorAndDischargeDateIsNull(doc).size();
            if (count < minPatients) {
                minPatients = count;
                assignedDoctor = doc;
            }
        }
        admission.setDoctor(assignedDoctor);

        // 6. Find and assign the nurse. First check if room has nurse.
        Nurse assignedNurse = null;
        if (bed.getRoom() != null && bed.getRoom().getNurse() != null) {
            assignedNurse = bed.getRoom().getNurse();
        } else {
            List<Nurse> nurses = nurseRepository.findAll();
            if (!nurses.isEmpty()) {
                int minNursesPatients = Integer.MAX_VALUE;
                for (Nurse n : nurses) {
                    int count = admissionRepository.findByNurseAndDischargeDateIsNull(n).size();
                    if (count < minNursesPatients) {
                        minNursesPatients = count;
                        assignedNurse = n;
                    }
                }
            }
        }
        admission.setNurse(assignedNurse);

        return admissionRepository.save(admission);
    }

    @Override
    public Admission dischargePatient(Long admissionId) {
        // 1. Fetch Admission
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        if (admission.getDischargeDate() != null) {
            throw new RuntimeException("Patient is already discharged");
        }

        // 2. Mark discharge date
        admission.setDischargeDate(LocalDateTime.now());

        // 3. Free up the bed
        Bed bed = admission.getBed();
        if (bed != null) {
            bed.setIsOccupied(false);
            bedRepository.save(bed);
        }

        // 4. Save Admission first to establish discharge state
        Admission savedAdmission = admissionRepository.save(admission);

        // 5. Auto-generate the Bill on discharge
        Bill bill = billRepository.findByAdmissionId(admissionId).orElse(new Bill());
        bill.setAdmission(savedAdmission);

        // Calculate room charges
        long days = java.time.Duration.between(savedAdmission.getAdmissionDate(), savedAdmission.getDischargeDate()).toDays();
        if (days == 0) days = 1;
        Double pricePerDay = bed != null && bed.getRoom() != null ? bed.getRoom().getPricePerDay() : 0.0;
        double roomCharge = days * (pricePerDay != null ? pricePerDay : 0.0);
        bill.setRoomCharge(roomCharge);

        // Calculate medicine charges
        double medicineCharge = 0.0;
        List<TreatmentRecord> treatments = treatmentRepository.findByAdmissionId(admissionId);
        for (TreatmentRecord record : treatments) {
            if (record.getMedicine() != null && record.getMedicine().getPrice() != null) {
                medicineCharge += record.getMedicine().getPrice();
            }
        }
        bill.setMedicineCharge(medicineCharge);

        // Additional charges
        double additionalCharge = 500.0; // standard additional service fee
        bill.setAdditionalCharge(additionalCharge);

        // Total amount
        bill.setTotalAmount(roomCharge + medicineCharge + additionalCharge);
        if (bill.getStatus() == null) {
            bill.setStatus(PaymentStatus.PENDING);
        }

        billRepository.save(bill);

        return savedAdmission;
    }

    @Override
    public List<Admission> getAdmissionsByPatientId(Long patientId) {
        return admissionRepository.findByPatientId(patientId);
    }

    @Override
    public Admission getActiveAdmissionByPatientUsername(String username) {
        return admissionRepository.findByPatientUsernameAndDischargeDateIsNull(username)
                .orElseThrow(() -> new RuntimeException("No active admission found for patient: " + username));
    }

    @Override
    public List<Admission> getActiveAdmissions() {
        return admissionRepository.findByDischargeDateIsNull();
    }

    @Override
    public List<Admission> getAdmissionsByNurse(String nurseUsername) {
        Nurse nurse = nurseRepository.findByUsername(nurseUsername)
                .orElseThrow(() -> new RuntimeException("Nurse not found"));
        return admissionRepository.findByNurseAndDischargeDateIsNull(nurse);
    }

    @Override
    public Admission assignNurse(Long admissionId, Long nurseId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
        Nurse nurse = nurseRepository.findById(nurseId)
                .orElseThrow(() -> new RuntimeException("Nurse not found"));
        admission.setNurse(nurse);
        return admissionRepository.save(admission);
    }

    @Override
    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }
}
