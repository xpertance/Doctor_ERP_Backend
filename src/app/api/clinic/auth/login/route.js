import dbConnect from "@/utils/db";
import Clinic from "@/models/Clinic";

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  const res = NextResponse.json({}, { status: 200 });
  setCorsHeaders(res);
  return res;
}

export async function POST(req) {
  await dbConnect();

  const { email, password } = await req.json();
console.log("sadf",email)
  const user = await Clinic.findOne({ email });
  
  if (!user) {
    const res = NextResponse.json({ error: "User not found" }, { status: 404 });
    setCorsHeaders(res);
    return res;
  }

  
  if (password!=user.password) {
    const res = NextResponse.json({ error: "Invalid password" }, { status: 401 });
    setCorsHeaders(res);
    return res;
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.clinicName,
      email: user.email,
      logo:user.logo,    
      role: user.role,
    },
  });

  setCorsHeaders(res);
  return res;
}

function setCorsHeaders(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
