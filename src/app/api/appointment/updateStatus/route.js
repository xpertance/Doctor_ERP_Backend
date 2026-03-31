// app/api/appointment/update-status/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Appointment from '@/models/Appointments';
import mongoose from 'mongoose';

// CORS utility
const setCorsHeaders = (res) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
};

// CORS preflight
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res);
}

// PATCH to update appointment status
export async function PATCH(req) {
  await dbConnect();

  try {
    const { appointmentId, status } = await req.json();
console.log(appointmentId)
    // Validate input
    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      const res = NextResponse.json({ message: "Invalid appointment ID" }, { status: 400 });
      return setCorsHeaders(res);
    }

    if (!status) {
      const res = NextResponse.json({ message: "Missing status value" }, { status: 400 });
      return setCorsHeaders(res);
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedAppointment) {
      const res = NextResponse.json({ message: "Appointment not found" }, { status: 404 });
      return setCorsHeaders(res);
    }

    const res = NextResponse.json({ message: "Status updated successfully", appointment: updatedAppointment }, { status: 200 });
    return setCorsHeaders(res);

  } catch (error) {
    console.error("Error updating status:", error);
    const res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    return setCorsHeaders(res);
  }
}
