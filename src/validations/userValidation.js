import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const patientRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  bloodType: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const doctorRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  profileImage: z.string().min(1, 'Profile image is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  phone: z.string().min(1, 'Phone number is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  experience: z.number().min(0, 'Experience must be a positive number'),
  hospital: z.string().min(1, 'Hospital is required'),
  
  // Optional / Allowable fields
  supSpeciality: z.string().optional(),
  consultantFee: z.number().optional().or(z.string().optional()).transform(val => Number(val) || undefined),
  qualifications: z.array(z.string()).optional(),
  licenseNumber: z.string().optional(),
  sessionTime: z.string().optional(),
  hospitalAddress: z.string().optional(),
  hospitalNumber: z.string().optional(),
  clinicId: z.string().optional(),
  degreeCertificate: z.string().optional(),
  identityProof: z.string().optional(),
  status: z.string().optional(),
  available: z.object({
    days: z.array(z.string()).optional(),
    time: z.string().optional()
  }).optional()
});

export const clinicRegistrationSchema = z.object({
  clinicName: z.string().min(1, 'Clinic name is required'),
  clinicType: z.string().min(1, 'Clinic type is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  phone: z.string().min(1, 'Phone is required'),
  
  description: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  logo: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  is24x7: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  licenseDocument: z.any().optional(),
  licenseDocumentUrl: z.string().optional(),
  gstDocument: z.any().optional(),
  gstDocumentUrl: z.string().optional(),
  openingHours: z.record(z.string(), z.object({
    open: z.string().optional(),
    close: z.string().optional(),
  })).optional()
});

export const appointmentCreateSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  patientEmail: z.string().email('Invalid patient email'),
  patientName: z.string().min(1, 'Patient name is required'),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  time: z.string().min(1, 'Time is required'),
  
  doctorName: z.string().optional(),
  doctorFees: z.union([z.number(), z.string()]).optional(),
  patientNote: z.string().optional(),
  patientNumber: z.string().optional(),
  day: z.string().optional(),
});

// For update, we make most fields optional but strictly typed where provided
export const doctorUpdateSchema = doctorRegistrationSchema.partial().extend({
  password: z.string().min(8, 'Password must be at least 8 characters long').optional()
});
