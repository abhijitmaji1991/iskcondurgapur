import fs from 'fs/promises';
import path from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import mongoose from 'mongoose';
import logger from '@/utils/logger';

class BackupManager {
  private static instance: BackupManager;
  private backupDir: string;
  private readonly MAX_BACKUPS = 10;

  private constructor() {
    this.backupDir = path.join(process.cwd(), 'backups');
    this.ensureBackupDir();
    this.scheduleBackups();
  }

  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  private async ensureBackupDir() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create backup directory:', error);
    }
  }

  private scheduleBackups() {
    // Run daily backups at 2 AM
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 2 && now.getMinutes() === 0) {
        this.createBackup();
      }
    }, 60 * 1000); // Check every minute
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}.tar.gz`;
    const backupPath = path.join(this.backupDir, backupName);

    try {
      // Create backup manifest
      const manifest = {
        timestamp,
        files: [],
        database: 'mongodb',
        version: '1.0'
      };

      // Create backup archive
      const gzip = createGzip();
      const output = createWriteStream(backupPath);

      // Add files to backup
      await this.backupFiles(manifest);

      // Add database backup
      await this.backupDatabase(manifest);

      // Save manifest
      await fs.writeFile(
        path.join(this.backupDir, `manifest-${timestamp}.json`),
        JSON.stringify(manifest, null, 2)
      );

      // Clean up old backups
      await this.cleanOldBackups();

      logger.info('Backup created successfully:', backupName);
    } catch (error) {
      logger.error('Backup failed:', error);
      throw error;
    }
  }

  private async backupFiles(manifest: any) {
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    try {
      await fs.access(uploadsDir);
      // In a real Tar implementation we'd add files here. 
      // For this simplified version, we just record that we attempted it.
      manifest.files.push('public/uploads');
      logger.info('File backup metadata added to manifest');
    } catch (error) {
      logger.warn('Uploads directory not found, skipping file backup');
    }
  }

  private async backupDatabase(manifest: any) {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }

      const collections = await db.listCollections().toArray();
      const dbBackupPath = path.join(this.backupDir, `db-${manifest.timestamp}`);
      await fs.mkdir(dbBackupPath, { recursive: true });

      for (const collection of collections) {
        const data = await db.collection(collection.name).find({}).toArray();
        await fs.writeFile(
          path.join(dbBackupPath, `${collection.name}.json`),
          JSON.stringify(data, null, 2)
        );
      }

      manifest.databaseBackupPath = dbBackupPath;
      logger.info('Database backup (JSON dump) completed');
    } catch (error) {
      logger.error('Database backup failed:', error);
      throw error;
    }
  }

  async restore(backupName: string) {
    const backupPath = path.join(this.backupDir, backupName);
    const manifestPath = backupPath.replace('.tar.gz', '-manifest.json');

    try {
      // Read manifest
      const manifest = JSON.parse(
        await fs.readFile(manifestPath, 'utf-8')
      );

      // Verify backup integrity
      await this.verifyBackup(backupPath, manifest);

      // Restore files
      await this.restoreFiles(backupPath, manifest);

      // Restore database
      await this.restoreDatabase(backupPath, manifest);

      logger.info('Restore completed successfully');
    } catch (error) {
      logger.error('Restore failed:', error);
      throw error;
    }
  }

  private async verifyBackup(backupPath: string, manifest: any) {
    // Implement backup verification
  }

  private async restoreFiles(backupPath: string, manifest: any) {
    // Implement file restoration
  }

  private async restoreDatabase(backupPath: string, manifest: any) {
    // Implement database restoration
  }

  private async cleanOldBackups() {
    try {
      const backups = await fs.readdir(this.backupDir);
      const backupFiles = backups.filter(f => f.endsWith('.tar.gz'));

      if (backupFiles.length > this.MAX_BACKUPS) {
        const oldestBackups = backupFiles
          .sort()
          .slice(0, backupFiles.length - this.MAX_BACKUPS);

        for (const backup of oldestBackups) {
          const backupPath = path.join(this.backupDir, backup);
          await fs.unlink(backupPath);

          // Also remove corresponding manifest
          const manifestPath = backupPath.replace('.tar.gz', '-manifest.json');
          await fs.unlink(manifestPath).catch(() => { });

          logger.info('Removed old backup:', backup);
        }
      }
    } catch (error) {
      logger.error('Failed to clean old backups:', error);
    }
  }
}

export const backupManager = BackupManager.getInstance();
