import React from 'react';
import Image from 'next/image';

export default function InitiationPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-40 bg-[url('/images/lotus-pattern.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Spiritual Initiation</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow-md">
            The sacred vow of dedication to the spiritual master and Sri Krishna.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="lead text-2xl text-iskcon-orange font-medium mb-8 text-center">
              &quot;To receive initiation means to agree to execute the order of the spiritual master.&quot;
              <br/>
              <span className="text-sm text-gray-500">— Srila Prabhupada</span>
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-iskcon-orange pb-2 inline-block">What is Diksha (Initiation)?</h2>
            <p className="mb-6">
              In the Gaudiya Vaishnava tradition, spiritual initiation, or <strong>Diksha</strong>, is a formal ceremony where a devotee takes sacred vows under the guidance of a bona fide spiritual master (Guru). It marks the beginning of a committed spiritual life, dedicated to the service of Lord Krishna.
            </p>

            <div className="bg-orange-50 border-l-4 border-iskcon-orange p-6 rounded-r-lg mb-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Four Regulative Principles</h3>
              <p className="mb-4">Before taking initiation, a devotee must strictly follow four regulative principles for at least one year:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-800 font-medium">
                <li>No meat-eating (including fish and eggs)</li>
                <li>No illicit sex</li>
                <li>No intoxication (including alcohol, caffeine, and tobacco)</li>
                <li>No gambling</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-iskcon-orange pb-2 inline-block">Chanting the Holy Name</h2>
            <p className="mb-6">
              Alongside the regulative principles, an aspiring initiate commits to chanting a minimum of <strong>16 rounds</strong> of the Hare Krishna maha-mantra daily on japa beads:
            </p>
            <blockquote className="bg-gray-50 italic p-6 rounded-lg text-center text-xl font-medium text-gray-800 shadow-inner mb-8">
              Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare<br/>
              Hare Rama, Hare Rama, Rama Rama, Hare Hare
            </blockquote>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-iskcon-orange pb-2 inline-block">The Process of Initiation</h2>
            <p className="mb-4">
              Taking initiation is a serious lifetime commitment. If you are interested in preparing for initiation:
            </p>
            <ol className="list-decimal pl-5 space-y-4 mb-8">
              <li><strong>Take Shelter:</strong> Begin by accepting the shelter of a spiritual master within ISKCON.</li>
              <li><strong>Practice:</strong> Follow the four regulative principles and chant 16 rounds daily for a minimum of one year.</li>
              <li><strong>Education:</strong> Complete the ISKCON Disciples Course (IDC), which provides essential training on guru-tattva and the duties of an initiated disciple.</li>
              <li><strong>Recommendation:</strong> Receive a formal recommendation from your local temple president or authority.</li>
            </ol>

            <div className="text-center mt-12 bg-gray-900 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Ready to take the next step?</h3>
              <p className="mb-6 text-gray-300">Contact our temple authorities to learn more about the initiation process and the ISKCON Disciples Course.</p>
              <a href="/about/contact" className="inline-block bg-iskcon-orange text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
