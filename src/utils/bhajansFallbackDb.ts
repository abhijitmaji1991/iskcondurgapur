import fs from 'fs';
import path from 'path';

// Default initial bhajans (Seed data)
export const DEFAULT_SEED_BHAJANS = [
  {
    _id: 'seed_radha_madhava',
    title: 'Jaya Radha Madhava',
    author: 'Srila Bhaktivinoda Thakura',
    preview: 'jaya rādhā-mādhava kuñja-bihārī...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    isPublished: true,
    lyrics: [
      {
        devanagari: [
          '(१) जय राधा-माधव कुञ्ज-बिहारी',
          'गोपी-जन-वल्लभ गिरि-वर-धारी'
        ],
        roman: [
          '(1) jaya rādhā-mādhava kuñja-bihārī',
          'gopī-jana-vallabha giri-vara-dhārī'
        ],
        translation: [
          'Krishna is the lover of Radha. He displays many amorous pastimes in the groves of Vrindavana, He is the lover of the cowherd maidens of Vraja, and the holder of the great hill named Govardhana.'
        ]
      },
      {
        devanagari: [
          '(२) यशোদা-নন্দন ব্রজ-জন-রঞ্জন',
          'যামুনা-তীর-বন-চারী'
        ],
        roman: [
          '(2) yaśodā-nandana vraja-jana-rañjana',
          'yāmunā-tīra-vana-cārī'
        ],
        translation: [
          'He is the beloved son of Mother Yasoda, the delighter of the inhabitants of Vraja, and He wanders in the forests along the banks of the River Yamuna.'
        ]
      }
    ]
  },
  {
    _id: 'seed_damodarashtakam',
    title: 'Sri Damodarashtakam',
    author: 'Satyavrata Muni',
    preview: 'namāmīśvaraṁ sac-cid-ānanda-rūpaṁ...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    isPublished: true,
    lyrics: [
      {
        devanagari: [
          '(१) नमामीश्वरं सच्चिदानन्दरूपं',
          'लसत्कुण्डलं गोकुলে भ्राजमानम्',
          'यशोदाभियोलूखलाद्धावमानं',
          'परामृष्टमत्यन्ततो द्रुत्या गोप्या'
        ],
        roman: [
          '(1) namāmīśvaraṁ sac-cid-ānanda-rūpaṁ',
          'lasat-kuṇḍalaṁ gokule bhrājamānam',
          'yaśodābhiyolūkhalād dhāvamānaṁ',
          'parāmṛṣṭam atyantato drutyā gopyā'
        ],
        translation: [
          'To the supreme controller, who possesses an eternal form of absolute existence, knowledge, and bliss, whose glistening earrings swing to and fro, who manifested Himself in Gokula, who stole butter and ran in fear of Mother Yasoda, but was captured from behind by her fast chase—to that Lord Damodara, I offer my respectful obeisances.'
        ]
      },
      {
        devanagari: [
          '(२) रुदन्तं मुहुर्नेत्रयुग्मं मृजन्तं',
          'कराम्भोजयुग्मेन सातङ्कनेत्रम्',
          'मुहुः श्वासकम्पत्रिरेखाङ्ककण्ठ-',
          'स्थितग्रैवं दामोदरं भक्तिबद्धम्'
        ],
        roman: [
          '(2) rudantaṁ muhur netra-yugmaṁ mṛjantaṁ',
          'karāmbhoja-yugmena sātanka-netram',
          'muhuḥ śvāsa-kampa-trirekhāṅka-kaṇṭha-',
          'sthita-graivaṁ dāmodaraṁ bhakti-baddham'
        ],
        translation: [
          'He cries and rubs His eyes again and again with His two lotus-like hands. His eyes are filled with fear, and the necklace of pearls around His neck, marked with three lines like a conchshell, trembles due to His quick breathing while sobbing. To this Lord Damodara, who is bound not by ropes but by His mother\'s pure love, I offer my obeisances.'
        ]
      }
    ]
  }
];

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'bhajans_fallback.json');

// Helper to ensure directory exists and file is initialized
let memoryDb: any[] | null = null;

function ensureInitialized(): any[] {
  if (memoryDb) return memoryDb;

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
  } catch (err) {
    console.warn('Error reading fallback JSON database on Vercel:', err);
  }

  // If we can't read it or it doesn't exist, we fall back to memory
  memoryDb = [...DEFAULT_SEED_BHAJANS];
  
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to local filesystem (likely running on Vercel). Using memory fallback.');
  }

  return memoryDb;
}

export const bhajansFallbackDb = {
  getAll(): any[] {
    return ensureInitialized();
  },

  getById(id: string): any | null {
    const list = ensureInitialized();
    return list.find(b => b._id === id) || null;
  },

  create(data: any): any {
    const list = ensureInitialized();
    const newBhajan = {
      ...data,
      _id: `bhajan_${Date.now()}`,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    };
    list.push(newBhajan);
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write to local filesystem on Vercel.');
    }
    return newBhajan;
  },

  update(id: string, data: any): any | null {
    const list = ensureInitialized();
    const index = list.findIndex(b => b._id === id);
    if (index === -1) return null;

    const updated = {
      ...list[index],
      ...data,
    };
    list[index] = updated;
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write to local filesystem on Vercel.');
    }
    return updated;
  },

  delete(id: string): boolean {
    const list = ensureInitialized();
    const filtered = list.filter(b => b._id !== id);
    if (list.length === filtered.length) return false;
    memoryDb = filtered;
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write to local filesystem on Vercel.');
    }
    return true;
  }
};
