// Custom 404 page for Next.js App Router
export default function NotFound() {
  // Get the current path from the browser (client-side only)
  let path = '';
  if (typeof window !== 'undefined') {
    path = window.location.pathname;
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-8">
      <h1 className="text-5xl font-bold text-iskcon-orange mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Chant Hare Krishna & Be Happy</h2>
      <p className="mb-6 text-gray-600">
        The page <span className="font-mono text-iskcon-orange">{path}</span> you&apos;re looking for is not available.
        Take this opportunity to chant the holy names:
      </p>
      <div className="mb-6 text-iskcon-orange font-semibold">
        Hare Krishna Hare Krishna, Krishna Krishna Hare Hare
        <br />
        Hare Rama Hare Rama, Rama Rama Hare Hare
      </div>
      <a href="/" className="inline-block px-6 py-2 bg-iskcon-orange text-white rounded hover:bg-orange-700 transition">Go to Home</a>
    </div>
  );
}
