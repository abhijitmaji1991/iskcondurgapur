export default function Loading() {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-purple-900 text-lg">Loading lectures...</p>
      </div>
    </div>
  );
} 