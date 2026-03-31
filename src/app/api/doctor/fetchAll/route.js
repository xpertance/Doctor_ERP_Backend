import { NextResponse } from 'next/server';
import Doctor from '@/models/Doctor';
import dbConnect from '@/utils/db';

// CORS headers helper
const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

// Handle preflight CORS requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// GET all doctors
export async function GET() {
  try {
    await dbConnect();

    const doctors = await Doctor.find(); // Fetch all doctors

    return setCorsHeaders(
      NextResponse.json({ doctors }, { status: 200 })
    );
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return setCorsHeaders(
      NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    );
  }
}
