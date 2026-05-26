import fs from 'fs';
import path from 'path';

export const DEFAULT_SETTINGS = {
  contactPhone: '+1 (310) 836-2676',
  contactEmail: 'info.iskcondurgapur@gmail.com',
  contactAddress: 'ISKCON Durgapur, Netaji Subhas Chandra Bose Road, A-Zone, Durgapur, West Bengal, India 713204',
  whatsappNumber: '919563786224',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61571919518223',
  youtubeUrl: 'https://www.youtube.com/@iskcondurgapurofficial957',
  twitterUrl: 'https://twitter.com/iskcon',
  instagramUrl: 'https://instagram.com/iskcon',
  noticeBannerText: 'Welcome to ISKCON Durgapur!',
  noticeBannerEnabled: false
};

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'settings_fallback.json');

function ensureInitialized(): any {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading settings fallback JSON, resetting:', err);
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    return DEFAULT_SETTINGS;
  }
}

export const settingsFallbackDb = {
  get(): any {
    return ensureInitialized();
  },

  update(data: any): any {
    const current = ensureInitialized();
    const updated = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  }
};
