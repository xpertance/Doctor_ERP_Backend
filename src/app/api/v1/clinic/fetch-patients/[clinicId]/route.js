import { ApiResponse } from '@/utils/apiResponse';
import dbConnect from '@/utils/db';
import Doctor from '@/models/Doctor';
import Appointment from '@/models/Appointments';
import Patient from '@/models/Patient';

// GET: /api/v1/clinic/fetch-patients/[clinicId]
/**
 * @swagger
 * /api/v1/clinic/fetch-patients/{clinicId}:
 *   get:
 *     summary: GET request for /api/v1/clinic/fetch-patients/{clinicId}
 *     tags: [Clinic]
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { clinicId } = params;

    if (!clinicId) {
      return ApiResponse.error('Clinic ID is required', 'MISSING_FIELD', [], 400);
    }

    // 1. Find all doctors belonging to this clinic
    const doctors = await Doctor.find({ clinicId });
    const doctorIds = doctors.map(d => d._id.toString());

    if (doctorIds.length === 0) {
      return ApiResponse.success({ patients: [] }, 'No doctors found for this clinic');
    }

    // 2. Find all appointments for these doctors
    const appointments = await Appointment.find({ doctorId: { $in: doctorIds } });
    
    // 3. Get unique patient IDs from those appointments
    const patientIds = [...new Set(appointments.map(a => a.patientId).filter(id => id))];

    if (patientIds.length === 0) {
      return ApiResponse.success({ patients: [] }, 'No patients found for this clinic');
    }

    // 4. Fetch the patient details
    const patients = await Patient.find({ _id: { $in: patientIds } }).select('-password');

    return ApiResponse.success({ patients }, 'Patients fetched successfully');

  } catch (error) {
    console.error('Error fetching clinic patients:', error);
    return ApiResponse.error('Server error', 'SERVER_ERROR', error.message, 500);
  }
}