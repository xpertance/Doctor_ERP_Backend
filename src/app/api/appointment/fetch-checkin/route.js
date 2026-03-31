// // app/api/appointment/fetch-checkin-with-medicines/route.js

// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Appointment from '@/models/Appointments';

// // CORS Headers Utility
// const setCorsHeaders = (response) => {
//   response.headers.set('Access-Control-Allow-Origin', '*');
//   response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
//   return response;
// };

// // Handle OPTIONS request for CORS preflight
// export async function OPTIONS() {
//   const response = NextResponse.json({}, { status: 200 });
//   return setCorsHeaders(response);
// }

// // Handle GET request
// export async function GET() {
//   await dbConnect();

//   try {
//     const appointments = await Appointment.find({
    
//       medicines: { $exists: true, $ne: [] }
//     });

//     const response = NextResponse.json({ success: true, data: appointments });
//     return setCorsHeaders(response);
//   } catch (error) {
//     const response = NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     return setCorsHeaders(response);
//   }
// }



// app/api/appointment/fetch-checkin-with-medicines/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Appointment from '@/models/Appointments';
import Doctor from '@/models/Doctor'; // Make sure this path is correct

// CORS Headers Utility
const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(response);
}

// Handle GET request
export async function GET() {
  await dbConnect();

  try {
    const appointments = await Appointment.find({
    
      medicines: { $exists: true, $ne: [] }
    });

    // Manually add doctor details to each appointment
    const appointmentsWithDoctor = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await Doctor.findById(appointment.doctorId).lean(); // Fetch doctor by ID
        return {
          ...appointment.toObject(),
          doctorDetails: doctor || null
        };
      })
    );

    const response = NextResponse.json({ success: true, data: appointmentsWithDoctor });
    return setCorsHeaders(response);
  } catch (error) {
    const response = NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return setCorsHeaders(response);
  }
}
