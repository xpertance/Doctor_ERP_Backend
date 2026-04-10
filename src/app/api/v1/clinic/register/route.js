import { ApiResponse } from '@/utils/apiResponse';
import dbConnect from '@/utils/db';
import Clinic from '@/models/Clinic';
import { clinicRegistrationSchema } from '@/validations/userValidation';
import { withErrorHandler } from '@/utils/apiHandler';

// GET: /api/v1/clinic/fetch-all-clinics
/**
 * @swagger
 * /api/v1/clinic/register:
 *   get:
 *     summary: GET request for /api/v1/clinic/register
 *     tags: [Clinic]
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
export const GET = withErrorHandler(async () => {
  await dbConnect();
  const clinics = await Clinic.find().select('-password');

  return ApiResponse.success({ clinics }, 'Clinics fetched successfully');
});

// POST: /api/v1/clinic/register
/**
 * @swagger
 * /api/v1/clinic/register:
 *   post:
 *     summary: POST request for /api/v1/clinic/register
 *     tags: [Clinic]
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

  const parsed = clinicRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return ApiResponse.error(
      'Validation failed',
      'VALIDATION_ERROR',
      parsed.error.format(),
      400
    );
  }

  const {
    clinicName,
    clinicType = 'general',
    description,
    registrationNumber,
    taxId,
    specialties = [],
    logo,
    website,
    email,
    phone,
    address,
    password,
    city,
    state,
    postalCode,
    country,
    openingHours = {},
    licenseDocument,
    licenseDocumentUrl,
    gstDocument,
    gstDocumentUrl,
    is24x7 = false,
  } = parsed.data;

  // Cleaned Opening Hours (Only if open & close provided)
  const cleanedOpeningHours = {};
  for (const [day, time] of Object.entries(openingHours)) {
    cleanedOpeningHours[day] = {
      open: time?.open || '',
      close: time?.close || '',
    };
  }

  const newClinic = await Clinic.create({
    clinicName,
    clinicType,
    description,
    registrationNumber,
    taxId,
    specialties,
    logo,
    website,
    email,
    phone,
    address,
    password,
    city,
    state,
    postalCode,
    country,
    role: 'clinic',
    openingHours: cleanedOpeningHours,
    licenseDocument,
    licenseDocumentUrl,
    gstDocument,
    gstDocumentUrl,
    is24x7,
  });

  return ApiResponse.success({ clinic: newClinic }, 'Clinic registered successfully', 201);
});
