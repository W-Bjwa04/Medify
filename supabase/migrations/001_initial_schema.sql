-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE prescription_status AS ENUM ('active', 'inactive', 'expired');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role user_role NOT NULL DEFAULT 'patient',
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);


-- Patient profiles table (extends users table)
CREATE TABLE patient_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender VARCHAR(20),
  blood_group VARCHAR(5),
  allergies TEXT,
  medical_history TEXT,
  chronic_conditions TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Doctor specializations table
CREATE TABLE specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Doctor profiles table (extends users table)
CREATE TABLE doctor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(100) NOT NULL UNIQUE,
  specialization_id UUID NOT NULL REFERENCES specializations(id),
  bio TEXT,
  experience_years INTEGER,
  consultation_fee DECIMAL(10, 2),
  available_start_time TIME,
  available_end_time TIME,
  available_days VARCHAR(255), -- JSON array of days (0-6) when available
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Medical records table
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  document_type VARCHAR(100),
  document_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default specializations
INSERT INTO specializations (name, description) VALUES
  ('General Practice', 'General medicine and primary care'),
  ('Cardiology', 'Heart and cardiovascular diseases'),
  ('Dermatology', 'Skin, hair, and nail conditions'),
  ('Pediatrics', 'Child and adolescent medicine'),
  ('Orthopedics', 'Bones, joints, and muscles'),
  ('Psychiatry', 'Mental health and behavior'),
  ('Ophthalmology', 'Eye care and vision'),
  ('Neurology', 'Nervous system disorders');
