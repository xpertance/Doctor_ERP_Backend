import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Appointment from '@/models/Appointments';

// CORS Headers Utility
const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

// Handle OPTIONS request (CORS preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// Handle POST request to create an appointment
export async function POST(req) {
  await dbConnect();

  try {
    const {
      patientId,
      doctorId,
      doctorName,
      doctorFees,
      patientEmail,
      patientName,
      patientNote,
      patientNumber,
      appointmentDate,
      time,
      day,
    } = await req.json(); // ✅ Only one call to req.json()
console.log(doctorName);
    // Validation
    if (!patientEmail || !patientName || !appointmentDate || !time || !doctorId) {
      return setCorsHeaders(
        NextResponse.json({ message: "Missing required fields" }, { status: 400 })
      );
    }

    // Create new appointment
    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      doctorName,
      doctorFees,
      patientEmail,
      patientName,
      patientNote,
      patientNumber,
      appointmentDate,
      time,
      day,
    });

    // Success response
    return setCorsHeaders(
      NextResponse.json({ success: true, appointment: newAppointment }, { status: 201 })
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return setCorsHeaders(
      NextResponse.json(
        { success: false, message: "Server error", error: error.message },
        { status: 500 }
      )
    );
  }
}
