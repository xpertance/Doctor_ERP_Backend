import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Clinic from '@/models/Clinic';

// Utility to set CORS headers
const setCorsHeaders = (res) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
};

// Preflight handler (OPTION request)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const clinic = await Clinic.findById(id).select('-password');
    if (!clinic) {
      const response = NextResponse.json({ success: false, message: 'Clinic not found' }, { status: 404 });
      return setCorsHeaders(response);
    }

    const response = NextResponse.json({ success: true, clinic }, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Fetch Clinic Error:', error);
    const response = NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    return setCorsHeaders(response);
  }
}
