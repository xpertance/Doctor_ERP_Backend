import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Staff from "@/models/Reciptionist";

// CORS headers helper
const setCorsHeaders = (response) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

// UPDATE receptionist by ID
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const updates = await req.json();
  console.log(id)

  try {
    const updated = await Staff.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      const response = NextResponse.json({ success: false, message: "Receptionist not found" }, { status: 404 });
      setCorsHeaders(response);
      return response;
    }

    const response = NextResponse.json({ success: true, data: updated }, { status: 200 });
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
