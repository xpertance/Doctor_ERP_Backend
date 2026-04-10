import { ApiResponse } from "@/utils/apiResponse";
import dbConnect from "@/utils/db";
import Staff from "@/models/Reciptionist";

// POST: /api/v1/clinic/add-receptinist
/**
 * @swagger
 * /api/v1/clinic/add-receptinist:
 *   post:
 *     summary: POST request for /api/v1/clinic/add-receptinist
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
    const data = await req.json();
    
    const newStaff = await Staff.create(data);

    return ApiResponse.success({ staff: newStaff }, "Staff created successfully", 201);
  } catch (error) {
    console.error("Staff creation error:", error);
    return ApiResponse.error("Internal Server Error", "SERVER_ERROR", error.message, 500);
  }
}