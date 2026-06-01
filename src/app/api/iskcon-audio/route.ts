import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GOOGLE_DRIVE_ROOT_FOLDER_ID = '1BByujLqEQ2Nq_xDJzdP25HWcybSBMP5v';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // path will now represent a Google Drive Folder ID. If empty, use root.
  const path = searchParams.get('path') || GOOGLE_DRIVE_ROOT_FOLDER_ID;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY || process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ success: false, message: 'Google API Key is not configured.' }, { status: 500 });
  }

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${path}'+in+parents+and+trashed=false&fields=files(id,name,mimeType)&key=${apiKey}&pageSize=1000`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Drive: ${response.statusText}`);
    }

    const data = await response.json();
    const items = data.files || [];

    const folders: any[] = [];
    const files: any[] = [];

    for (const item of items) {
      if (item.mimeType === 'application/vnd.google-apps.folder') {
        folders.push({
          path: item.id, // Using folder ID as the path
          name: item.name
        });
      } else if (item.mimeType.startsWith('audio/') || item.mimeType.startsWith('video/')) {
        files.push({
          url: `https://drive.google.com/file/d/${item.id}/preview`,
          name: item.name.replace(/\.[^/.]+$/, "") // Remove file extension for display
        });
      }
    }

    // Sort alphabetically
    folders.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      data: {
        currentPath: path === GOOGLE_DRIVE_ROOT_FOLDER_ID ? '' : path,
        folders,
        files
      }
    });
  } catch (error: any) {
    console.error('Google Drive API Proxy Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch audio directories.' }, { status: 500 });
  }
}
