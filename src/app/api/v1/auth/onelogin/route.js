import { ApiResponse } from '@/utils/apiResponse';
import dbConnect from '@/utils/db';
import Admin from '@/models/Admin';
import Clinic from '@/models/Clinic';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient';
import Receptionist from '@/models/Reciptionist';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@/validations/userValidation';
import { withErrorHandler } from '@/utils/apiHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

/**
 * @swagger
 * /api/v1/auth/onelogin:
 *   post:
 *     summary: Authenticate user and issue JWT
 *     description: This endpoint checks the email and password against all 5 user collections (Admin, Clinic, Doctor, Patient, Receptionist) and returns a signed JWT Token based on their access level.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@practo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       type: object
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User not found
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

  const userModels = [
    {
      model: Admin,
      hashed: true,
      type: 'admin',
      format: (user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
    },
    {
      model: Clinic,
      hashed: false,
      type: 'clinic',
      format: (user) => ({
        id: user._id,
        name: user.clinicName,
        email: user.email,
        logo: user.logo,
        status: user.status,
        role: user.role,
      }),
    },
    {
      model: Doctor,
      hashed: true,
      type: 'doctor',
      format: (user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      }),
    },
    {
      model: Patient,
      hashed: false,
      type: 'patient',
      format: (user) => ({
        id: user._id,
        name: user.firstName,
        email: user.email,
        role: user.role,
      }),
    },
    {
      model: Receptionist,
      hashed: false,
      type: 'receptionist',
      format: (user) => {
        const { password, ...staffData } = user;
        return staffData;
      },
    },
  ];

  for (const { model, hashed, format } of userModels) {
    const user = await model.findOne({ email }).lean();

    if (user) {
      const isMatch = hashed
        ? await bcrypt.compare(password, user.password)
        : password === user.password;

      if (!isMatch) {
        return ApiResponse.error('Invalid password', 'INVALID_PASSWORD', [], 401);
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

      return ApiResponse.success({
        token,
        user: format(user),
      }, 'Login successful');
    }
  }

  return ApiResponse.error('User not found', 'USER_NOT_FOUND', [], 404);
});