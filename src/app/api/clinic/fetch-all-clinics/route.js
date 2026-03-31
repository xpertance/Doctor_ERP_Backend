import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Clinic from '@/models/Clinic';

// CORS Headers
const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

// Handle GET request
export async function GET() {
  try {
    await dbConnect();

    const clinics = await Clinic.find().select('-password');

    const response = NextResponse.json({ success: true, clinics });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching clinics:', error);
    const response = NextResponse.json(
      { success: false, message: 'Failed to fetch clinics' },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}

// Handle preflight (OPTIONS) request
export async function OPTIONS() {
  return setCorsHeaders(new NextResponse(null, { status: 204 }));
}
