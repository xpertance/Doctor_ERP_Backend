// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Admin from '@/models/Admin';
// import Clinic from '@/models/Clinic';
// import Doctor from '@/models/Doctor';
// import Patient from '@/models/Patient';
// import Receptionist from '@/models/Reciptionist';
// import bcrypt from 'bcryptjs';

// // CORS Headers
// const setCorsHeaders = (response) => {
//   response.headers.set('Access-Control-Allow-Origin', '*');
//   response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
//   return response;
// };

// // CORS Preflight
// export async function OPTIONS() {
//   return setCorsHeaders(NextResponse.json({}, { status: 200 }));
// }

// // POST login
// export async function POST(req) {
//   await dbConnect();
//   const { email, password } = await req.json();

//   if (!email || !password) {
//     const res = NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
//     return setCorsHeaders(res);
//   }

//   // List of models with info on whether they use hashed passwords
//   const userModels = [
//     { model: Admin, hashed: true },
//     { model: Doctor, hashed: true },
//     { model: Patient, hashed: false },
//     { model: Receptionist, hashed: false },
//     { model: Clinic, hashed: false }
//   ];

//   for (const { model, hashed } of userModels) {
//     const user = await model.findOne({ email }).lean();

//     if (user) {
//       let passwordMatch = false;

//       if (hashed) {
//         passwordMatch = await bcrypt.compare(password, user.password);
//       } else {
//         passwordMatch = password === user.password;
//       }

//       if (passwordMatch) {
//         const { password, ...userWithoutPassword } = user;
//         const res = NextResponse.json({ success: true, user: userWithoutPassword });
//         return setCorsHeaders(res);
//       } else {
//         const res = NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
//         return setCorsHeaders(res);
//       }
//     }
//   }

//   const res = NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//   return setCorsHeaders(res);
// }


import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Admin from '@/models/Admin';
import Clinic from '@/models/Clinic';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient';
import Receptionist from '@/models/Reciptionist';;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Dummy secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// CORS setup
const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

export async function OPTIONS() {
  return setCorsHeaders(NextResponse.json({}, { status: 200 }));
}

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  if (!email || !password) {
    return setCorsHeaders(
      NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 })
    );
  }

  // Model list with password type and response formatter
  const userModels = [
    {
      model: Admin,
      hashed: true,
      format: (user, token) => ({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
    },
    {
      model: Clinic,
      hashed: false,
      format: (user, token) => ({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.clinicName,
          email: user.email,
          logo: user.logo,
          status:user.status,
          role: user.role,
        },
      }),
    },
    {
      model: Doctor,
      hashed: true,
      format: (user, token) => ({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
        },
      }),
    },
    {
      model: Patient,
      hashed: false,
      format: (user, token) => ({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.firstName,
          email: user.email,
          role: user.role,
        },
      }),
    },
    {
      model: Receptionist,
      hashed: false,
      format: (user, token) => {
        const { password, ...staffData } = user;
        return {
          success: true,
          token,
          user: staffData,
        };
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
        return setCorsHeaders(
          NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 })
        );
      }

      // Generate JWT token (optional: customize payload)
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

      const res = NextResponse.json(format(user, token), { status: 200 });
      return setCorsHeaders(res);
    }
  }

  return setCorsHeaders(
    NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
  );
}
