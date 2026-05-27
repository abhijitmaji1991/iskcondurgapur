const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*MONGODB_URI\s*=\s*(.+)$/);
    if (match) {
      process.env.MONGODB_URI = match[1].trim().replace(/['"]/g, '');
      break;
    }
  }
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is not defined.');
  console.log('Please set MONGODB_URI in your .env.local file or shell environments.');
  process.exit(1);
}

// Map files to their target collections
const datasets = [
  { file: 'lectures_fallback.json', collection: 'lectures' },
  { file: 'events_fallback.json', collection: 'events' },
  { file: 'bhajans_fallback.json', collection: 'bhajans' },
  { file: 'temples_fallback.json', collection: 'temples' },
  { file: 'resources_fallback.json', collection: 'resources' },
  { file: 'settings_fallback.json', collection: 'settings' },
  { file: 'users_fallback.json', collection: 'users' },
  { file: 'tours_fallback.json', collection: 'tours' }
];

async function seedDatabase() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db(); // Uses the database name from connection string

    for (const dataset of datasets) {
      const filePath = path.join(__dirname, '..', 'src', 'data', dataset.file);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`Warning: Dataset file not found at ${filePath}, skipping...`);
        continue;
      }

      console.log(`Reading ${dataset.file}...`);
      const rawData = fs.readFileSync(filePath, 'utf8');
      let items = JSON.parse(rawData);

      if (!Array.isArray(items)) {
        items = [items];
      }

      if (items.length === 0) {
        console.log(`Collection ${dataset.collection} is empty in JSON file, skipping...`);
        continue;
      }

      // Convert date string fields to Date objects and clean _id for MongoDB insert
      const formattedItems = items.map(item => {
        const cleaned = { ...item };
        
        // If it's a seed item with string _id, convert it to a format or let MongoDB generate it,
        // but to keep references, we preserve _id as string or convert if necessary.
        // Mongoose handles string _ids perfectly fine if model schema allows, or we can keep it as string.
        
        // Date conversions
        if (cleaned.createdAt) cleaned.createdAt = new Date(cleaned.createdAt);
        if (cleaned.updatedAt) cleaned.updatedAt = new Date(cleaned.updatedAt);
        if (cleaned.date && !isNaN(Date.parse(cleaned.date))) {
          cleaned.date = new Date(cleaned.date);
        }
        if (cleaned.lastLogin) cleaned.lastLogin = new Date(cleaned.lastLogin);
        
        return cleaned;
      });

      console.log(`Seeding ${formattedItems.length} items into collection: "${dataset.collection}"...`);
      
      const col = db.collection(dataset.collection);
      
      // Clean collection first to prevent duplication, or insert if empty
      const existingCount = await col.countDocuments();
      if (existingCount > 0) {
        console.log(`Collection "${dataset.collection}" already has ${existingCount} documents. Clearing existing records to prevent duplicates...`);
        await col.deleteMany({});
      }

      const result = await col.insertMany(formattedItems);
      console.log(`Successfully inserted ${result.insertedCount} documents into "${dataset.collection}".`);
    }

    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
