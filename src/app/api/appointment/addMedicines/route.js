// app/api/appointment/update-prescription/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Appointment from '@/models/Appointments';
import mongoose from 'mongoose';

// Utility to set CORS headers
const setCorsHeaders = (res) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
};

// Handle preflight CORS request
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res);
}

// Handle PATCH request
export async function PATCH(req) {
  await dbConnect();

  try {
    const { appointmentId, description, medicines } = await req.json();

    // Validate appointmentId
    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      const res = NextResponse.json({ message: "Invalid or missing appointmentId" }, { status: 400 });
      return setCorsHeaders(res);
    }

    // Build update object dynamically
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (medicines !== undefined) updateData.medicines = medicines;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedAppointment) {
      const res = NextResponse.json({ message: "Appointment not found" }, { status: 404 });
      return setCorsHeaders(res);
    }

    const res = NextResponse.json({ message: "Appointment updated", appointment: updatedAppointment }, { status: 200 });
    return setCorsHeaders(res);

  } catch (error) {
    console.error("Error updating appointment:", error);
    const res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    return setCorsHeaders(res);
  }
}
