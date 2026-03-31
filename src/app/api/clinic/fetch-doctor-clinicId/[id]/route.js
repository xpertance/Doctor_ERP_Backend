import dbConnect from "@/utils/db";
import Doctor from "@/models/Doctor";
import { NextResponse } from "next/server";

// GET doctor by ID with CORS headers
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const doctor = await Doctor.find({clinicId:id}).select("-password"); // exclude password

    if (!doctor) {
      const res = NextResponse.json({ message: "Doctor not found" }, { status: 404 });
      return setCorsHeaders(res);
    }

    const res = NextResponse.json({ doctor }, { status: 200 });
    return setCorsHeaders(res);

  } catch (error) {
    console.error("Error fetching doctor:", error);
    const res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    return setCorsHeaders(res);
  }
}

// OPTIONS handler for preflight CORS
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res);
}

// Helper to set CORS headers
function setCorsHeaders(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}
