import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Appointment from '@/models/Appointments';
import Doctor from '@/models/Doctor';

// CORS utility
const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

// OPTIONS for CORS
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(response);
}

// GET /api/appointment/fetch-checkin-with-medicines/[patientId]
export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const appointments = await Appointment.find({
      patientId:id,
      medicines: { $exists: true, $ne: [] }
    });

    const appointmentsWithDoctor = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await Doctor.findById(appointment.doctorId).lean();
        return {
          ...appointment.toObject(),
          doctorDetails: doctor || null,
        };
      })
    );

    const response = NextResponse.json({
      success: true,
      data: appointmentsWithDoctor,
    });
    return setCorsHeaders(response);
  } catch (error) {
    const response = NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
    return setCorsHeaders(response);
  }
}
