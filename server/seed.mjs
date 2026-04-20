import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iskcon_website';

async function seedAdmin() {
    try {
        const { default: mongoose } = await import('mongoose');
        const { default: bcrypt } = await import('bcrypt');
        const { default: User } = await import('../src/models/user.model.ts');

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('iskcon123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin',
            twoFactorEnabled: false
        });

        console.log('Admin user seeded successfully (Default: admin/iskcon123)');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedAdmin();
