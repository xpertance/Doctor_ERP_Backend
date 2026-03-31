// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Appointment from '@/models/Appointments';
// import Doctor from '@/models/Doctor';

// // CORS utility
// const setCorsHeaders = (response) => {
//   response.headers.set('Access-Control-Allow-Origin', '*');
//   response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
//   return response;
// };

// // Handle OPTIONS (preflight)
// export async function OPTIONS() {
//   const response = new NextResponse(null, { status: 204 });
//   return setCorsHeaders(response);
// }

// // Handle GET
// export async function GET(req, { params }) {
//   await dbConnect();

//   const { id } = params;
//   console.log(id);

// //   if (!id) {
// //     const response = NextResponse.json({ success: false, error: 'Missing patient ID' }, { status: 400 });
// //     return setCorsHeaders(response);
// //   }

//   try {
//     // 1. Find all appointments for the patient
//     const appointments = await Appointment.find({ doctorId: id });
// console.log(appointments);
//     // 2. Populate each appointment with corresponding doctor data
//     const enrichedAppointments = await Promise.all(
//       appointments.map(async (appt) => {
//         const doctor = await Doctor.findById(appt.doctorId);
//         return {
//           ...appt.toObject(),
//           doctorDetails: doctor || null,
//         };
//       })
//     );

//     const response = NextResponse.json({
//       success: true,
//       data: enrichedAppointments,
//     });

//     return setCorsHeaders(response);
//   } catch (error) {
//     console.error('Error fetching appointments with doctor data:', error);
//     const response = NextResponse.json(
//       { success: false, error: 'Failed to fetch appointments' },
//       { status: 500 }
//     );
//     return setCorsHeaders(response);
//   }
// }


import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Appointment from '@/models/Appointments';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient'; // ✅ Import Patient model

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

  const { id } = params; // this is the doctorId

  try {
    // 1. Fetch all appointments for this doctor
    const appointments = await Appointment.find({ doctorId: id });

    // 2. Enrich each appointment with doctor + patient details
    const enrichedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const doctor = await Doctor.findById(appt.doctorId);
        const patient = await Patient.findById(appt.patientId);

        return {
          ...appt.toObject(),
          doctorDetails: doctor || null,
          patientDetails: patient || null, // ✅ add patient details
        };
      })
    );

    const response = NextResponse.json({
      success: true,
      data: enrichedAppointments,
    });

    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching appointments with doctor/patient data:', error);
    const response = NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}
