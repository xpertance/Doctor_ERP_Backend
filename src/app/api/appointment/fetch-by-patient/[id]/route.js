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

// Handle OPTIONS (preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// Handle GET
export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;
  console.log(id);

//   if (!id) {
//     const response = NextResponse.json({ success: false, error: 'Missing patient ID' }, { status: 400 });
//     return setCorsHeaders(response);
//   }

  try {
    // 1. Find all appointments for the patient
    const appointments = await Appointment.find({ patientId: id });

    // 2. Populate each appointment with corresponding doctor data
    const enrichedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const doctor = await Doctor.findById(appt.doctorId);
        return {
          ...appt.toObject(),
          doctorDetails: doctor || null,
        };
      })
    );

    const response = NextResponse.json({
      success: true,
      data: enrichedAppointments,
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching appointments with doctor data:', error);
    const response = NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}
