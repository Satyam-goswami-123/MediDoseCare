-- MediDoseCare Database Schema

CREATE DATABASE IF NOT EXISTS medidosecare;
USE medidosecare;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL UNIQUE,
  role ENUM('patient', 'doctor', 'caregiver') DEFAULT 'patient',
  age INT,
  blood_group VARCHAR(5),
  emergency_contact VARCHAR(15),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50) NOT NULL,
  frequency ENUM('daily','twice_daily','thrice_daily','weekly','custom') DEFAULT 'daily',
  times JSON,
  start_date DATE,
  end_date DATE,
  instructions TEXT,
  color VARCHAR(20) DEFAULT '#22C55E',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

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

CREATE TABLE IF NOT EXISTS health_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  systolic INT,
  diastolic INT,
  heart_rate INT,
  blood_sugar FLOAT,
  spo2 INT,
  weight FLOAT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  doctor_name VARCHAR(100),
  hospital VARCHAR(150),
  prescribed_date DATE,
  diagnosis TEXT,
  notes TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150),
  message TEXT,
  type ENUM('reminder','alert','info','sos') DEFAULT 'info',
  is_read TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS care_network (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  caregiver_id INT NOT NULL,
  relation VARCHAR(50),
  approved TINYINT DEFAULT 0,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (caregiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample user
INSERT IGNORE INTO users (id, name, phone, role, age, blood_group, emergency_contact) 
VALUES (1, 'Ramesh Kumar', '9876543210', 'patient', 72, 'B+', '9876543211');

-- Sample medicines
INSERT IGNORE INTO medicines (id, user_id, name, dosage, frequency, times, start_date, color) VALUES
(1, 1, 'Metformin', '500mg', 'twice_daily', '["08:00","20:00"]', CURDATE(), '#22C55E'),
(2, 1, 'Amlodipine', '5mg', 'daily', '["09:00"]', CURDATE(), '#3B82F6'),
(3, 1, 'Atorvastatin', '10mg', 'daily', '["21:00"]', CURDATE(), '#A855F7');

-- Sample health logs
INSERT IGNORE INTO health_logs (user_id, systolic, diastolic, heart_rate, blood_sugar, spo2) VALUES
(1, 128, 82, 74, 118.5, 98),
(1, 132, 85, 78, 125.0, 97),
(1, 125, 80, 72, 112.0, 99);

-- Sample notifications
INSERT IGNORE INTO notifications (user_id, title, message, type) VALUES
(1, 'Medicine Reminder', 'Time to take Metformin 500mg', 'reminder'),
(1, 'Missed Dose Alert', 'You missed Amlodipine last night', 'alert'),
(1, 'Health Tip', 'Great job! 5-day streak maintained 🎉', 'info');
