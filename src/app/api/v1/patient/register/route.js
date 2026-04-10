import { ApiResponse } from '@/utils/apiResponse';
import dbConnect from '@/utils/db';
import Patient from '@/models/Patient';
import bcrypt from 'bcryptjs';
import { patientRegistrationSchema } from '@/validations/userValidation';
import { withErrorHandler } from '@/utils/apiHandler';

// POST: /api/v1/patient/register
/**
 * @swagger
 * /api/v1/patient/register:
 *   post:
 *     summary: Register a new patient
 *     description: Creates a new patient account in the system and automatically assigns them the "patient" role.
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               bloodType:
 *                 type: string
 *                 example: "O+"
 *               password:
 *                 type: string
 *                 example: "StrongPassword123!"
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *       400:
 *         description: Validation failed or Duplicate Email
 */
export const POST = withErrorHandler(async (req) => {
  await dbConnect();
  const body = await req.json();

  const parsed = patientRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return ApiResponse.error(
      'Validation failed',
      'VALIDATION_ERROR',
      parsed.error.format(),
      400
    );
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    bloodType,
    password,
  } = parsed.data;

  // Check for existing patient
  const existingPatient = await Patient.findOne({ email });
  if (existingPatient) {
    return ApiResponse.error("Email already registered", "DUPLICATE_ENTRY", [], 400);
  }

  // Hash password (consistency with other models)
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new patient
  const newPatient = await Patient.create({
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    bloodType,
    password: hashedPassword,
    role: 'patient',
  });

  // Return success without password
  const patientData = newPatient.toObject();
  delete patientData.password;

  return ApiResponse.success({ patient: patientData }, "Patient registered successfully", 201);
});
