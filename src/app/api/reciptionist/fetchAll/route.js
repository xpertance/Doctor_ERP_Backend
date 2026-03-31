import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Staff from "@/models/Reciptionist";

// CORS headers helper
const setCorsHeaders = (response) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

// GET all receptionists with CORS
export async function GET() {
  await dbConnect();
  try {
    const receptionists = await Staff.find().sort({ createdAt: -1 });
    const response = NextResponse.json({ success: true, data: receptionists }, { status: 200 });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    const response = NextResponse.json({ success: false, error: error.message }, { status: 500 });
    setCorsHeaders(response);
    return response;
  }
}

// Handle preflight OPTIONS request
export function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  setCorsHeaders(response);
  return response;
}
