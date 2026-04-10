import dbConnect from "@/utils/db";
import Clinic from "@/models/Clinic";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/utils/apiResponse";

/**
 * @swagger
 * /api/v1/clinic/auth/login:
 *   post:
 *     summary: POST request for /api/v1/clinic/auth/login
 *     tags: [Clinic]
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

    const user = await Clinic.findOne({ email });
    if (!user) {
      return ApiResponse.error("User not found", "USER_NOT_FOUND", [], 404);
    }

    if (password !== user.password) {
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
        name: user.clinicName,
        email: user.email,
        logo: user.logo,
        role: user.role,
      },
    }, "Login successful");
  } catch (error) {
    console.error("Clinic login error:", error);
    return ApiResponse.error("Internal Server Error", "SERVER_ERROR", error.message, 500);
  }
}
