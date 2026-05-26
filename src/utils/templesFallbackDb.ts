import fs from 'fs';
import path from 'path';

// Default initial temples (Seed data)
export const DEFAULT_SEED_TEMPLES = [
  {
    _id: 'seed_temple_durgapur',
    name: 'ISKCON Durgapur',
    location: 'Durgapur, West Bengal',
    country: 'India',
    image: '/images/iskcon-logo.png',
    description: 'Vibrant spiritual community center in Durgapur hosting regular Sunday feasts, youth programs, and community welfare initiatives.',
    address: 'Sagarbhanga, Durgapur, West Bengal 713211',
    coordinates: { lat: 23.4912, lng: 87.3119 },
    contact: {
      email: 'info@iskcondurgapur.com',
      phone: '+91 98765 43210',
      website: 'https://www.iskcondurgapur.com'
    },
    timings: '4:30 AM - 1:00 PM, 4:15 PM - 8:30 PM'
  },
  {
    _id: 'seed_temple_mayapur',
    name: 'ISKCON Mayapur (TOVP)',
    location: 'Mayapur, West Bengal',
    country: 'India',
    image: '/images/iskcon-logo.png',
    description: 'The global headquarters of ISKCON and birthplace of Sri Chaitanya Mahaprabhu, featuring the magnificent Temple of the Vedic Planetarium.',
    address: 'Shree Mayapur Dham, Nadia, West Bengal 741313',
    coordinates: { lat: 23.4395, lng: 88.3888 },
    contact: {
      email: 'info@mayapur.com',
      phone: '+91 34722 45239',
      website: 'https://www.mayapur.com'
    },
    timings: '4:30 AM - 8:30 PM'
  },
  {
    _id: 'seed_temple_vrindavan',
    name: 'ISKCON Vrindavan',
    location: 'Vrindavan, Uttar Pradesh',
    country: 'India',
    image: '/images/iskcon-logo.png',
    description: 'The famous Krishna Balaram Mandir, established by Srila Prabhupada in the sacred land of Vrindavan, attracting millions of pilgrims annually.',
    address: 'Bhaktivedanta Swami Marg, Raman Reti, Vrindavan, Uttar Pradesh 281121',
    coordinates: { lat: 27.5714, lng: 77.6766 },
    contact: {
      email: 'info@iskconvrindavan.com',
      phone: '+91 56525 40343',
      website: 'https://www.iskconvrindavan.com'
    },
    timings: '4:30 AM - 12:45 PM, 4:30 PM - 8:30 PM'
  }
];

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'temples_fallback.json');

// Helper to ensure directory exists and file is initialized
function ensureInitialized(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED_TEMPLES, null, 2), 'utf-8');
    return DEFAULT_SEED_TEMPLES;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading temples fallback JSON database, resetting:', err);
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED_TEMPLES, null, 2), 'utf-8');
    return DEFAULT_SEED_TEMPLES;
  }
}

export const templesFallbackDb = {
  getAll(): any[] {
    return ensureInitialized();
  },

  getById(id: string): any | null {
    const list = ensureInitialized();
    return list.find(t => t._id === id) || null;
  },

  create(data: any): any {
    const list = ensureInitialized();
    const newTemple = {
      ...data,
      _id: `temple_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newTemple);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newTemple;
  },

  update(id: string, data: any): any | null {
    const list = ensureInitialized();
    const index = list.findIndex(t => t._id === id);
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
    const filtered = list.filter(t => t._id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};
