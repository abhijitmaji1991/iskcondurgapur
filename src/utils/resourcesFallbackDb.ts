import fs from 'fs';
import path from 'path';

// Default initial resources (Seed data)
export const DEFAULT_SEED_RESOURCES = [
  {
    _id: 'seed_resource_bg',
    title: 'Bhagavad-gita As It Is',
    type: 'Book',
    category: 'Scripture',
    description: 'The largest-selling and most widely used edition of the Gita in the world, with original Sanskrit symbols, Roman transliterations, English equivalents, translations and elaborate purports by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada.',
    content: 'Bhagavad-gita As It Is is the primary sacred text of ISKCON...',
    link: 'https://vedabase.io/en/library/bg/',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    thumbnail: '/images/iskcon-logo.png',
    tags: ['Gita', 'Philosophy', 'Sanskrit', 'Wisdom'],
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'seed_resource_japa',
    title: 'Mantra Meditation: A Practical Guide',
    type: 'Article',
    category: 'Sadhana',
    description: 'An introductory guide to chanting the Hare Krishna Maha Mantra, explaining the benefits of mantra meditation, bead chanting (japa), and practical tips for beginners.',
    content: 'The Hare Krishna Maha Mantra: Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare / Hare Rama, Hare Rama, Rama Rama, Hare Hare...',
    link: '',
    author: 'ISKCON Durgapur Education Desk',
    thumbnail: '/images/iskcon-logo.png',
    tags: ['Meditation', 'Japa', 'Chanting', 'Sadhana'],
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'seed_resource_intro_video',
    title: 'Introduction to Krishna Consciousness',
    type: 'Video',
    category: 'Introduction',
    description: 'A short introductory video exploring the origins, philosophy, and global community of the International Society for Krishna Consciousness (ISKCON).',
    content: '',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'ISKCON Communications',
    thumbnail: '/images/iskcon-logo.png',
    tags: ['Introduction', 'Video', 'Philosophy'],
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'resources_fallback.json');

// Helper to ensure directory exists and file is initialized
function ensureInitialized(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED_RESOURCES, null, 2), 'utf-8');
    return DEFAULT_SEED_RESOURCES;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading resources fallback JSON database, resetting:', err);
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED_RESOURCES, null, 2), 'utf-8');
    return DEFAULT_SEED_RESOURCES;
  }
}

export const resourcesFallbackDb = {
  getAll(): any[] {
    return ensureInitialized();
  },

  getById(id: string): any | null {
    const list = ensureInitialized();
    return list.find(r => r._id === id) || null;
  },

  create(data: any): any {
    const list = ensureInitialized();
    const newResource = {
      ...data,
      _id: `resource_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newResource);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return newResource;
  },

  update(id: string, data: any): any | null {
    const list = ensureInitialized();
    const index = list.findIndex(r => r._id === id);
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
    const filtered = list.filter(r => r._id !== id);
    if (list.length === filtered.length) return false;
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
};
