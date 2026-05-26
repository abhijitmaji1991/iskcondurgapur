import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'tour_registrations_fallback.json');

function ensureInitialized(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading tour registrations fallback JSON database, resetting:', err);
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
}

export const tourRegistrationsFallbackDb = {
  getAll(): any[] {
    return ensureInitialized();
  },

  getById(id: string): any | null {
    const list = ensureInitialized();
    return list.find(r => r._id === id || r.id === id) || null;
  },

  create(data: any): any {
    const list = ensureInitialized();
    const newReg = {
      ...data,
      _id: data._id || `reg_${Date.now()}`,
      id: data._id || `reg_${Date.now()}`,
      status: data.status || 'pending',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
    list.push(newReg);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newReg;
  },

  update(id: string, data: any): any | null {
    const list = ensureInitialized();
    const index = list.findIndex(r => r._id === id || r.id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return updated;
  },

  delete(id: string): boolean {
    const list = ensureInitialized();
    const filtered = list.filter(r => r._id !== id && r.id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};
