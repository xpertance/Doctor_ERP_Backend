import { ApiResponse } from "@/utils/apiResponse";
import dbConnect from "@/utils/db";
import Staff from "@/models/Reciptionist";
import jwt from "jsonwebtoken";
import { loginSchema } from '@/validations/userValidation';
import { withErrorHandler } from '@/utils/apiHandler';

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

/**
 * @swagger
 * /api/v1/auth/receptionist-login:
 *   post:
 *     summary: POST request for /api/v1/auth/receptionist-login
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export const POST = withErrorHandler(async (req) => {
    await dbConnect();
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(
        'Validation failed',
        'VALIDATION_ERROR',
        parsed.error.format(),
        400
      );
    }
    const { email, password } = parsed.data;

    const staff = await Staff.findOne({ email });
    if (!staff) {
      return ApiResponse.error("Staff not found.", "USER_NOT_FOUND", [], 404);
    }

    // Plain text comparison
    if (password !== staff.password) {
      return ApiResponse.error("Invalid password.", "INVALID_PASSWORD", [], 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: staff._id, email: staff.email, role: staff.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...staffData } = staff.toObject();

    return ApiResponse.success({
      token,
      staff: staffData
    }, "Login successful");

});