import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Clinic from '@/models/Clinic';

function setCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle GET request
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const clinic = await Clinic.findById(id);
    if (!clinic) {
      const response = NextResponse.json({ message: 'Clinic not found' }, { status: 404 });
      return setCorsHeaders(response);
    }
    const response = NextResponse.json(clinic);
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching clinic:', error);
    const response = NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    return setCorsHeaders(response);
  }
}

// Handle preflight OPTIONS request
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}
