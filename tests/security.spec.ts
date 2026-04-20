import { test, expect } from '@playwright/test';
import { securityMonitor } from '@/utils/securityMonitor';
import { backupManager } from '@/utils/backupManager';

test.describe('Security Tests', () => {
  test('should prevent XSS attacks', async ({ page }) => {
    // Test XSS prevention
    const xssPayload = '<script>alert("XSS")</script>';
    await page.goto(`/search?q=${encodeURIComponent(xssPayload)}`);
    
    // Check if the script was sanitized
    const content = await page.content();
    expect(content).not.toContain(xssPayload);
  });

  test('should enforce CSRF protection', async ({ request }) => {
    // Test CSRF protection
    const response = await request.post('/api/protected-route', {
      data: { test: 'data' }
    });
    
    expect(response.status()).toBe(403);
    expect(await response.json()).toHaveProperty('message', 'Invalid CSRF token');
  });

  test('should enforce rate limiting', async ({ request }) => {
    // Test rate limiting
    for (let i = 0; i < 10; i++) {
      await request.post('/api/auth/login', {
        data: { username: 'test', password: 'test' }
      });
    }
    
    const response = await request.post('/api/auth/login', {
      data: { username: 'test', password: 'test' }
    });
    
    expect(response.status()).toBe(429);
  });

  test('should verify security headers', async ({ page }) => {
    await page.goto('/');
    
    const headers = await page.evaluate(() => {
      const headers = {};
      for (const [key, value] of Object.entries(window.performance.getEntriesByType('navigation')[0].responseHeaders)) {
        headers[key.toLowerCase()] = value;
      }
      return headers;
    });

    // Check security headers
    expect(headers['content-security-policy']).toBeDefined();
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
  });

  test('should protect against SQL injection', async ({ request }) => {
    const sqlPayload = "'; DROP TABLE users; --";
    const response = await request.post('/api/data', {
      data: { query: sqlPayload }
    });
    
    expect(response.status()).toBe(400);
  });

  test('should enforce secure session management', async ({ context }) => {
    const page = await context.newPage();
    
    // Login
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Check cookie security
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'iskcon_admin_token');
    
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie.secure).toBe(true);
    expect(sessionCookie.httpOnly).toBe(true);
    expect(sessionCookie.sameSite).toBe('Strict');
  });

  test('should block common attack patterns', async ({ request }) => {
    const attackPatterns = [
      '../../etc/passwd',
      '<?php echo "hack"; ?>',
      '../windows/system32/cmd.exe',
      'union select * from users'
    ];

    for (const pattern of attackPatterns) {
      const response = await request.get(`/api/file?path=${encodeURIComponent(pattern)}`);
      expect(response.status()).toBe(400);
    }
  });
});

test.describe('Backup and Recovery Tests', () => {
  test('should create and verify backups', async () => {
    const backup = await backupManager.createBackup();
    expect(backup).toBeDefined();
    
    const verified = await backupManager.verifyBackup(backup.name);
    expect(verified).toBe(true);
  });
});

test.describe('Security Monitoring Tests', () => {
  test('should detect and alert on suspicious activities', async () => {
    const initialAlerts = securityMonitor.getRecentAlerts();
    
    // Simulate suspicious activity
    for (let i = 0; i < 10; i++) {
      await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'admin', password: 'wrongpass' })
      });
    }

    const newAlerts = securityMonitor.getRecentAlerts();
    expect(newAlerts.length).toBeGreaterThan(initialAlerts.length);
  });
});
