# HMS - Hospital Management System

A scalable and secure Hospital Management System (HMS) backend built using Spring Boot, Spring Security, JWT Authentication, MySQL, and JPA/Hibernate.

This project manages:
- Patients
- Doctors
- Nurses
- Receptionists
- Rooms & Beds
- Admissions
- Treatments & Medicines
- Billing System
- Razorpay Payment Integration

---

# Features

## Authentication & Authorization
- JWT Authentication
- Role Based Access Control
- Spring Security Integration

## User Roles
- ADMIN
- DOCTOR
- NURSE
- RECEPTIONIST
- PATIENT

## Patient Management
- Add new patients
- View patient profile
- Access patient history
- Patient self-access

## Doctor Management
- View assigned patients
- Manage patient records

## Nurse Management
- Update medicine/treatment records
- Manage treatment logs

## Receptionist Management
- Register patients
- Allocate rooms automatically
- Manage admissions/discharges

## Room & Bed Management
- ICU / General Room support
- Automatic bed allocation
- Bed occupancy tracking

## Billing System
- Room rent calculation
- Medicine expense calculation
- Additional hospital charges
- Automatic total bill generation

## Payment Integration
- Razorpay payment gateway
- Payment verification
- Transaction handling

---

# Tech Stack

| Technology | Usage |
|---|---|
| Java 17 | Backend Language |
| Spring Boot | Backend Framework |
| Spring Security | Authentication & Authorization |
| JWT | Secure Authentication |
| Spring Data JPA | ORM |
| Hibernate | Database Mapping |
| MySQL | Database |
| Maven | Dependency Management |
| Razorpay | Payment Gateway |

---

# Project Structure

```bash
src/main/java/com/hms
│
├── config
│   ├── SecurityConfig.java
│   ├── JwtFilter.java
│   ├── JwtUtil.java
│   └── AppConfig.java
│
├── controller
│   ├── AuthController.java
│   ├── PatientController.java
│   ├── DoctorController.java
│   ├── NurseController.java
│   ├── AdmissionController.java
│   ├── TreatmentController.java
│   ├── BillingController.java
│   ├── RoomController.java
│   └── PaymentController.java
│
├── dto
│   ├── request
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── AdmissionRequest.java
│   │   └── TreatmentRequest.java
│   │
│   └── response
│       ├── JwtResponse.java
│       ├── PatientResponse.java
│       ├── BillResponse.java
│       └── PaymentResponse.java
│
├── exception
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   └── GlobalExceptionHandler.java
│
├── model
│   ├── enums
│   │   ├── Role.java
│   │   ├── RoomType.java
│   │   └── PaymentStatus.java
│   │
│   ├── User.java
│   ├── Patient.java
│   ├── Doctor.java
│   ├── Nurse.java
│   ├── Receptionist.java
│   │
│   ├── Room.java
│   ├── ICU.java
│   ├── GeneralRoom.java
│   ├── Bed.java
│   │
│   ├── Admission.java
│   ├── Medicine.java
│   ├── TreatmentRecord.java
│   │
│   ├── Bill.java
│   └── PaymentTransaction.java
│
├── repository
│   ├── UserRepository.java
│   ├── PatientRepository.java
│   ├── DoctorRepository.java
│   ├── NurseRepository.java
│   ├── RoomRepository.java
│   ├── BedRepository.java
│   ├── AdmissionRepository.java
│   ├── MedicineRepository.java
│   ├── TreatmentRepository.java
│   ├── BillRepository.java
│   └── PaymentRepository.java
│
├── service
│   ├── AuthService.java
│   ├── PatientService.java
│   ├── DoctorService.java
│   ├── NurseService.java
│   ├── RoomService.java
│   ├── AdmissionService.java
│   ├── TreatmentService.java
│   ├── BillingService.java
│   └── PaymentService.java
│
├── service/impl
│   ├── AuthServiceImpl.java
│   ├── PatientServiceImpl.java
│   ├── AdmissionServiceImpl.java
│   ├── BillingServiceImpl.java
│   └── PaymentServiceImpl.java
│
└── HMSApplication.java
```

---

# Database Design

## Main Entities

### User
Base entity for all system users.

### Patient
Stores patient details and medical data.

### Doctor
Stores doctor information and specialization.

### Nurse
Responsible for updating treatments/medicines.

### Room
Hospital rooms with room type support.

### Bed
Tracks individual bed allocation.

### Admission
Tracks patient hospital stay.

### TreatmentRecord
Tracks medicines and treatments given to patients.

### Bill
Stores complete bill details.

### PaymentTransaction
Stores Razorpay transaction details.

---

# Entity Relationships

## User Hierarchy
```text
User
├── Patient
├── Doctor
├── Nurse
└── Receptionist
```

## Room Hierarchy
```text
Room
├── ICU
└── GeneralRoom
```

## Admission Flow
```text
Patient
   ↓
Admission
   ↓
Bed
   ↓
Room
```

## Billing Flow
```text
Admission
   ↓
Treatment Records
   ↓
Bill
   ↓
Payment
```

---

# Automatic Bed Allocation Logic

Receptionist selects:
- Room Type

System automatically:
1. Finds first available room
2. Finds first available bed
3. Allocates patient
4. Marks bed occupied

---

# Security Design

Spring Security + JWT Authentication.

## Access Rules

| Role | Permissions |
|---|---|
| ADMIN | Full Access |
| DOCTOR | Access own patients |
| NURSE | Update treatments |
| RECEPTIONIST | Manage admissions |
| PATIENT | Access own profile |

---

# API Endpoints

# Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register user |
| POST | /auth/login | Login user |

---

# Patient APIs

| Method | Endpoint |
|---|---|
| GET | /patients/{id} |
| GET | /patients/my-profile |

---

# Admission APIs

| Method | Endpoint |
|---|---|
| POST | /admissions |
| POST | /admissions/discharge/{id} |

---

# Treatment APIs

| Method | Endpoint |
|---|---|
| POST | /treatments/add |
| GET | /treatments/admission/{id} |

---

# Billing APIs

| Method | Endpoint |
|---|---|
| GET | /bill/{admissionId} |
| POST | /bill/pay/{admissionId} |

---

# Razorpay Payment Flow

```text
Frontend
   ↓
Create Razorpay Order
   ↓
Razorpay Checkout
   ↓
Payment Success Callback
   ↓
Verify Signature
   ↓
Update Bill Status
```

---

# MySQL Configuration

## application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hms_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

---

# Required Dependencies

## Spring Dependencies
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL Driver
- Lombok
- Validation

## JWT Dependency

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
```

## Razorpay Dependency

```xml
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.3</version>
</dependency>
```

---

# Future Improvements

- Appointment Booking System
- Email Notifications
- SMS Integration
- Report Generation (PDF)
- Analytics Dashboard
- Inventory Management
- Multi Hospital Support
- Doctor Scheduling
- Emergency Management

---

# Development Phases

## Phase 1
- JWT Authentication
- Security Setup
- Role Management

## Phase 2
- User Management
- Room & Bed Management

## Phase 3
- Admission & Discharge System

## Phase 4
- Treatment & Medicines

## Phase 5
- Billing System

## Phase 6
- Razorpay Integration

---

# Authors

Developed using:
- Spring Boot
- Spring Security
- MySQL
- JPA/Hibernate

---

# License

This project is for educational and learning purposes.