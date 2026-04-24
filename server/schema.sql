-- MediDoseCare Database Schema
-- Optimized for clean relationships and user-specific data tracking

CREATE DATABASE IF NOT EXISTS medidosecare;
USE medidosecare;

-- 1. Users Table: Core user data
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unique_id VARCHAR(20) UNIQUE NOT NULL, -- Human-readable ID (e.g., MDC-P-001)
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  role ENUM('patient', 'doctor', 'caregiver') DEFAULT 'patient',
  age INT,
  blood_group VARCHAR(5),
  emergency_contact VARCHAR(15),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doctor Details: Extended info for doctors
CREATE TABLE IF NOT EXISTS doctor_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  specialization VARCHAR(100),
  qualification VARCHAR(100),
  experience_years INT,
  hospital_name VARCHAR(150),
  bio TEXT,
  availability_json JSON, -- Stores weekly schedule
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Doctor-Patient Mapping: For connecting patients to doctors
CREATE TABLE IF NOT EXISTS doctor_patient_mapping (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_mapping (doctor_id, patient_id)
);

-- 4. Medicines Table: User-specific medication list
CREATE TABLE IF NOT EXISTS medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50) NOT NULL,
  frequency ENUM('daily','twice_daily','thrice_daily','weekly','custom') DEFAULT 'daily',
  times JSON, -- Array of times (e.g., ["08:00", "20:00"])
  start_date DATE,
  end_date DATE,
  instructions TEXT,
  color VARCHAR(20) DEFAULT '#22C55E',
  status ENUM('upcoming', 'taken', 'missed') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Dose Logs: Track history of taken/missed medicines
CREATE TABLE IF NOT EXISTS dose_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medicine_id INT NOT NULL,
  user_id INT NOT NULL,
  scheduled_time DATETIME NOT NULL,
  status ENUM('upcoming','taken','missed','skipped') DEFAULT 'upcoming',
  taken_at TIMESTAMP NULL,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Health Logs: Vitals tracking (Heart rate, Blood sugar, etc.)
CREATE TABLE IF NOT EXISTS health_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  systolic INT, -- Blood Pressure
  diastolic INT,
  heart_rate INT,
  blood_sugar FLOAT,
  spo2 INT, -- Oxygen Saturation
  weight FLOAT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Prescriptions Table: Digital prescriptions or images
CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL, -- The patient
  doctor_id INT, -- If issued by an internal doctor
  doctor_name VARCHAR(100), -- For external doctors
  hospital VARCHAR(150),
  prescribed_date DATE,
  diagnosis TEXT,
  notes TEXT,
  image_url VARCHAR(255), -- Path to prescription photo
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Notifications Table: App alerts and reminders
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150),
  message TEXT,
  type ENUM('reminder','alert','info','sos','appointment') DEFAULT 'info',
  is_read TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Care Network: Caregivers linked to patients
CREATE TABLE IF NOT EXISTS care_network (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  caregiver_id INT NOT NULL,
  relation VARCHAR(50),
  approved TINYINT DEFAULT 0,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (caregiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Appointments Table: Doctor-Patient bookings
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
  reason TEXT,
  prescription_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE SET NULL
);

-- Sample Data for Satyam (Testing)
INSERT IGNORE INTO users (id, unique_id, name, phone, role, age, blood_group) 
VALUES (10, 'MDC-P-010', 'Satyam Kumar', '9988776655', 'patient', 25, 'O+');

-- Sample Medicine for Satyam
INSERT IGNORE INTO medicines (user_id, name, dosage, frequency, times, start_date) 
VALUES (10, 'Paracetamol', '500mg', 'twice_daily', '["09:00", "21:00"]', CURDATE());

-- Sample Health Log for Satyam
INSERT IGNORE INTO health_logs (user_id, systolic, diastolic, heart_rate, blood_sugar, spo2) 
VALUES (10, 120, 80, 72, 95.5, 99);
