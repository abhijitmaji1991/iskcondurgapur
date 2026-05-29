import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';

  try {
    const url = `https://audio.iskcondesiretree.com/index.php?q=f&f=${encodeURIComponent(path)}`;
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ISKCON-App' }, 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from external site: ${response.statusText}`);
    }

    const html = await response.text();

    // Parse folders
    // Example: <a href=index.php?q=f&f=/01_-_Srila_Prabhupada><font ...><b>01_-_Srila_Prabhupada</b></font></a>
    // We'll use a robust regex to catch different variations.
    const folderRegex = /href=["']?index\.php\?q=f&f=([^"'>\s]+)["']?.*?>\s*<font[^>]*>\s*<b>([^<]+)<\/b>/gi;
    const folders: any[] = [];
    const addedFolders = new Set();
    let folderMatch;
    
    while ((folderMatch = folderRegex.exec(html)) !== null) {
      const folderPath = decodeURIComponent(folderMatch[1].replace(/&amp;/g, '&'));
      if (folderPath && folderPath !== '/' && !addedFolders.has(folderPath)) {
        addedFolders.add(folderPath);
        folders.push({
          path: folderPath,
          name: decodeURIComponent(folderMatch[2].replace(/&amp;/g, '&')).replace(/_/g, ' ')
        });
      }
    }

    // Parse audio files
    // Look for hrefs that end in .mp3
    const fileRegex = /href=["']?([^"'>]+\.mp3)["']?/gi;
    const files: any[] = [];
    const addedUrls = new Set();
    let fileMatch;
    
    while ((fileMatch = fileRegex.exec(html)) !== null) {
      let fileUrl = fileMatch[1];
      
      // Ensure it's an absolute URL pointing to their server
      if (!fileUrl.startsWith('http')) {
        fileUrl = `https://audio.iskcondesiretree.com${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
      }
      
      if (!addedUrls.has(fileUrl)) {
        addedUrls.add(fileUrl);
        // Extract filename
        const parts = fileUrl.split('/');
        let rawName = parts[parts.length - 1];
        rawName = decodeURIComponent(rawName).replace(/\.mp3$/i, '').replace(/_/g, ' ');
        
        files.push({
          url: fileUrl,
          name: rawName
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        currentPath: path,
        folders,
        files
      }
    });
  } catch (error: any) {
    console.error('ISKCON Audio Proxy Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch audio directories.' }, { status: 500 });
  }
}
