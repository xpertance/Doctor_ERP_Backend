import { NextResponse } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import bcrypt from 'bcryptjs';
import Doctor from '@/models/Doctor'; // Adjust the path if needed
import dbConnect from '@/utils/db';   // MongoDB connection utility
// Handle POST request to create a doctor
/**
 * @swagger
 * /api/v1/clinic/doctor-add:
 *   post:
 *     summary: POST request for /api/v1/clinic/doctor-add
 *     tags: [Clinic]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log(body);
    const {
      firstName,
      lastName,
      dateOfBirth,
      profileImage,
      gender,
      email,
      homeAddress,
      password,
      consultantFee,
      phone,
      specialty,
      supSpeciality,
      identityProof,
      degreeCertificate,
      experience,
      qualifications,
     licenseNumber,
      hospital,
      sessionTime,
      clinicId,
      hospitalAddress,
      hospitalNumber,
      status,
      availableDays,
      availableTime,
    } = body;

    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      return ApiResponse.error('Email already exists', 'DUPLICATE_ENTRY', [], 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create doctor
    const newDoctor = await Doctor.create({
      firstName,
      lastName,
      dateOfBirth,
      profileImage,
      gender,
      email,
      homeAddress,
      consultantFee,
      sessionTime,
      phone,
      specialty,
      supSpeciality,
      experience,
      qualifications,
      identityProof,
      status,
      degreeCertificate,
      licenseNumber,
      hospital,
      password: hashedPassword,
      clinicId,
      hospitalAddress,
      hospitalNumber,
      available: {
        days: availableDays,
        time: availableTime
      }
    });

    return ApiResponse.success({ doctor: newDoctor }, 'Doctor created successfully', 201);
  } catch (error) {
    console.error('Error creating doctor:', error);
    return ApiResponse.error('Internal Server Error', 'SERVER_ERROR', error.message, 500);
  }
}