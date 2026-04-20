'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaHandHoldingHeart, FaRegQuestionCircle, FaShieldAlt, FaRegCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { recordDonation } from '@/lib/api';

interface DonationOption {
  id: string;
  name: string;
  description: string;
  amounts: number[];
  image: string;
}

const donationOptions: DonationOption[] = [
  {
    id: 'temple',
    name: 'Temple Development',
    description: 'Support the construction, maintenance, and beautification of ISKCON temples worldwide.',
    amounts: [501, 1001, 2001, 5001, 10001, 21001],
    image: '/images/donations/temple-donation.jpg'
  },
  {
    id: 'food',
    name: 'Food For Life',
    description: 'Help provide prasadam (sanctified vegetarian food) to those in need around the world.',
    amounts: [251, 501, 1001, 2501, 5001, 10001],
    image: '/images/donations/food-donation.jpg'
  },
  {
    id: 'education',
    name: 'Vedic Education',
    description: 'Support Vedic educational programs, schools, and scholarships for students.',
    amounts: [501, 1001, 2001, 5001, 10001, 21001],
    image: '/images/donations/education-donation.jpg'
  },
  {
    id: 'books',
    name: 'Book Distribution',
    description: "Help distribute Srila Prabhupada's books containing timeless Vedic wisdom worldwide.",
    amounts: [251, 501, 1001, 2501, 5001, 10001],
    image: '/images/donations/book-donation.jpg'
  },
  {
    id: 'cow',
    name: 'Cow Protection',
    description: 'Support our cow protection programs that care for cows throughout their natural lives.',
    amounts: [1001, 2001, 5001, 11000, 21001, 51001],
    image: '/images/donations/cow-donation.jpg'
  }
];

