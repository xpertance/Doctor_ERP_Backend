import dbConnect from "@/utils/db";
import Patient from "@/models/Patient";
import { NextResponse } from "next/server";

// Helper to set CORS headers
function setCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function GET(request, context) {
  await dbConnect();

  try {
    const id = context.params.id;
console.log("sdaf",id)
    const patient = await Patient.findById(id);

    if (!patient) {
      const response = NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
      return setCorsHeaders(response);
    }

    const response = NextResponse.json({ success: true, patient }, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    const response = NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}

// CORS preflight (OPTIONS) request handler
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}
