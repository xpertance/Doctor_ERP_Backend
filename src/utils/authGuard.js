import jwt from 'jsonwebtoken';
import { ApiResponse } from './apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

/**
 * Role-Based Access Control (RBAC) Higher-Order Function.
 * Wraps a Next.js App Router handler to securely authorize specific roles.
 * 
 * @param {string[]} allowedRoles Array of roles (e.g. ['admin', 'doctor', 'clinic', 'receptionist', 'patient'])
 * @param {Function} handler The route handler function
 * @returns {Function} Authorized handler
 */
export function withRoles(allowedRoles, handler) {
  return async (req, context) => {
    try {
      // 1. Extract Bearer token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ApiResponse.error(
          'Missing or invalid authorization header',
          'MISSING_TOKEN',
          [],
          401
        );
      }

      const token = authHeader.split(' ')[1];

      // 2. Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return ApiResponse.error(
          'Token verification failed or expired',
          'INVALID_TOKEN',
          error.message,
          401
        );
      }

      // 3. Enforce RBAC Role Check
      if (!decoded.role) {
        return ApiResponse.error(
          'User role is undefined',
          'UNDEFINED_ROLE',
          [],
          403
        );
      }

      // Support situations where allowedRoles might be empty/null (meaning just logged in is enough) 
      // or strictly matching the allowed list.
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(decoded.role)) {
          return ApiResponse.error(
            `Access Denied. Required roles: ${allowedRoles.join(', ')}`,
            'FORBIDDEN',
            { yourRole: decoded.role },
            403
          );
        }
      }

      // 4. Inject decoded user data into the request object's context
      // NextRequest objects are read-only in some properties, but we can assign custom props
      req.user = decoded;

      // Proceed to the original handler with an authorized request
      return await handler(req, context);
    } catch (error) {
      console.error('RBAC Error:', error);
      return ApiResponse.error(
        'Internal Server Authorization Error',
        'AUTH_ERROR',
        error.message,
        500
      );
    }
  };
}
