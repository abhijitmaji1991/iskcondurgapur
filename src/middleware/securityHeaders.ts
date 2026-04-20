import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from '@/utils/logger';

export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next();
  const headers = response.headers;

  try {
    // Content Security Policy
    headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Adjust based on your needs
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "frame-ancestors 'none'",
        "connect-src 'self' https://api.example.com", // Adjust based on your API endpoints
      ].join('; ')
    );

    // HSTS (HTTP Strict Transport Security)
    if (process.env.NODE_ENV === 'production') {
      headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }

    // Prevent clickjacking
    headers.set('X-Frame-Options', 'DENY');

    // Disable MIME type sniffing
    headers.set('X-Content-Type-Options', 'nosniff');

    // Enable XSS filter
    headers.set('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy
    headers.set(
      'Permissions-Policy',
      [
        'geolocation=()',
        'camera=()',
        'microphone=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'accelerometer=()',
        'gyroscope=()',
      ].join(', ')
    );

    // Feature Policy
    headers.set(
      'Feature-Policy',
      [
        'microphone "none"',
        'camera "none"',
        'geolocation "none"',
        'payment "none"',
        'usb "none"',
      ].join('; ')
    );

    // Clear Site Data on logout
    if (request.nextUrl.pathname === '/api/auth/logout') {
      headers.set(
        'Clear-Site-Data',
        '"cache", "cookies", "storage", "executionContexts"'
      );
    }

    return response;
  } catch (error) {
    logger.error('Error setting security headers:', error);
    return response;
  }
}
