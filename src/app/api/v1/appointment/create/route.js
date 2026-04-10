import { ApiResponse } from '@/utils/apiResponse';
import dbConnect from '@/utils/db';
import Appointment from '@/models/Appointments';
import { appointmentCreateSchema } from '@/validations/userValidation';
import { withErrorHandler } from '@/utils/apiHandler';

// POST: /api/v1/appointment/create
/**
 * @swagger
 * /api/v1/appointment/create:
 *   post:
 *     summary: POST request for /api/v1/appointment/create
 *     tags: [Appointment]
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

    const parsed = appointmentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(
        'Validation failed',
        'VALIDATION_ERROR',
        parsed.error.format(),
        400
      );
    }

    const {
      patientId,
      doctorId,
      doctorName,
      doctorFees,
      patientEmail,
      patientName,
      patientNote,
      patientNumber,
      appointmentDate,
      time,
      day,
    } = parsed.data;

    // Create new appointment
    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      doctorName,
      doctorFees,
      patientEmail,
      patientName,
      patientNote,
      patientNumber,
      appointmentDate,
      time,
      day,
    });

    return ApiResponse.success({ appointment: newAppointment }, "Appointment created successfully", 201);
});