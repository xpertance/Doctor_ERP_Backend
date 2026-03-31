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

// Handle POST request
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
console.log(body);
    const {
      firstName,
      lastName,
      dob,
      gender,
      phone,
      email,
       password,
      bloodType,
    } = body;

    // Basic validation
    

    const newPatient = await Patient.create({
      firstName,
      lastName,
      dateOfBirth:dob,
      gender,
      phone,
      email,
      password,
      bloodType,
      role:"patient"
    });
    console.log(newPatient);
 
    const res = NextResponse.json(
      {
        success: true,
        message: "Patient created successfully",
        patient: newPatient,
      },
      { status: 201 }
    );
    return setCorsHeaders(res);
  } catch (error) {
    console.error("Error creating patient:", error);
    const res = NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
    return setCorsHeaders(res);
  }
}
