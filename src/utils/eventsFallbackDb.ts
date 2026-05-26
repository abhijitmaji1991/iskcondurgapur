import fs from 'fs';
import path from 'path';

// Default initial events (Seed data)
export const DEFAULT_SEED_EVENTS = [
  {
    _id: 'seed_event_janmashtami',
    title: 'Sri Krishna Janmashtami',
    description: 'Celebrate the divine appearance of Lord Sri Krishna with midnight arati, kirtan, bathing ceremony (abhishek), and delicious prasadam distribution.',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days in future
    location: 'Main Temple Hall, ISKCON Durgapur',
    category: 'Festival',
    image: '/images/iskcon-logo.png',
    organizer: 'ISKCON Durgapur Festival Committee',
    registrationLink: '',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'seed_event_rathayatra',
    title: 'Jagannath Ratha Yatra',
    description: 'The Festival of Chariots. Join thousands of devotees in pulling the grand chariot of Lord Jagannath, Baladeva, and Subhadra through the streets of Durgapur.',
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days in future
    location: 'Durgapur City Centre to Sagarbhanga Temple',
    category: 'Festival',
    image: '/images/iskcon-logo.png',
    organizer: 'ISKCON Durgapur Ratha Yatra Committee',
    registrationLink: '',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'seed_event_sundayfeast',
    title: 'Weekly Sunday Feast Program',
    description: 'Every Sunday afternoon, featuring bhajan, an enlightening lecture on Bhagavad-gita, community prayers, congregational chanting, and a free multicourse vegetarian feast.',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days in future
    location: 'Sankirtan Hall, ISKCON Durgapur',
    category: 'Program',
    image: '/images/iskcon-logo.png',
    organizer: 'ISKCON Durgapur Congregation Department',
    registrationLink: '',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'events_fallback.json');

// Helper to ensure directory exists and file is initialized
function ensureInitialized(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED_EVENTS, null, 2), 'utf-8');
    return DEFAULT_SEED_EVENTS;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading events fallback JSON database, resetting:', err);
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED_EVENTS, null, 2), 'utf-8');
    return DEFAULT_SEED_EVENTS;
  }
}

export const eventsFallbackDb = {
  getAll(): any[] {
    return ensureInitialized();
  },

  getById(id: string): any | null {
    const list = ensureInitialized();
    return list.find(e => e._id === id) || null;
  },

  create(data: any): any {
    const list = ensureInitialized();
    const newEvent = {
      ...data,
      _id: `event_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newEvent);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newEvent;
  },

  update(id: string, data: any): any | null {
    const list = ensureInitialized();
    const index = list.findIndex(e => e._id === id);
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
    const filtered = list.filter(e => e._id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};
