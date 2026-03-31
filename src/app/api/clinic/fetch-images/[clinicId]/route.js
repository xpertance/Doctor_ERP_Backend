// /app/api/clinic/images/[clinicId]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Clinic from '@/models/Clinic';

export async function GET(req, { params }) {
  await dbConnect();

  const { clinicId } = params;

  try {
    const clinic = await Clinic.findById(clinicId).select('images');

    if (!clinic) {
      return createCorsResponse({ message: 'Clinic not found' }, 404);
    }

    return createCorsResponse({ images: clinic.images }, 200);
  } catch (error) {
    console.error('Error fetching clinic images:', error);
    return createCorsResponse({ message: 'Server error' }, 500);
  }
}

// ✅ Helper to add CORS headers
function createCorsResponse(body, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// ✅ CORS preflight handler
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
