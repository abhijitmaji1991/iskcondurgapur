import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function base64UrlToBuffer(base64url: string) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLen);
  const binary = atob(padded);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
}

async function verifyJwtEdge(token: string, secret: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;

    const encoder = new TextEncoder();
    const secretKeyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw',
      secretKeyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBuf = base64UrlToBuffer(signature);
    const dataBuf = encoder.encode(`${header}.${payload}`);

    const isValid = await crypto.subtle.verify('HMAC', key, sigBuf, dataBuf);
    if (!isValid) return null;

    const decodedPayload = JSON.parse(
      new TextDecoder().decode(base64UrlToBuffer(payload))
    );

    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    try {
      const token = request.cookies.get('iskcon_admin_token')?.value;

      if (!token) {
        console.warn('No token provided for admin route access');
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      const decoded = await verifyJwtEdge(token, JWT_SECRET);

      if (!decoded) {
        console.error('Token verification failed: Invalid token');
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', (decoded.sub || decoded.id) as string);
      requestHeaders.set('x-user-role', decoded.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
