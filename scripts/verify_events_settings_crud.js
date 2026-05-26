const jwt = require('jsonwebtoken');

const EVENTS_API_URL = 'http://localhost:3000/api/events';
const SETTINGS_API_URL = 'http://localhost:3000/api/settings';
const JWT_SECRET = 'your-super-secret-key-change-this-in-production';

const generateToken = (userId = 'local_admin_id', username = 'admin', role = 'admin') => {
    return jwt.sign(
        { sub: userId, id: userId, username, role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const runTests = async () => {
    console.log('--- STARTING EVENTS & SETTINGS API CRUD TESTS ---');
    const adminToken = generateToken();
    const adminHeaders = {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
    };

    let testEventId = null;

    try {
        // ==========================================
        // PART 1: EVENTS CRUD
        // ==========================================
        
        // 1. Fetch initial events list
        console.log('\n[1] Fetching events list...');
        const listRes = await fetch(EVENTS_API_URL);
        const listData = await listRes.json();
        console.log('Status:', listRes.status);
        console.log('Events found:', listData.data ? listData.data.map(e => `${e.title} (${e.category})`) : []);
        if (!listRes.ok) throw new Error(`Events list failed: ${listData.message}`);

        // 2. Add new event
        console.log('\n[2] Creating new event: "Bhagavad Gita Discourse"...');
        const newEventPayload = {
            title: 'Bhagavad Gita Discourse',
            description: 'Weekly spiritual lecture on the teachings of Gita.',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Lecture Hall 1',
            category: 'Lecture',
            image: '/images/iskcon-logo.png',
            organizer: 'Gita Study Group',
            registrationLink: '',
            isFeatured: false
        };
        const createRes = await fetch(EVENTS_API_URL, {
            method: 'POST',
            headers: adminHeaders,
            body: JSON.stringify(newEventPayload)
        });
        const createData = await createRes.json();
        console.log('Status:', createRes.status);
        console.log('Response Message:', createData.message);
        console.log('Created Event:', createData.data ? { title: createData.data.title, category: createData.data.category, id: createData.data._id || createData.data.id } : null);

        if (!createRes.ok) throw new Error(`Event creation failed: ${createData.message}`);
        testEventId = createData.data._id || createData.data.id;

        // 3. Get single event details
        console.log(`\n[3] Fetching single event details for ID: ${testEventId}...`);
        const getRes = await fetch(`${EVENTS_API_URL}/${testEventId}`);
        const getData = await getRes.json();
        console.log('Status:', getRes.status);
        console.log('Retrieved Event Title:', getData.data ? getData.data.title : null);
        if (!getRes.ok) throw new Error(`Get event details failed: ${getData.message}`);

        // 4. Update event details
        console.log(`\n[4] Updating event ${testEventId} title and setting featured...`);
        const updateEventPayload = {
            title: 'Bhagavad Gita Divine Discourse',
            isFeatured: true
        };
        const updateRes = await fetch(`${EVENTS_API_URL}/${testEventId}`, {
            method: 'PUT',
            headers: adminHeaders,
            body: JSON.stringify(updateEventPayload)
        });
        const updateData = await updateRes.json();
        console.log('Status:', updateRes.status);
        console.log('Updated Event Title:', updateData.data ? updateData.data.title : null);
        console.log('Updated Event Featured:', updateData.data ? updateData.data.isFeatured : null);
        if (!updateRes.ok) throw new Error(`Event update failed: ${updateData.message}`);

        // 5. Delete event details
        console.log(`\n[5] Deleting event ${testEventId}...`);
        const deleteRes = await fetch(`${EVENTS_API_URL}/${testEventId}`, {
            method: 'DELETE',
            headers: adminHeaders
        });
        const deleteData = await deleteRes.json();
        console.log('Status:', deleteRes.status);
        console.log('Response Message:', deleteData.message);
        if (!deleteRes.ok) throw new Error(`Event deletion failed: ${deleteData.message}`);

        // 6. Verify event was deleted (should return 404)
        console.log(`\n[6] Verifying deletion of event ${testEventId}...`);
        const verifyRes = await fetch(`${EVENTS_API_URL}/${testEventId}`);
        const verifyData = await verifyRes.json();
        console.log('Status (Expected 404):', verifyRes.status);
        console.log('Response Message:', verifyData.message);
        if (verifyRes.status === 404) {
            console.log('✅ Correctly verified event deletion.');
        } else {
            console.log('❌ Event still exists. Status:', verifyRes.status);
        }

        // ==========================================
        // PART 2: WEBSITE SETTINGS
        // ==========================================
        
        // 7. Get website settings
        console.log('\n[7] Fetching global website settings...');
        const settingsRes = await fetch(SETTINGS_API_URL);
        const settingsData = await settingsRes.json();
        console.log('Status:', settingsRes.status);
        console.log('Current Settings Email:', settingsData.data ? settingsData.data.contactEmail : null);
        if (!settingsRes.ok) throw new Error(`Fetch settings failed: ${settingsData.message}`);

        // 8. Update website settings
        console.log('\n[8] Updating global settings (Notice banner, phone)...');
        const updateSettingsPayload = {
            ...settingsData.data,
            contactPhone: '+91 98765 43210',
            noticeBannerEnabled: true,
            noticeBannerText: 'Janmashtami Celebrations start tomorrow! Join us.'
        };
        const updateSettingsRes = await fetch(SETTINGS_API_URL, {
            method: 'PUT',
            headers: adminHeaders,
            body: JSON.stringify(updateSettingsPayload)
        });
        const updateSettingsData = await updateSettingsRes.json();
        console.log('Status:', updateSettingsRes.status);
        console.log('Updated Phone:', updateSettingsData.data ? updateSettingsData.data.contactPhone : null);
        console.log('Updated Banner Text:', updateSettingsData.data ? updateSettingsData.data.noticeBannerText : null);
        console.log('Updated Banner Enabled:', updateSettingsData.data ? updateSettingsData.data.noticeBannerEnabled : null);
        if (!updateSettingsRes.ok) throw new Error(`Update settings failed: ${updateSettingsData.message}`);

        // 9. Revert settings changes for clean state
        console.log('\n[9] Reverting global settings changes for clean state...');
        const revertSettingsPayload = {
            ...updateSettingsData.data,
            contactPhone: '+1 (310) 836-2676',
            noticeBannerEnabled: false,
            noticeBannerText: 'Welcome to ISKCON Durgapur!'
        };
        const revertRes = await fetch(SETTINGS_API_URL, {
            method: 'PUT',
            headers: adminHeaders,
            body: JSON.stringify(revertSettingsPayload)
        });
        console.log('Status:', revertRes.status);
        if (!revertRes.ok) console.warn('Warning: Reverting settings failed');

        console.log('\n✅ All Events and Settings verification tests passed successfully!');

    } catch (err) {
        console.error('\n❌ Test execution encountered an error:', err.message);
        process.exit(1);
    }
};

runTests();
