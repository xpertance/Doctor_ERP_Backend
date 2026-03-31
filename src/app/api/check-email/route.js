import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Admin from '@/models/Admin';
import Clinic from '@/models/Clinic';
import Patient from '@/models/Patient';
import Staff from '@/models/Reciptionist';
import Doctor from '@/models/Doctor';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  await dbConnect();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400, headers: corsHeaders });
    }

    const [adminExists, clinicExists, patientExists, staffExists, doctorExists] = await Promise.all([
      Admin.findOne({ email }),
      Clinic.findOne({ email }),
      Patient.findOne({ email }),
      Staff.findOne({ email }),
      Doctor.findOne({ email }),
    ]);

    const existsInAnyCollection = adminExists || clinicExists || patientExists || staffExists || doctorExists;

    return NextResponse.json({
      available: !existsInAnyCollection,
      existsIn: existsInAnyCollection ? existsInAnyCollection.role || 'unknown' : null,
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405, headers: corsHeaders });
}