// Razorpay types
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal?: { ondismiss?: () => void };
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function DonatePage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recurring, setRecurring] = useState<boolean>(false);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    pan: ''
  });
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<{ paymentId: string; amount: number; cause: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptionSelect = (id: string) => {
    setSelectedOption(id);
    setSelectedAmount(null);
    setCustomAmount('');
    setError(null);
  };

  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDonorInfo({ ...donorInfo, [e.target.name]: e.target.value });
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

    if (!selectedOption) { setError('Please select a cause.'); return; }
    if (amount < 1) { setError('Please select or enter a valid amount.'); return; }
    if (!donorInfo.name.trim()) { setError('Please enter your full name.'); return; }
    if (!donorInfo.email.trim()) { setError('Please enter your email address.'); return; }

    setLoading(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load Razorpay. Please check your internet connection.');

      // 2. Create order on server
      const orderRes = await fetch('/api/donation/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, cause: selectedOption, donorInfo }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Could not create payment order.');

      const causeName = donationOptions.find(o => o.id === selectedOption)?.name || '';

      // 3. Open Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ISKCON Durgapur',
        description: `Donation – ${causeName}`,
        image: '/images/iskcon-logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: donorInfo.name,
          email: donorInfo.email,
          contact: donorInfo.phone,
        },
        theme: { color: '#f97316' },
        handler: async (response: RazorpayResponse) => {
          // 4. Verify payment on server
          const verifyRes = await fetch('/api/donation/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // 5. Record donation to MongoDB via Laravel backend
            try {
              await recordDonation({
                donor_name: donorInfo.name,
                donor_email: donorInfo.email,
                donor_phone: donorInfo.phone,
                pan: donorInfo.pan,
                amount,
                purpose: selectedOption,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                status: 'completed',
              });
            } catch {
              // Non-blocking: payment already succeeded
            }
            setPaymentSuccess({ paymentId: verifyData.paymentId, amount, cause: causeName });
          } else {
            setError('Payment verification failed. Please contact support with your Payment ID.');
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <FaCheckCircle className="text-green-500 text-7xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hare Krishna! 🙏</h1>
          <p className="text-gray-600 mb-6">
            Your donation of <span className="font-bold text-orange-600">₹{paymentSuccess.amount.toLocaleString('en-IN')}</span> towards{' '}
            <span className="font-bold text-orange-600">{paymentSuccess.cause}</span> has been received.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 mb-8">
            Payment ID: <span className="font-mono font-medium text-gray-700">{paymentSuccess.paymentId}</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">A receipt will be sent to <strong>{donorInfo.email}</strong>.</p>
          <button
            onClick={() => { setPaymentSuccess(null); setSelectedOption(null); setSelectedAmount(null); setCustomAmount(''); setDonorInfo({ name: '', email: '', phone: '', pan: '' }); }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Make Another Donation
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Main Donate Page ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero Section */}
      <section className="relative py-4 px-4 md:px-8 text-center bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/krishna-temple.jpg" alt="Temple Background" fill className="object-cover" priority />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Support the Mission of Lord Krishna</h1>
            <p className="text-lg md:text-xl text-white opacity-90 mb-6">
              Your generous contribution helps spread Krishna consciousness and serve communities worldwide.
            </p>
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-orange-600 font-semibold shadow-lg">
                <FaHandHoldingHeart className="mr-2" /> Donate Today
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left – Cause Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a Cause</h2>
              <div className="space-y-3">
                {donationOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedOption === option.id
                      ? 'bg-orange-100 border-2 border-orange-500'
                      : 'bg-gray-50 hover:bg-orange-50 border-2 border-transparent'
                      }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 relative overflow-hidden rounded-full mr-3 shrink-0">
                        <Image src={option.image} alt={option.name} width={40} height={40} className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{option.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{option.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Donate */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Why Donate?</h2>
              <ul className="space-y-3 text-gray-700">
                {[
                  'Support spiritual knowledge distribution',
                  'Help feed millions through Food for Life',
                  'Preserve and promote Vedic culture',
                  'Support temple construction and maintenance',
                  'Contribute to cow protection programs',
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <div className="shrink-0 mt-1 text-orange-500">•</div>
                    <p className="ml-2">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right – Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <form onSubmit={handleDonate}>

                {/* No cause selected */}
                {!selectedOption && (
                  <div className="p-10 text-center">
                    <h3 className="text-lg text-gray-600 mb-3">Please select a cause to support</h3>
                    <span className="inline-block animate-bounce bg-orange-100 rounded-full p-3 text-orange-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </span>
                  </div>
                )}

                <AnimatePresence>
                  {selectedOption && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {donationOptions.find(o => o.id === selectedOption)?.name}
                      </h2>

                      {/* Amount Selection */}
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Select Amount*</h3>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {donationOptions
                            .find(o => o.id === selectedOption)
                            ?.amounts.map((amount) => (
                              <button
                                key={amount}
                                type="button"
                                className={`py-2 px-4 rounded-lg border-2 transition-all ${selectedAmount === amount
                                  ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium'
                                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                                  }`}
                                onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                              >
                                ₹{amount.toLocaleString('en-IN')}
                              </button>
                            ))}
                        </div>
                        <div>
                          <label className="text-gray-600 text-sm mb-1 block">Custom Amount (₹)</label>
                          <input
                            type="number"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            min="1"
                          />
                        </div>
                      </div>

                      {/* Recurring Option */}
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="recurring"
                            checked={recurring}
                            onChange={() => setRecurring(!recurring)}
                            className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                          />
                          <label htmlFor="recurring" className="ml-2 text-gray-700 flex items-center">
                            <FaRegCalendarAlt className="mr-1 text-orange-500" />
                            Make this a monthly donation
                          </label>
                        </div>
                        {recurring && (
                          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                            Your donation will automatically process monthly until canceled. You can cancel anytime.
                          </p>
                        )}
                      </div>

                      {/* Donor Information */}
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-600 text-sm mb-1 block">Full Name*</label>
                            <input type="text" name="name" value={donorInfo.name} onChange={handleDonorInfoChange}
                              placeholder="Your full name" required
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                          </div>
                          <div>
                            <label className="text-gray-600 text-sm mb-1 block">Email*</label>
                            <input type="email" name="email" value={donorInfo.email} onChange={handleDonorInfoChange}
                              placeholder="Your email address" required
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                          </div>
                          <div>
                            <label className="text-gray-600 text-sm mb-1 block">Phone</label>
                            <input type="tel" name="phone" value={donorInfo.phone} onChange={handleDonorInfoChange}
                              placeholder="Your phone number"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                          </div>
                          <div>
                            <label className="text-gray-600 text-sm mb-1 block">PAN (For 80G tax benefit)</label>
                            <input type="text" name="pan" value={donorInfo.pan} onChange={handleDonorInfoChange}
                              placeholder="PAN number (optional)"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
                          </div>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      {/* Razorpay Info */}
                      <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-3 text-sm text-gray-600">
                        <FaShieldAlt className="text-orange-400 shrink-0" />
                        <span>Payments are secured by <strong>Razorpay</strong>. Supports UPI, Cards, NetBanking, Wallets & more.</span>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Opening Payment…
                          </>
                        ) : (
                          <>
                            <FaHandHoldingHeart />
                            Donate ₹{(selectedAmount || parseInt(customAmount) || 0).toLocaleString('en-IN')} via Razorpay
                          </>
                        )}
                      </button>
                      <p className="text-xs text-center text-gray-500 mt-2">
                        By donating, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Transparency Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-orange-500 text-xl mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Transparency Promise</h2>
              </div>
              <p className="text-gray-700 mb-4">
                We are committed to complete transparency in our financial operations. All donations are used as specified, with minimal administrative costs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {[
                  { title: 'Annual Reports', sub: 'Published every year' },
                  { title: 'Financial Audits', sub: 'Regular independent reviews' },
                  { title: 'Project Updates', sub: 'Regular donor communications' },
                ].map(item => (
                  <div key={item.title} className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-700">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <FaRegQuestionCircle className="text-orange-500 text-xl mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {[
                  { q: 'Are my donations tax-deductible?', a: 'Yes, ISKCON is a registered non-profit. Donations are tax-deductible under Section 80G of the Income Tax Act, 1961.' },
                  { q: 'Which payment methods are accepted?', a: 'We accept UPI, Credit/Debit Cards, NetBanking, Paytm, PhonePe and all major wallets via Razorpay.' },
                  { q: 'Is my payment information secure?', a: 'Yes. All payments are processed by Razorpay, a PCI DSS compliant payment gateway with bank-grade security.' },
                  { q: 'How do I cancel my recurring donation?', a: 'You can cancel your recurring donation at any time by contacting our donor support team.' },
                ].map(({ q, a }) => (
                  <div key={q}>
                    <h3 className="font-medium text-gray-900 mb-1">{q}</h3>
                    <p className="text-gray-700 text-sm">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-orange-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Need Help With Your Donation?</h2>
          <p className="text-gray-700 mb-6">Our dedicated support team is here to assist you with any questions.</p>
          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="mailto:info.iskcondurgapur@gmail.com" className="px-6 py-3 bg-white text-orange-600 rounded-lg shadow-md hover:bg-orange-50 transition-colors">
              info.iskcondurgapur@gmail.com
            </a>
            <a href="tel:+911234567890" className="px-6 py-3 bg-white text-orange-600 rounded-lg shadow-md hover:bg-orange-50 transition-colors">
              +91 (1234) 567-890
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Tax Benefits for Indian Donors</h3>
            <p className="text-gray-600 mb-4">
              Contributions to ISKCON qualify for tax exemption under Section 80G of the Income Tax Act, 1961.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="font-medium text-gray-800">80G Registration No:</p>
                <p className="text-gray-600">AAAT10384G/80G/2019-20/A/10010</p>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="font-medium text-gray-800">PAN:</p>
                <p className="text-gray-600">AAAT10384G</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}