import dbConnect from "@/utils/db";
import Doctor from "@/models/Doctor";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/utils/apiResponse";

/**
 * @swagger
 * /api/v1/doctor/auth/login:
 *   post:
 *     summary: POST request for /api/v1/doctor/auth/login
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await Doctor.findOne({ email });
    if (!user) {
      return ApiResponse.error("User not found", "USER_NOT_FOUND", [], 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ApiResponse.error("Invalid password", "INVALID_PASSWORD", [], 401);
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return ApiResponse.success({
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
    }, "Login successful");
  } catch (error) {
    console.error("Doctor login error:", error);
    return ApiResponse.error("Internal Server Error", "SERVER_ERROR", error.message, 500);
  }
}
