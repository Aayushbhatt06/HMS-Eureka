package com.aayush.HMS.config;

import com.aayush.HMS.model.Medicine;
import com.aayush.HMS.repository.MedicineRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class AppConfig {

    @Bean
    public CommandLineRunner seedMedicines(MedicineRepository medicineRepository) {
        return args -> {
            if (medicineRepository.count() == 0) {
                createMedicine(medicineRepository, "Paracetamol", "GSK", 10.0);
                createMedicine(medicineRepository, "Ibuprofen", "Pfizer", 15.0);
                createMedicine(medicineRepository, "Amoxicillin", "Abbott", 50.0);
                createMedicine(medicineRepository, "Metformin", "Sandoz", 20.0);
                createMedicine(medicineRepository, "Lipitor", "Pfizer", 120.0);
                System.out.println("Database seeded with sample medicines.");
            }
        };
    }

    @Bean
    public CommandLineRunner fixSubclassTables(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                int doctors = jdbcTemplate.update("INSERT INTO doctor (id) SELECT id FROM user WHERE role = 'DOCTOR' AND id NOT IN (SELECT id FROM doctor)");
                int nurses = jdbcTemplate.update("INSERT INTO nurse (id) SELECT id FROM user WHERE role = 'NURSE' AND id NOT IN (SELECT id FROM nurse)");
                int patients = jdbcTemplate.update("INSERT INTO patient (id) SELECT id FROM user WHERE role = 'PATIENT' AND id NOT IN (SELECT id FROM patient)");
                int receptionists = jdbcTemplate.update("INSERT INTO receptionist (id) SELECT id FROM user WHERE role = 'RECEPTIONIST' AND id NOT IN (SELECT id FROM receptionist)");
                if (doctors > 0 || nurses > 0 || patients > 0 || receptionists > 0) {
                    System.out.println(String.format("Polymorphic subclass tables synchronized. Fixed rows: Doctors=%d, Nurses=%d, Patients=%d, Receptionists=%d",
                            doctors, nurses, patients, receptionists));
                }
            } catch (Exception e) {
                System.err.println("Warning: Could not sync subclass tables: " + e.getMessage());
            }
        };
    }

    private void createMedicine(MedicineRepository repo, String name, String manufacturer, double price) {
        Medicine med = new Medicine();
        med.setName(name);
        med.setManufacturer(manufacturer);
        med.setPrice(price);
        repo.save(med);
    }
}
