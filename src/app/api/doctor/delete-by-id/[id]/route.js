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

// Handle DELETE doctor by ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return setCorsHeaders(
        NextResponse.json({ message: 'Doctor not found' }, { status: 404 })
      );
    }

    return setCorsHeaders(
      NextResponse.json({ message: 'Doctor deleted successfully' }, { status: 200 })
    );
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return setCorsHeaders(
      NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    );
  }
}
