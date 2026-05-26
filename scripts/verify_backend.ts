import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:3000/api';

// Load JWT_SECRET from .env.local if present
let envSecret = 'your-super-secret-key-change-this-in-production';
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^JWT_SECRET=(.*)$/m);
    if (match && match[1]) {
      envSecret = match[1].trim();
    }
  }
} catch (e) {
  // Ignore
}

const JWT_SECRET = process.env.JWT_SECRET || envSecret;

const generateToken = () => {
    return jwt.sign(
        { sub: 'test_user_id', username: 'test_admin', role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const runVerification = async () => {
    console.log('Starting verification...');
    const token = generateToken();
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        // 1. Test Create Resource
        console.log('\nTesting Create Resource...');
        const newResource = {
            title: 'Test Graph Resource',
            type: 'Book',
            category: 'Philosophy',
            description: 'A test resource for verification',
            author: 'Test Author',
            isPublished: true
        };

        const createRes = await fetch(`${API_URL}/resources`, {
            method: 'POST',
            headers,
            body: JSON.stringify(newResource)
        });
        const createData = await createRes.json();
        console.log('✅ Create Success:', createRes.ok);
        const resourceId = createData.data._id;
        console.log('Created ID:', resourceId);

        // 2. Test Get All
        console.log('\nTesting Get All Resources...');
        const getAllRes = await fetch(`${API_URL}/resources`);
        const getAllData = await getAllRes.json();
        console.log('✅ Get All Success:', getAllRes.ok);
        console.log('Count:', getAllData.data.length);

        // 3. Test Get One
        console.log(`\nTesting Get Resource ${resourceId}...`);
        const getOneRes = await fetch(`${API_URL}/resources/${resourceId}`);
        const getOneData = await getOneRes.json();
        console.log('✅ Get One Success:', getOneRes.ok);
        console.log('Title:', getOneData.data.title);

        // 4. Test Update
        console.log(`\nTesting Update Resource ${resourceId}...`);
        const updateRes = await fetch(`${API_URL}/resources/${resourceId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ title: 'Updated Test Graph Resource' })
        });
        const updateData = await updateRes.json();
        console.log('✅ Update Success:', updateRes.ok);
        console.log('New Title:', updateData.data.title);

        // 5. Test Delete
        console.log(`\nTesting Delete Resource ${resourceId}...`);
        const deleteRes = await fetch(`${API_URL}/resources/${resourceId}`, {
            method: 'DELETE',
            headers
        });
        const deleteData = await deleteRes.json();
        console.log('✅ Delete Success:', deleteRes.ok);

        // Verify Deletion
        const verifyRes = await fetch(`${API_URL}/resources/${resourceId}`);
        if (verifyRes.status === 404) {
            console.log('✅ Verification of Delete Success (404 expected)');
        } else {
            console.log('❌ Unexpected status during delete verification:', verifyRes.status);
        }

    } catch (error: any) {
        console.error('❌ Verification Failed:', error.message);
    }
};

runVerification();
