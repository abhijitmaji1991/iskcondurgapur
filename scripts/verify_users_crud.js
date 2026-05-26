const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:3000/api/admin/users';
const JWT_SECRET = 'your-super-secret-key-change-this-in-production';

const generateToken = (userId = 'local_admin_id', username = 'admin', role = 'admin') => {
    return jwt.sign(
        { sub: userId, id: userId, username, role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const runTests = async () => {
    console.log('--- STARTING USER API CRUD VERIFICATION TESTS ---');
    const adminToken = generateToken();
    const adminHeaders = {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
    };

    let testUserId = null;

    try {
        // 1. Fetch initial user list (should contain primary system admin)
        console.log('\n[1] Fetching administrative users list...');
        const listRes = await fetch(API_URL, { headers: adminHeaders });
        const listData = await listRes.json();
        console.log('Status:', listRes.status);
        console.log('Users found:', listData.data ? listData.data.map(u => `${u.username} (${u.role})`) : []);
        
        if (!listRes.ok) throw new Error(`List failed: ${listData.message}`);

        // 2. Add new user account
        console.log('\n[2] Creating new user: bhakta_ram (Role: devotee)...');
        const newUserPayload = {
            username: 'bhakta_ram',
            password: 'RamPassword123',
            email: 'ram@iskcondurgapur.com',
            role: 'devotee'
        };
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: adminHeaders,
            body: JSON.stringify(newUserPayload)
        });
        const createData = await createRes.json();
        console.log('Status:', createRes.status);
        console.log('Response Message:', createData.message);
        console.log('Created User:', createData.data ? { username: createData.data.username, role: createData.data.role, email: createData.data.email, id: createData.data.id || createData.data._id } : null);

        if (!createRes.ok) throw new Error(`Create failed: ${createData.message}`);
        testUserId = createData.data.id || createData.data._id;

        // 3. Verify user duplication protection
        console.log('\n[3] Testing duplicate username rejection...');
        const dupRes = await fetch(API_URL, {
            method: 'POST',
            headers: adminHeaders,
            body: JSON.stringify(newUserPayload)
        });
        const dupData = await dupRes.json();
        console.log('Status:', dupRes.status);
        console.log('Response Message (Expected error):', dupData.message);
        if (dupRes.status === 400) {
            console.log('✅ Correctly rejected duplicate user.');
        } else {
            console.log('❌ Unexpected duplicate success status:', dupRes.status);
        }

        // 4. Update the user role to admin and change email
        console.log(`\n[4] Updating user ${testUserId} role to admin and changing email...`);
        const updatePayload = {
            username: 'bhakta_ram',
            email: 'ram.updated@iskcondurgapur.com',
            role: 'admin'
        };
        const updateRes = await fetch(`${API_URL}?id=${testUserId}`, {
            method: 'PUT',
            headers: adminHeaders,
            body: JSON.stringify(updatePayload)
        });
        const updateData = await updateRes.json();
        console.log('Status:', updateRes.status);
        console.log('Updated User Role:', updateData.data ? updateData.data.role : null);
        console.log('Updated User Email:', updateData.data ? updateData.data.email : null);
        if (!updateRes.ok) throw new Error(`Update failed: ${updateData.message}`);

        // 5. Test constraint: Self-deletion prevention
        console.log('\n[5] Testing self-deletion protection...');
        // Let's generate a token specifically for bhakta_ram
        const ramToken = generateToken(testUserId, 'bhakta_ram', 'admin');
        const selfDeleteRes = await fetch(`${API_URL}?id=${testUserId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${ramToken}`,
                'Content-Type': 'application/json'
            }
        });
        const selfDeleteData = await selfDeleteRes.json();
        console.log('Status:', selfDeleteRes.status);
        console.log('Response Message (Expected self-delete block):', selfDeleteData.message);
        if (selfDeleteRes.status === 400) {
            console.log('✅ Correctly blocked self-deletion.');
        } else {
            console.log('❌ Self-deletion was not blocked. Status:', selfDeleteRes.status);
        }

        // 6. Test constraint: Primary system admin deletion prevention
        console.log('\n[6] Testing primary admin deletion protection...');
        const primaryDeleteRes = await fetch(`${API_URL}?id=local_admin_id`, {
            method: 'DELETE',
            headers: adminHeaders
        });
        const primaryDeleteData = await primaryDeleteRes.json();
        console.log('Status:', primaryDeleteRes.status);
        console.log('Response Message (Expected primary delete block):', primaryDeleteData.message);
        if (primaryDeleteRes.status === 400) {
            console.log('✅ Correctly blocked primary admin deletion.');
        } else {
            console.log('❌ Primary admin deletion was not blocked. Status:', primaryDeleteRes.status);
        }

        // 7. Successful deletion of test user
        console.log(`\n[7] Deleting test user ${testUserId} using primary admin...`);
        const deleteRes = await fetch(`${API_URL}?id=${testUserId}`, {
            method: 'DELETE',
            headers: adminHeaders
        });
        const deleteData = await deleteRes.json();
        console.log('Status:', deleteRes.status);
        console.log('Response Message:', deleteData.message);
        if (!deleteRes.ok) throw new Error(`Delete failed: ${deleteData.message}`);

        // 8. Verify deletion by checking list again
        console.log('\n[8] Fetching administrative users list to confirm deletion...');
        const finalRes = await fetch(API_URL, { headers: adminHeaders });
        const finalData = await finalRes.json();
        const found = finalData.data ? finalData.data.some(u => u.username === 'bhakta_ram') : false;
        console.log('Users found:', finalData.data ? finalData.data.map(u => `${u.username} (${u.role})`) : []);
        if (!found) {
            console.log('✅ Verification completed successfully. Test user was fully cleaned up!');
        } else {
            console.log('❌ Test user still exists in final user list.');
        }

    } catch (err) {
        console.error('\n❌ Test execution encountered an error:', err.message);
        process.exit(1);
    }
};

runTests();
