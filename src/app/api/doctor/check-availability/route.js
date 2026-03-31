// app/api/doctor/check-availability/route.js
import Appointment from "@/models/Appointments";
import { connectDB } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();

  try {
    const { doctorId, date, time } = await request.json();

    if (!doctorId || !date || !time) {
      return NextResponse.json(
        { error: 'Doctor ID, date and time are required' },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
          },
        }
      );
    }

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(date),
      time,
      status: { $ne: 'cancelled' },
    });

    return NextResponse.json(
      { isAvailable: !existingAppointment },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
      }
    );

  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
      }
    );
  }
}

// Handle CORS Preflight (Optional but recommended)
