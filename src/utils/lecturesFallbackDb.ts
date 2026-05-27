import fs from 'fs';
import path from 'path';
import lecturesFallbackSeed from '../data/lectures_fallback.json';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'lectures_fallback.json');

// Helper to ensure directory exists and file is initialized
function ensureInitialized(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(lecturesFallbackSeed, null, 2), 'utf-8');
    return lecturesFallbackSeed;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading lectures fallback JSON database, resetting:', err);
    fs.writeFileSync(DATA_FILE, JSON.stringify(lecturesFallbackSeed, null, 2), 'utf-8');
    return lecturesFallbackSeed;
  }
}

export const lecturesFallbackDb = {
  getAll(): any[] {
    return ensureInitialized();
  },

  getById(id: string): any | null {
    const list = ensureInitialized();
    return list.find(l => l._id === id || l.code === id) || null;
  },

  create(data: any): any {
    const list = ensureInitialized();
    const newLecture = {
      ...data,
      _id: `lecture_${Date.now()}`,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newLecture);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newLecture;
  },

  update(id: string, data: any): any | null {
    const list = ensureInitialized();
    const index = list.findIndex(l => l._id === id || l.code === id);
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
    const filtered = list.filter(l => l._id !== id && l.code !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};
