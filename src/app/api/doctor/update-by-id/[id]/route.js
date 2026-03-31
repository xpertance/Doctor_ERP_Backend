// app/api/doctors/[id]/route.js

import { NextResponse } from 'next/server';
import Doctor from '@/models/Doctor';
import dbConnect from '@/utils/db';
import bcrypt from 'bcryptjs';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params;
  const updates = await req.json();
  console.log(updates)

  try {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoctor) {
      return new NextResponse(JSON.stringify({ message: 'Doctor not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new NextResponse(
      JSON.stringify({ message: 'Doctor updated successfully', doctor: updatedDoctor }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error) {
    console.error('Error updating doctor:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
