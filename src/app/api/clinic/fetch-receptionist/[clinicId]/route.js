// /app/api/staff/by-clinic/[clinicId]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db'; // Adjust path if needed
import Receptionist from '@/models/Reciptionist';

export async function GET(req, { params }) {
  await dbConnect();

  const { clinicId } = params;

  try {
    const staffList = await Receptionist.find({ clinicId });

    const response = staffList.length
      ? NextResponse.json({ staff: staffList }, { status: 200 })
      : NextResponse.json({ message: 'No staff found for this clinic.' }, { status: 404 });

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching staff by clinicId:', error);
    const response = NextResponse.json(
      { message: 'Server error. Please try again later.' },
      { status: 500 }
    );

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  }
}

// Handle OPTIONS request for preflight
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
