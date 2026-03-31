// // app/api/clinic/update-status/route.js
// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import Clinic from '@/models/Clinic';  // adjust import if needed
// import connectDB from '@/utils/db';      // your MongoDB connection function

// export async function PUT(req) {
//   await connectDB();

//   try {
//     const { id, status } = await req.json();

//     if (!id || !status) {
//       return NextResponse.json({ message: 'ID and Status are required' }, { status: 400 });
//     }

//     const clinic = await Clinic.findByIdAndUpdate(id, { status }, { new: true });

//     if (!clinic) {
//       return NextResponse.json({ message: 'Clinic not found' }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'Status updated successfully', clinic }, { status: 200 });

//   } catch (error) {
//     console.error('Error updating clinic status:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Clinic from '@/models/Clinic';
import connectDB from '@/utils/db';

export async function PUT(req, { params }) {
  await connectDB();

  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Change '*' to your domain in production
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const { id } = params;
    const { status, approved, rejectionReason } = await req.json();
console.log("sdf",rejectionReason);
    if (!id || !status) {
      return NextResponse.json(
        { message: 'ID and Status are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const updateData = { status };

    if (approved !== undefined) {
      updateData.approved = approved;
    }

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
console.log("asdf",updateData);
    const clinic = await Clinic.findByIdAndUpdate(id, updateData, { new: true });

    if (!clinic) {
      return NextResponse.json(
        { message: 'Clinic not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        message: 'Status updated successfully',
        clinic,
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error updating clinic status:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Optional: Handle OPTIONS preflight request if needed
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
