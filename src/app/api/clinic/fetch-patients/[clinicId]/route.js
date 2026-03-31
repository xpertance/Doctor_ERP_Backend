// import { NextResponse } from "next/server";
// import dbConnect from "@/utils/db";
// import Appointment from "@/models/Appointments";
// import Doctor from "@/models/Doctor";
// import Patient from "@/models/Patient";

// export async function GET(req, { params }) {
//   try {
//     await dbConnect();

//     const { clinicId } = params;

//     if (!clinicId) {
//       return NextResponse.json({ success: false, message: "clinicId is required" }, { status: 400 });
//     }

//     // Step 1: Get doctors under the clinic
//     const clinicDoctors = await Doctor.find({ clinicId }).select("_id");
//     const doctorIds = clinicDoctors.map((doc) => doc._id.toString());

//     if (doctorIds.length === 0) {
//       return NextResponse.json({ success: true, data: [] });
//     }

//     // Step 2: Get appointments with status "checkedIn"
//     const appointments = await Appointment.find({
//       doctorId: { $in: doctorIds },
//       status: "checkedIn"
//     });

//     // Step 3: Get distinct patientIds from those appointments
//     const patientIds = [...new Set(appointments.map((a) => a.patientId))];

//     // Step 4: Fetch corresponding patients
//     const patients = await Patient.find({ _id: { $in: patientIds } });

//     return NextResponse.json({
//       success: true,
//       data: patients,
//     });

//   } catch (error) {
//     console.error("Error fetching clinic checkin patients:", error);
//     return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
//   }
// }

"use server"
import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Appointment from "@/models/Appointments";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient";

// CORS helper
const setCorsHeaders = (res) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
};

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { clinicId } = params;

    if (!clinicId) {
      const res = NextResponse.json({ success: false, message: "clinicId is required" }, { status: 400 });
      return setCorsHeaders(res);
    }

    console.log("🔍 Clinic ID:", clinicId);

    // Step 1: Get doctors under the clinic
    const clinicDoctors = await Doctor.find({ clinicId }).select("_id");
    const doctorIds = clinicDoctors.map((doc) => doc._id.toString());
    console.log("👨‍⚕️ Doctors Found:", doctorIds);

    if (doctorIds.length === 0) {
      const res = NextResponse.json({ success: true, data: [] });
      return setCorsHeaders(res);
    }

    // Step 2: Get appointments with status "checkedIn"
    const appointments = await Appointment.find({
      doctorId: { $in: doctorIds },
      status: "checkedIn"
    });
    console.log("📅 Appointments Found:", appointments.length);
    console.log("Appointments Data:", appointments);

    // Step 3: Get distinct patientIds from those appointments
    const patientIds = [...new Set(appointments.map((a) => a.patientId?.toString()))];
    console.log("🧍‍♂️ Patient IDs from Appointments:", patientIds);

    if (patientIds.length === 0) {
      const res = NextResponse.json({ success: true, data: [] });
      return setCorsHeaders(res);
    }

    // Step 4: Fetch corresponding patients
    const patients = await Patient.find({ _id: { $in: patientIds } });
    console.log("✅ Patients Fetched:", patients.length);

    const res = NextResponse.json({
      success: true,
      data: patients,
    });
    return setCorsHeaders(res);

  } catch (error) {
    console.error("❌ Error fetching clinic checkin patients:", error);
    const res = NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    return setCorsHeaders(res);
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res);
}
