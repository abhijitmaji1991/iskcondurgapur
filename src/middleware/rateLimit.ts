import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from '@/utils/logger';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window
const LOGIN_MAX_REQUESTS = 5; // Max login attempts per window

export function rateLimit(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const isLoginRoute = request.nextUrl.pathname === '/admin/login' && request.method === 'POST';
  const maxRequests = isLoginRoute ? LOGIN_MAX_REQUESTS : MAX_REQUESTS;

  // Clean up old entries
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }

  // Initialize or get existing window
  if (!store[ip] || store[ip].resetTime < now) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_SIZE,
    };
    return NextResponse.next();
  }

  // Increment request count
  store[ip].count++;

  // Check if limit exceeded
  if (store[ip].count > maxRequests) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: Math.ceil((store[ip].resetTime - now) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((store[ip].resetTime - now) / 1000).toString(),
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return NextResponse.next();
}
