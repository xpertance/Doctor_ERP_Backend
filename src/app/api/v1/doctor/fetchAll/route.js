import { NextResponse } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import Doctor from '@/models/Doctor';
import dbConnect from '@/utils/db';
// GET all doctors
/**
 * @swagger
 * /api/v1/doctor/fetchAll:
 *   get:
 *     summary: GET request for /api/v1/doctor/fetchAll
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function GET() {
  try {
    await dbConnect();

    const doctors = await Doctor.find(); // Fetch all doctors

    return ApiResponse.success({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return ApiResponse.error('Internal Server Error', undefined, [], 500);
  }
}