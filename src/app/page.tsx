// Server Component — no 'use client' directive
// The animation-heavy HeroContent is lazy-loaded as a separate client chunk
// so Framer Motion / react-icons do NOT block the initial HTML paint.
import dynamic from 'next/dynamic';

const HeroContent = dynamic(() => import('@/components/HeroContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  return <HeroContent />;
}