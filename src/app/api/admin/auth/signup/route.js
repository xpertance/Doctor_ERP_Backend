import dbConnect from "@/utils/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Handle OPTIONS request for preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function POST(req) {
  await dbConnect();

  const { name, email, password, role, secret } = await req.json();

  // 1. Check if an admin already exists
  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) {
    return NextResponse.json(
      { error: "Admin already exists. Multiple admin registrations are disabled." },
      { status: 403, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  // 2. Check for the Secret Key (Required for the very first admin)
  const signupSecret = process.env.ADMIN_SIGNUP_SECRET || "DEFAULT_SECRET";
  if (secret !== signupSecret) {
    return NextResponse.json(
      { error: "Invalid signup secret. Unauthorized admin creation." },
      { status: 401, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  const userExists = await Admin.findOne({ email });
  if (userExists) {
    const response = NextResponse.json({ error: "User already exists" }, { status: 400 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email, password: hashedPassword, role });

  const response = NextResponse.json({ message: "Super Admin created successfully", admin: admin._id }, { status: 201 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}
