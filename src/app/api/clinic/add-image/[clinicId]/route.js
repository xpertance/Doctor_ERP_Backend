// // /app/api/clinic/add-image/[clinicId]/route.js

// import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/db';
// import Clinic from '@/models/Clinic';

// export async function PATCH(req, { params }) {
//   await dbConnect();

//   const { clinicId } = params;
//   const { imageUrl } = await req.json();
// console.log("iamge",imageUrl);
//   if (!imageUrl) {
//     return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
//   }

//   try {
//     const updatedClinic = await Clinic.findByIdAndUpdate(
//       clinicId,
//       { $push: { images: imageUrl } },
//       { new: true }
//     );

//     if (!updatedClinic) {
//       return NextResponse.json({ message: 'Clinic not found' }, { status: 404 });
//     }

//     return NextResponse.json({ clinic: updatedClinic }, { status: 200 });
//   } catch (error) {
//     console.error('Error adding image to clinic:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

// // Optional: Add CORS preflight support
// export function OPTIONS() {
//   const response = new NextResponse(null, { status: 204 });
//   response.headers.set('Access-Control-Allow-Origin', '*');
//   response.headers.set('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
//   return response;
// }



// /app/api/clinic/add-image/[clinicId]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Clinic from '@/models/Clinic';

function withCors(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function PATCH(req, context) {
  await dbConnect();

  const { params } = context;
  const { clinicId } = params;

  const { imageUrl } = await req.json();
  console.log("Image:", imageUrl);

  if (!imageUrl) {
    return withCors(NextResponse.json({ message: 'Image URL is required' }, { status: 400 }));
  }

  try {
    const updatedClinic = await Clinic.findByIdAndUpdate(
      clinicId,
      { $push: { images: imageUrl } },
      { new: true }
    );

    if (!updatedClinic) {
      return withCors(NextResponse.json({ message: 'Clinic not found' }, { status: 404 }));
    }

    return withCors(NextResponse.json({ clinic: updatedClinic }, { status: 200 }));
  } catch (error) {
    console.error('Error adding image to clinic:', error);
    return withCors(NextResponse.json({ message: 'Server error' }, { status: 500 }));
  }
}

// CORS preflight support
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
