import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/db';
import User from '@/models/user.model';
import { usersFallbackDb } from '@/utils/usersFallbackDb';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';

export async function GET(request: NextRequest) {
    try {
        verifyAdmin(request);
        try {
            await dbConnect();
            const list = await User.find({}, '-password').sort({ createdAt: -1 });
            return apiSuccess(list);
        } catch (dbErr) {
            console.warn('Database offline, serving users from fallback JSON database:', dbErr);
            const list = usersFallbackDb.getAll().map(({ password, ...u }) => u).sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            return apiSuccess(list);
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        verifyAdmin(request);
        const body = await request.json();
        const { username, password, role, email } = body;

        if (!username || !password || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            await dbConnect();
            
            const existing = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
            if (existing) {
                return NextResponse.json({ message: 'Username is already taken' }, { status: 400 });
            }

            const newUser = await User.create({
                username,
                password: hashedPassword,
                role,
                email: email || '',
                twoFactorEnabled: false
            });

            // Mirror to fallback DB
            usersFallbackDb.create({
                _id: newUser._id.toString(),
                id: newUser._id.toString(),
                username,
                password: hashedPassword,
                role,
                email: email || '',
                twoFactorEnabled: false,
                createdAt: newUser.createdAt.toISOString(),
                updatedAt: newUser.updatedAt.toISOString()
            });

            const { password: _, ...userWithoutPass } = newUser.toJSON();
            return apiSuccess(userWithoutPass, 'User created successfully');
        } catch (dbErr) {
            console.warn('Database offline, creating user in fallback JSON database:', dbErr);
            const existing = usersFallbackDb.getByUsername(username);
            if (existing) {
                return NextResponse.json({ message: 'Username is already taken' }, { status: 400 });
            }

            const newUser = usersFallbackDb.create({
                username,
                password: hashedPassword,
                role,
                email: email || '',
                twoFactorEnabled: false
            });

            const { password: _, ...userWithoutPass } = newUser;
            return apiSuccess(userWithoutPass, 'User created successfully in fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(request: NextRequest) {
    try {
        verifyAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
        }

        const body = await request.json();
        const { username, password, role, email } = body;

        let hashedPassword = undefined;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        try {
            await dbConnect();
            
            if (username) {
                const existing = await User.findOne({ 
                    username: { $regex: new RegExp(`^${username}$`, 'i') },
                    _id: { $ne: id }
                });
                if (existing) {
                    return NextResponse.json({ message: 'Username is already taken' }, { status: 400 });
                }
            }

            const updateData: any = {};
            if (username) updateData.username = username;
            if (hashedPassword) updateData.password = hashedPassword;
            if (role) updateData.role = role;
            if (email !== undefined) updateData.email = email;

            const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
            if (!updated) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }

            usersFallbackDb.update(id, updateData);

            const { password: _, ...userWithoutPass } = updated.toJSON();
            return apiSuccess(userWithoutPass, 'User updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, updating user in fallback JSON database:', dbErr);
            
            if (username) {
                const existing = usersFallbackDb.getByUsername(username);
                if (existing && existing._id !== id && existing.id !== id) {
                    return NextResponse.json({ message: 'Username is already taken' }, { status: 400 });
                }
            }

            const updateData: any = {};
            if (username) updateData.username = username;
            if (hashedPassword) updateData.password = hashedPassword;
            if (role) updateData.role = role;
            if (email !== undefined) updateData.email = email;

            const updated = usersFallbackDb.update(id, updateData);
            if (!updated) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }

            const { password: _, ...userWithoutPass } = updated;
            return apiSuccess(userWithoutPass, 'User updated successfully in fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const verified = verifyAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
        }

        if (id === verified.userId) {
            return NextResponse.json({ message: 'You cannot delete your own admin account' }, { status: 400 });
        }

        if (id === 'local_admin_id') {
            return NextResponse.json({ message: 'The primary system admin account cannot be deleted' }, { status: 400 });
        }

        try {
            await dbConnect();
            const deleted = await User.findByIdAndDelete(id);
            if (!deleted) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }
            usersFallbackDb.delete(id);
            return apiSuccess(deleted, 'User account deleted successfully');
        } catch (dbErr) {
            console.warn('Database offline, deleting user in fallback JSON database:', dbErr);
            const deleted = usersFallbackDb.delete(id);
            if (!deleted) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }
            return apiSuccess({ id }, 'User account deleted successfully from fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
