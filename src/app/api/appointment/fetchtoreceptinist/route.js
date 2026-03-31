import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Appointment from '@/models/Appointments';
import Receptionist from '@/models/Reciptionist';
import Doctor from '@/models/Doctor';

const setCorsHeaders = (res) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
};

// Handle OPTIONS (CORS preflight request)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function POST(req) {
  await dbConnect();

  try {
    const { receptionistId } = await req.json();
console.log("sadf",receptionistId);
    // Step 1: Get the receptionist
    const receptionist = await Receptionist.findById(receptionistId);
    if (!receptionist) {
      const res = NextResponse.json({ message: "Receptionist not found" }, { status: 404 });
      return setCorsHeaders(res);
    }

    const clinicId = receptionist.clinicId;

    // Step 2: Find all doctors in that clinic
    const doctors = await Doctor.find({ clinicId });
    const doctorIds = doctors.map((doc) => doc._id.toString());

    if (doctorIds.length === 0) {
      const res = NextResponse.json({ message: "No doctors found for this clinic" }, { status: 404 });
      return setCorsHeaders(res);
    }

    // Step 3: Fetch appointments for all those doctors
    const appointments = await Appointment.find({
      doctorId: { $in: doctorIds }
    });

    const res = NextResponse.json({ appointments }, { status: 200 });
    return setCorsHeaders(res);

  } catch (error) {
    console.error("Error fetching clinic appointments:", error);
    const res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    return setCorsHeaders(res);
  }
}
