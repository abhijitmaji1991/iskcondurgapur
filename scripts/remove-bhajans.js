const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
let MONGODB_URI = '';
for (const line of envFile.split('\n')) {
    if (line.startsWith('MONGODB_URI=')) {
        MONGODB_URI = line.replace('MONGODB_URI=', '').replace(/['"]/g, '').trim();
    }
}

const mongoose = require('mongoose');

async function run() {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not found in .env.local');
        }
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to database...');
        
        const db = mongoose.connection.db;
        const result = await db.collection('bhajans').deleteMany({});
        
        console.log(`Successfully removed ${result.deletedCount} bhajans.`);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
