import Link from 'next/link';

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 pt-24">
        {children}
      </main>
    </div>
  );
}
