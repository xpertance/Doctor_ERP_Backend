import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Staff from "@/models/Reciptionist";
import jwt from "jsonwebtoken";

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

// CORS headers
const setCorsHeaders = (response) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

// POST /api/staff/login
export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      const res = NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
      setCorsHeaders(res);
      return res;
    }

    const staff = await Staff.findOne({ email });
    if (!staff) {
      const res = NextResponse.json({ success: false, message: "Staff not found." }, { status: 404 });
      setCorsHeaders(res);
      return res;
    }

    // Plain text comparison
    if (password !== staff.password) {
        console.log("sadfa")
      const res = NextResponse.json({ success: false, message: "Invalid password." }, { status: 401 });
      setCorsHeaders(res);
      return res;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: staff._id, email: staff.email, role: staff.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...staffData } = staff.toObject();

    const res = NextResponse.json({ success: true, token, user: staffData }, { status: 200 });
    setCorsHeaders(res);
    return res;

  } catch (error) {
    const res = NextResponse.json({ success: false, error: error.message }, { status: 500 });
    setCorsHeaders(res);
    return res;
  }
}

// OPTIONS: CORS preflight
export function OPTIONS() {
  const res = NextResponse.json({}, { status: 200 });
  setCorsHeaders(res);
  return res;
}
