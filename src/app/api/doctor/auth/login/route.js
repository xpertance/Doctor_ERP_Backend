import dbConnect from "@/utils/db";
import Doctor from "@/models/Doctor";
import bcrypt from "bcryptjs";
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

  const user = await Doctor.findOne({ email });
  if (!user) {
    const res = NextResponse.json({ error: "User not found" }, { status: 404 });
    setCorsHeaders(res);
    return res;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
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
      name: user.name,
      email: user.email,
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
