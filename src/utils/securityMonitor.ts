import nodemailer from 'nodemailer';
import logger from '@/utils/logger';
import dbConnect from '@/utils/db';
import Alert from '@/models/alert.model';

interface SecurityAlert {
  type: 'high' | 'medium' | 'low';
  message: string;
  details: any;
  timestamp: Date;
}

class SecurityMonitor {
  private static instance: SecurityMonitor;
  private alerts: SecurityAlert[] = [];
  private readonly MAX_ALERTS = 1000;
  private readonly EMAIL_THRESHOLD = 'high';

  private emailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  private constructor() {
    // Start periodic security checks
    this.startPeriodicChecks();
  }

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  async addAlert(type: SecurityAlert['type'], message: string, details: any) {
    const alert: SecurityAlert = {
      type,
      message,
      details,
      timestamp: new Date()
    };

    this.alerts.unshift(alert);

    // Trim alerts list if it gets too long
    if (this.alerts.length > this.MAX_ALERTS) {
      this.alerts = this.alerts.slice(0, this.MAX_ALERTS);
    }

    // Log alert
    logger.warn('Security Alert:', { type, message, details });

    // Send email for high priority alerts
    if (type === 'high') {
      await this.sendAlertEmail(alert);
    }

    // Store alert in database (implement this based on your database solution)
    await this.storeAlert(alert);
  }

  private async sendAlertEmail(alert: SecurityAlert) {
    if (!process.env.ALERT_EMAIL) return;

    try {
      await this.emailTransport.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ALERT_EMAIL,
        subject: `[SECURITY ALERT] ${alert.message}`,
        html: `
          <h2>Security Alert</h2>
          <p><strong>Type:</strong> ${alert.type}</p>
          <p><strong>Message:</strong> ${alert.message}</p>
          <p><strong>Time:</strong> ${alert.timestamp.toISOString()}</p>
          <p><strong>Details:</strong></p>
          <pre>${JSON.stringify(alert.details, null, 2)}</pre>
        `
      });
    } catch (error) {
      logger.error('Failed to send alert email:', error);
    }
  }

  private async storeAlert(alert: SecurityAlert) {
    try {
      await dbConnect();
      await Alert.create({
        type: alert.type,
        message: alert.message,
        details: alert.details,
        timestamp: alert.timestamp
      });
      logger.info('Security alert stored in database');
    } catch (error) {
      logger.error('Failed to store security alert in database:', error);
    }
  }

  private startPeriodicChecks() {
    setInterval(() => this.runSecurityChecks(), 5 * 60 * 1000); // Every 5 minutes
  }

  private async runSecurityChecks() {
    try {
      // Check for suspicious patterns
      this.checkLoginAttempts();
      this.checkApiUsage();
      this.checkSystemResources();
      this.checkFileIntegrity();
    } catch (error) {
      logger.error('Error in security checks:', error);
    }
  }

  private checkLoginAttempts() {
    // Implement login attempt pattern analysis
  }

  private checkApiUsage() {
    // Implement API usage pattern analysis
  }

  private checkSystemResources() {
    // Implement system resource monitoring
  }

  private checkFileIntegrity() {
    // Implement file integrity monitoring
  }

  getRecentAlerts(limit: number = 50) {
    return this.alerts.slice(0, limit);
  }
}

export const securityMonitor = SecurityMonitor.getInstance();
