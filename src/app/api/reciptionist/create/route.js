import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Staff from "@/models/Reciptionist";

// CORS headers setup
const setCorsHeaders = (res) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

// Handle POST (Create staff)
export async function POST(req) {
  await dbConnect();
  const res = NextResponse.next();

  try {
    const data = await req.json();
    console.log(data)
    const newStaff = await Staff.create(data);

    const response = NextResponse.json({ success: true, staff: newStaff }, { status: 201 });
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
