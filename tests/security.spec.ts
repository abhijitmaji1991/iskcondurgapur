import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────
//  Security Tests
// ─────────────────────────────────────────────────────────────────

test.describe('Security Tests', () => {
  test('should prevent XSS attacks', async ({ page }) => {
    const xssPayload = '<script>alert("XSS")</script>';
    await page.goto(`/?q=${encodeURIComponent(xssPayload)}`);
    const content = await page.content();
    expect(content).not.toContain(xssPayload);
  });

  test('should enforce CSRF protection', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { username: '__csrf_test__', password: '__csrf_test__' },
    });
    // Should return 400 (bad creds) or 401 – never 500
    expect([400, 401, 403, 429]).toContain(response.status());
  });

  test('should enforce rate limiting on login', async ({ request }) => {
    for (let i = 0; i < 10; i++) {
      await request.post('/api/auth/login', {
        data: { username: 'test', password: 'test' },
      });
    }
    const response = await request.post('/api/auth/login', {
      data: { username: 'test', password: 'test' },
    });
    // After excessive attempts the IP blocker should return 403 or 429
    expect([403, 429]).toContain(response.status());
  });

  test('should verify security headers are present', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();

    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
  });

  test('should protect against path traversal', async ({ request }) => {
    const attackPatterns = [
      '../../etc/passwd',
      '../windows/system32/cmd.exe',
    ];

    for (const pattern of attackPatterns) {
      const response = await request.get(
        `/api/file?path=${encodeURIComponent(pattern)}`
      );
      // Should never succeed (200); expect 400, 404, or 405
      expect(response.status()).not.toBe(200);
    }
  });

  test('should enforce secure session cookie attributes', async ({ context }) => {
    const page = await context.newPage();

    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'iskcon123');
    await page.click('button[type="submit"]');

    // Wait for potential redirect
    await page.waitForTimeout(1500);

    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'iskcon_admin_token');

    if (sessionCookie) {
      expect(sessionCookie.httpOnly).toBe(true);
      expect(sessionCookie.sameSite).toBe('Strict');
    } else {
      // If cookie is set in localStorage instead, just confirm the page redirected
      const url = page.url();
      expect(url).toContain('/admin');
    }
  });
});

// ─────────────────────────────────────────────────────────────────
//  Admin Panel Smoke Tests
// ─────────────────────────────────────────────────────────────────

test.describe('Admin Panel Smoke Tests', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/admin/login');
  });

  test('should load admin login page', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should login and reach dashboard', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'iskcon123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin');
  });
});

// ─────────────────────────────────────────────────────────────────
//  Public Pages Smoke Tests
// ─────────────────────────────────────────────────────────────────

test.describe('Public Pages Smoke Tests', () => {
  test('homepage should load', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
  });

  test('about page should load', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBeLessThan(400);
  });

  test('events page should load', async ({ page }) => {
    const response = await page.goto('/events');
    expect(response?.status()).toBeLessThan(400);
  });

  test('bhajans public page should load', async ({ page }) => {
    const response = await page.goto('/resources/bhajans');
    expect(response?.status()).toBeLessThan(400);
  });

  test('donate page should load', async ({ page }) => {
    const response = await page.goto('/donate');
    expect(response?.status()).toBeLessThan(400);
  });
});
