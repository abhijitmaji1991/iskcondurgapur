import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';

const GALLERY_DIR = path.join(process.cwd(), 'public', 'images', 'gallery');

export async function GET(request: NextRequest) {
    try {
        verifyAdmin(request);
        
        let galleryData: { date: string; images: string[] }[] = [];
        
        if (fs.existsSync(GALLERY_DIR)) {
            const entries = fs.readdirSync(GALLERY_DIR, { withFileTypes: true });
            
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const dateFolder = entry.name;
                    const folderPath = path.join(GALLERY_DIR, dateFolder);
                    const files = fs.readdirSync(folderPath);
                    const images = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
                    
                    if (images.length > 0) {
                        galleryData.push({
                            date: dateFolder,
                            images: images
                        });
                    }
                }
            }
            
            // Sort by date descending
            galleryData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        
        return apiSuccess(galleryData);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        verifyAdmin(request);
        
        const formData = await request.formData();
        const date = formData.get('date') as string;
        const files = formData.getAll('images') as File[];
        
        if (!date || !files || files.length === 0) {
            return new Response(JSON.stringify({ success: false, error: 'Date and images are required' }), { status: 400 });
        }
        
        // Format date string to ensure it's safe for directory name
        const safeDate = date.replace(/[^0-9-]/g, '');
        const targetDir = path.join(GALLERY_DIR, safeDate);
        
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        const uploadedImages = [];
        
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filePath = path.join(targetDir, fileName);
            
            fs.writeFileSync(filePath, buffer);
            uploadedImages.push(fileName);
        }
        
        return apiSuccess({ date: safeDate, images: uploadedImages }, 'Images uploaded successfully', 201);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        verifyAdmin(request);
        
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const image = searchParams.get('image');
        
        if (!date || !image) {
             return new Response(JSON.stringify({ success: false, error: 'Date and image name required' }), { status: 400 });
        }
        
        const safeDate = date.replace(/[^0-9-]/g, '');
        const safeImage = image.replace(/[^a-zA-Z0-9.-_]/g, '');
        
        const imagePath = path.join(GALLERY_DIR, safeDate, safeImage);
        
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            return apiSuccess({}, 'Image deleted successfully');
        } else {
            return new Response(JSON.stringify({ success: false, error: 'Image not found' }), { status: 404 });
        }
    } catch (error) {
        return handleApiError(error);
    }
}
