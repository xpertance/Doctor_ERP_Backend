import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Patient from "@/models/Patient";

// CORS headers utility
const setCorsHeaders = (res) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

// Handle GET request to fetch all patients
export async function GET() {
  await dbConnect();

  try {
    const patients = await Patient.find().sort({ createdAt: -1 }); // latest first
    const response = NextResponse.json(
      { success: true, data: patients },
      { status: 200 }
    );
    return setCorsHeaders(response);
  } catch (error) {
    console.error("Error fetching patients:", error);
    const response = NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}
