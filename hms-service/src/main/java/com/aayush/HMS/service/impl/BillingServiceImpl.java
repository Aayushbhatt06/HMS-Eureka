package com.aayush.HMS.service.impl;

import com.aayush.HMS.dto.response.BillResponse;
import com.aayush.HMS.model.*;
import com.aayush.HMS.model.enums.PaymentStatus;
import com.aayush.HMS.repository.AdmissionRepository;
import com.aayush.HMS.repository.BillRepository;
import com.aayush.HMS.repository.TreatmentRepository;
import com.aayush.HMS.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BillingServiceImpl implements BillingService {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private TreatmentRepository treatmentRepository;

    @Override
    public BillResponse getBillForAdmission(Long admissionId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));

        Optional<Bill> savedBillOpt = billRepository.findByAdmissionId(admissionId);
        if (savedBillOpt.isPresent()) {
            return mapToResponse(savedBillOpt.get());
        }

        BillResponse response = new BillResponse();
        response.setAdmissionId(admission.getId());
        
        Patient patient = admission.getPatient();
        response.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        
        Bed bed = admission.getBed();
        if (bed != null && bed.getRoom() != null) {
            response.setRoomNumber(bed.getRoom().getRoomNumber());
            response.setRoomType(bed.getRoom().getRoomType().name());
        }

        LocalDateTime end = admission.getDischargeDate() != null ? admission.getDischargeDate() : LocalDateTime.now();
        long days = Duration.between(admission.getAdmissionDate(), end).toDays();
        if (days == 0) {
            days = 1;
        }
        response.setDaysStayed(days);

        double pricePerDay = bed != null && bed.getRoom() != null && bed.getRoom().getPricePerDay() != null 
                ? bed.getRoom().getPricePerDay() : 0.0;
        double roomCharge = days * pricePerDay;
        response.setRoomCharge(roomCharge);

        double medicineCharge = 0.0;
        List<TreatmentRecord> treatments = treatmentRepository.findByAdmissionId(admissionId);
        for (TreatmentRecord record : treatments) {
            if (record.getMedicine() != null && record.getMedicine().getPrice() != null) {
                medicineCharge += record.getMedicine().getPrice();
            }
        }
        response.setMedicineCharge(medicineCharge);

        double additionalCharge = 500.0;
        response.setAdditionalCharge(additionalCharge);

        response.setTotalAmount(roomCharge + medicineCharge + additionalCharge);
        response.setStatus(PaymentStatus.PENDING.name());

        if (admission.getDischargeDate() != null) {
            Bill newBill = new Bill();
            newBill.setAdmission(admission);
            newBill.setRoomCharge(roomCharge);
            newBill.setMedicineCharge(medicineCharge);
            newBill.setAdditionalCharge(additionalCharge);
            newBill.setTotalAmount(roomCharge + medicineCharge + additionalCharge);
            newBill.setStatus(PaymentStatus.PENDING);
            billRepository.save(newBill);
            response.setStatus(newBill.getStatus().name());
        }

        return response;
    }

    private BillResponse mapToResponse(Bill bill) {
        BillResponse response = new BillResponse();
        response.setAdmissionId(bill.getAdmission().getId());
        
        Patient patient = bill.getAdmission().getPatient();
        response.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        
        Bed bed = bill.getAdmission().getBed();
        if (bed != null && bed.getRoom() != null) {
            response.setRoomNumber(bed.getRoom().getRoomNumber());
            response.setRoomType(bed.getRoom().getRoomType().name());
        }

        LocalDateTime end = bill.getAdmission().getDischargeDate() != null 
                ? bill.getAdmission().getDischargeDate() : LocalDateTime.now();
        long days = Duration.between(bill.getAdmission().getAdmissionDate(), end).toDays();
        if (days == 0) {
            days = 1;
        }
        response.setDaysStayed(days);
        
        response.setRoomCharge(bill.getRoomCharge());
        response.setMedicineCharge(bill.getMedicineCharge());
        response.setAdditionalCharge(bill.getAdditionalCharge());
        response.setTotalAmount(bill.getTotalAmount());
        response.setStatus(bill.getStatus().name());
        return response;
    }
}
