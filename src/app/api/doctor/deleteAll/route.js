import { NextResponse } from 'next/server';
import Doctor from '@/models/Doctor';
import dbConnect from '@/utils/db';

// Set CORS headers
const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

// Handle preflight CORS requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// DELETE all doctors
export async function DELETE() {
  try {
    await dbConnect();

    const result = await Doctor.deleteMany({}); // delete all records

    return setCorsHeaders(
      NextResponse.json({ message: 'All doctors deleted successfully', deletedCount: result.deletedCount }, { status: 200 })
    );
  } catch (error) {
    console.error('Error deleting all doctors:', error);
    return setCorsHeaders(
      NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    );
  }
}
