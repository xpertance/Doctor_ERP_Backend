import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Doctor from '@/models/Doctor'; // Adjust the path if needed
import dbConnect from '@/utils/db';   // MongoDB connection utility

const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

// Handle preflight CORS requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// Handle POST request to create a doctor
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

    // Check for existing doctor
    const existingDoctor = await Doctor.findOne(
     { email }
    );

    if (existingDoctor) {
      return setCorsHeaders(
        NextResponse.json({ message: 'Email or license number already exists' }, { status: 400 })
      );
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
      password:hashedPassword,
      clinicId,
      hospitalAddress,
      hospitalNumber,
      available: {
  days: availableDays,
  time: availableTime
}
    });

    return setCorsHeaders(
      NextResponse.json({ message: 'Doctor created successfully', doctor: newDoctor }, { status: 201 })
    );
  } catch (error) {
    console.error('Error creating doctor:', error);
    return setCorsHeaders(
      NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    );
  }
}
   