import { NextResponse } from 'next/server';

// Configurable allowed origins via env
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

const CORS_METHODS = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';
const CORS_HEADERS = 'Content-Type,Authorization';

function setCors(response, origin) {
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', CORS_METHODS);
  response.headers.set('Access-Control-Allow-Headers', CORS_HEADERS);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export function middleware(request) {
  const origin = request.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  const allowedOrigin = isAllowed ? origin : ALLOWED_ORIGINS[0];

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    setCors(response, allowedOrigin);
    return response;
  }

  // For all other requests, let them through and attach CORS headers
  const response = NextResponse.next();
  setCors(response, allowedOrigin);
  return response;
}

export const config = {
  // Apply to all /api/v1 routes only
  matcher: '/api/v1/:path*',
};
