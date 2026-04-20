import { NextRequest, NextResponse } from 'next/server';
import Tokens from 'csrf';
import logger from '@/utils/logger';

const tokens = new Tokens();
const CSRF_SECRET = process.env.CSRF_SECRET || 'your-csrf-secret-key';

export async function csrfMiddleware(request: NextRequest) {
  // Skip CSRF check for GET requests
  if (request.method === 'GET') {
    return NextResponse.next();
  }

  try {
    const csrfToken = request.headers.get('x-csrf-token');
    const sessionToken = request.cookies.get('csrf')?.value;

    if (!csrfToken || !sessionToken) {
      logger.error('CSRF token missing');
      return new NextResponse(
        JSON.stringify({ message: 'Invalid CSRF token' }),
        { status: 403 }
      );
    }

    const isValid = tokens.verify(sessionToken, csrfToken);
    if (!isValid) {
      logger.error('CSRF token validation failed');
      return new NextResponse(
        JSON.stringify({ message: 'Invalid CSRF token' }),
        { status: 403 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    logger.error('CSRF middleware error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
