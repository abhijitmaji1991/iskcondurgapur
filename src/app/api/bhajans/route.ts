import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Bhajan from '@/models/bhajan.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';
import { bhajansFallbackDb } from '@/utils/bhajansFallbackDb';

// ─── Module-level cache ──────────────────────────────────────────────────
const CACHE_TTL_MS = 60_000; // 60 seconds
let cachedBhajans: any[] | null = null;
let cacheExpiresAt = 0;

// Helper to invalidate cache after write operations
function invalidateBhajanCache() {
    cachedBhajans = null;
    cacheExpiresAt = 0;
}

const SEED_BHAJANS = [
  {
    title: 'Jaya Radha Madhava',
    author: 'Srila Bhaktivinoda Thakura',
    preview: 'jaya rādhā-mādhava kuñja-bihārī...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
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
          '(२) यशोदा-नन्दन व्रज-जन-रञ्जन',
          'यामुना-तीर-वन-चारी'
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
    title: 'Sri Damodarashtakam',
    author: 'Satyavrata Muni',
    preview: 'namāmīśvaraṁ sac-cid-ānanda-rūpaṁ...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    lyrics: [
      {
        devanagari: [
          '(१) नमामीश्वरं सच्चिदानन्दरूपं',
          'लसत्कुण्डलं गोकुले भ्राजमानम्',
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
  },
  {
    title: 'Sri Gurvastakam',
    author: 'Srila Visvanatha Cakravarti Thakura',
    preview: 'saṁsāra-dāvānal-līḍha-loka...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    lyrics: [
      {
        devanagari: [
          '(१) संसारदावानललीढलोक-',
          'त्राणाय कारुण्यघनाघनत्वम्',
          'प्राप्तस्य कल्याणगुणार्णवस्य',
          'वन्दे गुरोः श्रीचरणारविन्दम्'
        ],
        roman: [
          '(1) saṁsāra-dāvānala-līḍha-loka-',
          'trāṇāya kāruṇya-ghanāghanatvam',
          'prāptasya kalyāṇa-guṇārṇavasya',
          'vande guroḥ śrī-cara-ṇāravindam'
        ],
        translation: [
          'The spiritual master is receiving benediction from the ocean of mercy. Just as a cloud pours rain on a forest fire to extinguish it, so the spiritual master delivers the materially afflicted world by extinguishing the blazing fire of material existence. I offer my respectful obeisances unto the lotus feet of such a spiritual master, who is an ocean of auspicious qualities.'
        ]
      },
      {
        devanagari: [
          '(२) महाप्रभोः कीर्तननृत्यगीत-',
          'वादित्रमाद्यन्मनसो रसेन',
          'रोमाञ्चकम्पाश्रुतरङ्गभाजो',
          'वन्दे गुरोः श्रीचरणारविन्दम्'
        ],
        roman: [
          '(2) mahāprabhoḥ kīrtana-nṛtya-gīta-',
          'vāditra-mādyan-manaso rasena',
          'romāñca-kampāśru-taraṅga-bhājo',
          'vande guroḥ śrī-cara-ṇāravindam'
        ],
        translation: [
          'Chanting the holy name, dancing in ecstasy, singing, and playing musical instruments, the spiritual master is always gladdened by the sankirtana movement of Lord Chaitanya Mahaprabhu. Because he is relishing the mellows of pure devotion, he sometimes feels hair standing on end, quivering in the body, and tears flowing from his eyes like waves. I offer my respectful obeisances unto the lotus feet of such a spiritual master.'
        ]
      }
    ]
  },
  {
    title: 'Hari Haraye Namah Krsna',
    author: 'Srila Narottama Dasa Thakura',
    preview: 'hari haraye namaḥ kṛṣṇa yādavāya...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    lyrics: [
      {
        devanagari: [
          '(१) हरि हरये नमः कृष्ण यादवाय नमः',
          'यादवाय माधवाय केशवाय नमः'
        ],
        roman: [
          '(1) hari haraye namaḥ kṛṣṇa yādavāya namaḥ',
          'yādavāya mādhavāya keśavāya namaḥ'
        ],
        translation: [
          'O Lord Hari, O Lord Krishna, I offer my respectful obeisances unto You. You are the descendant of Yadu, the beloved of Radha, and the killer of the Kesi demon.'
        ]
      },
      {
        devanagari: [
          '(२) गोपाल गोविन्द राम श्री-मधुसूदन',
          'गिरिधारी गोपीनाथ मदन-मोहन'
        ],
        roman: [
          '(2) gopāla govinda rāma śrī-madhusūdana',
          'giridhārī gopīnātha madana-mohana'
        ],
        translation: [
          'O protector of cows, Lord of pleasure, Lord Rama, killer of Madhu, lifter of Govardhana Hill, Lord of the Gopis, and the enchanter of Cupid!'
        ]
      }
    ]
  }
];

export async function GET(request: NextRequest) {
    try {
        // Return from cache if fresh
        if (cachedBhajans && Date.now() < cacheExpiresAt) {
            const res = apiSuccess(cachedBhajans);
            return res;
        }

        try {
            await dbConnect();
            let bhajans = await Bhajan.find({}).sort({ title: 1 }).lean(); // .lean() = plain JS objects, ~30% faster

            if (bhajans.length === 0) {
                await Bhajan.insertMany(SEED_BHAJANS);
                bhajans = await Bhajan.find({}).sort({ title: 1 }).lean();
            }

            cachedBhajans = bhajans;
            cacheExpiresAt = Date.now() + CACHE_TTL_MS;
            return apiSuccess(bhajans);
        } catch (dbErr) {
            console.warn('Database offline, serving persistent fallback JSON database:', dbErr);
            const bhajans = bhajansFallbackDb.getAll();
            cachedBhajans = bhajans;
            cacheExpiresAt = Date.now() + CACHE_TTL_MS;
            return apiSuccess(bhajans);
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const authToken = request.cookies.get('iskcon_admin_token')?.value;
        if (!authToken) {
            throw new AppError('Unauthorized', 401);
        }

        try {
            await dbConnect();
            const body = await request.json();
            const bhajan = await Bhajan.create(body);

            // Invalidate the list cache so the new entry appears immediately
            invalidateBhajanCache();

            return apiSuccess(bhajan, 'Bhajan created successfully', 201);
        } catch (dbErr) {
            console.warn('Database offline, saving to persistent fallback JSON database:', dbErr);
            const body = await request.json();
            const bhajan = bhajansFallbackDb.create(body);

            // Invalidate the list cache
            invalidateBhajanCache();

            return apiSuccess(bhajan, 'Bhajan created successfully (Local Storage Mode)', 201);
        }
    } catch (error) {
        return handleApiError(error);
    }
}
