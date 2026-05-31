const fs = require('fs');
let code = fs.readFileSync('src/app/prabhupada/lectures/LecturesClient.tsx', 'utf8');

// 1. Overall Background (from dark mode back to clean white)
code = code.replace(/bg-\[#0a0a0a\] text-stone-300/g, 'bg-[#fcfbf9] text-gray-900 font-serif');

// 2. Visual Sunburst Header (Convert to Vedabase Golden Header)
code = code.replace(/bg-gradient-to-br from-orange-950 via-amber-900 to-\[#4a1805\] text-white py-12 px-6 sm:px-12 shadow-2xl border border-orange-900\/30/g, 'bg-[#f0c242] text-amber-950 py-10 px-6 sm:px-12 shadow-sm border border-[#e0b020] rounded-sm');
code = code.replace(/text-gradient bg-gradient-to-r from-amber-200 via-orange-100 to-amber-200 bg-clip-text text-transparent/g, 'text-amber-950');
code = code.replace(/bg-amber-500\/20 border border-amber-500\/35 rounded-full text-xs font-bold text-amber-300/g, 'bg-amber-900/10 border border-amber-900/20 rounded-full text-xs font-bold text-amber-900');
code = code.replace(/<div className="absolute top-0 right-0 w-80 h-80 bg-orange-600\/10 rounded-full blur-3xl -z-0"><\/div>/g, '');
code = code.replace(/bg-white\/5 backdrop-blur-md border border-white\/10/g, 'bg-white border border-amber-500/20');
code = code.replace(/text-amber-300/g, 'text-amber-950');
code = code.replace(/text-amber-100\/80/g, 'text-amber-900/80');

// 3. Sidebars & Filters (Remove Glassmorphism, make it stark flat design)
code = code.replace(/bg-white\/5 backdrop-blur-xl rounded-2xl p-5 border border-white\/10/g, 'bg-white rounded-none p-5 shadow-sm border border-gray-200');
code = code.replace(/bg-white\/5 backdrop-blur-xl p-4 rounded-2xl border border-white\/10/g, 'bg-white p-4 rounded-none shadow-sm border border-gray-200');
code = code.replace(/text-amber-400/g, 'text-amber-700');
code = code.replace(/text-stone-400 hover:bg-white\/10/g, 'text-gray-700 hover:bg-gray-100');
code = code.replace(/bg-white\/10 text-stone-400 group-hover:bg-amber-500\/20 group-hover:text-amber-300/g, 'bg-gray-100 text-gray-600 group-hover:bg-[#f0c242] group-hover:text-amber-950');

// 4. Inputs
code = code.replace(/bg-black\/40 border border-white\/10 hover:border-amber-500\/50 focus:border-amber-500 text-white/g, 'bg-white border border-gray-300 hover:border-[#f0c242] focus:border-[#f0c242] text-gray-900');
code = code.replace(/bg-black\/40 border border-white\/10 text-white/g, 'bg-white border border-gray-300 text-gray-900');
code = code.replace(/text-stone-200 outline-none/g, 'text-gray-900 outline-none');

// 5. Lecture List Cards
code = code.replace(/bg-white\/5 backdrop-blur-md rounded-2xl border/g, 'bg-white rounded-none border-b');
code = code.replace(/border-white\/5 hover:border-amber-500\/50 hover:bg-white\/10 hover:shadow-\[0_0_20px_rgba\(245,158,11,0\.1\)\]/g, 'border-gray-200 hover:bg-gray-50');
code = code.replace(/border-amber-500 bg-white\/10 shadow-\[0_0_30px_rgba\(245,158,11,0\.15\)\] ring-1 ring-amber-500\/50/g, 'border-l-4 border-l-[#f0c242] border-y border-y-gray-200 bg-[#fdfcf7]');
code = code.replace(/text-stone-100/g, 'text-gray-900');
code = code.replace(/bg-amber-500\/20 text-amber-300 border border-amber-500\/30/g, 'bg-amber-50 text-amber-800 border border-amber-200');
code = code.replace(/bg-white\/10 text-stone-300 border border-white\/10/g, 'bg-gray-100 text-gray-700 border border-gray-200');
code = code.replace(/bg-amber-900\/30 text-amber-200 border border-amber-500\/30/g, 'bg-[#fdfcf7] text-amber-900 border border-[#f0c242]/50 italic');

// 6. Expanded Area (Vedabase minimal style)
code = code.replace(/bg-black\/40 backdrop-blur-2xl/g, 'bg-[#fdfcf7]');
code = code.replace(/bg-white\/5/g, 'bg-white');
code = code.replace(/border-white\/10/g, 'border-gray-200');
code = code.replace(/text-stone-400/g, 'text-gray-500');
code = code.replace(/text-stone-300/g, 'text-gray-800');
code = code.replace(/bg-white\/20/g, 'bg-gray-200');

// Transcript Tabs & Reader
code = code.replace(/bg-black\/50 rounded-xl p-1\.5 border border-white\/5/g, 'bg-gray-100 rounded-none p-1 border border-gray-200');
code = code.replace(/bg-white\/10 text-white shadow-lg border border-white\/20/g, 'bg-white text-gray-900 shadow-sm border border-gray-300');

// Highlights
code = code.replace(/bg-amber-500\/40 text-amber-100/g, 'bg-[#f0c242]/40 text-amber-900');

fs.writeFileSync('src/app/prabhupada/lectures/LecturesClient.tsx', code);
console.log('Vedabase style replacements done (safe mode)!');
