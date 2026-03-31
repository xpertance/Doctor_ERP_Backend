// /app/api/clinic/delete-image/[clinicId]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Clinic from '@/models/Clinic';

export async function PATCH(req, { params }) {
  await dbConnect();

  const { clinicId } = params;
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
  }

  try {
    const updatedClinic = await Clinic.findByIdAndUpdate(
      clinicId,
      { $pull: { images: imageUrl } }, // Remove the matching image URL
      { new: true }
    );

    if (!updatedClinic) {
      return NextResponse.json({ message: 'Clinic not found' }, { status: 404 });
    }

    return NextResponse.json({ clinic: updatedClinic }, { status: 200 });
  } catch (error) {
    console.error('Error removing image from clinic:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// Optional: Add CORS preflight support
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
