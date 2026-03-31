// // app/api/doctor/fetch-slots/[doctorId]/route.js
// import Appointment from "@/models/Appointments";
// import  connectDB  from "@/utils/db";
// import { NextResponse } from 'next/server';

// export async function GET(req, { params }) {
//   await connectDB();

//   try {
//     const { doctorId } = params;

//     if (!doctorId) {
//       return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 });
//     }

//     const appointments = await Appointment.find({ doctorId });

//     const result = {};

//     appointments.forEach((appointment) => {
//       const date = appointment.appointmentDate;
//       const time = appointment.time;

//       if (!result[date]) {
//         result[date] = [];
//       }
//       result[date].push(time);
//     });

//     return NextResponse.json({ slots: result }, { status: 200 });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


// app/api/doctor/fetch-slots/[doctorId]/route.js
import Appointment from "@/models/Appointments";
import connectDB from "@/utils/db";
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { doctorId } = params;

    if (!doctorId) {
      return NextResponse.json(
        { error: "Doctor ID is required" },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const appointments = await Appointment.find({ doctorId });

    const result = {};

    appointments.forEach((appointment) => {
      const date = appointment.appointmentDate;
      const time = appointment.time;

      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(time);
    });

    return new NextResponse(JSON.stringify({ slots: result }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

// Optional: Handle Preflight Request (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}
