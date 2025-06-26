import React, { useEffect, useState } from 'react';
import  Sidebar from './AdminSidebar';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { BASE_URL } from '../config';
import { isAdmin } from '../lib/authUtils';

type Booking = {
  id: number;
  name: string;
  phone: string;
  email: string;
  country: string;
  instituteOrUniversity: string;
  amountPaid: number;
  pricingConfig: {
    presentationType: {
      type: string;
      price: number;
    };
    accommodationOption?: {
      nights: number;
      guests: number;
      price: number;
    };
    processingFeePercent: number;
    totalPrice: number;
  };
};
const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [view, setView] = useState<'with' | 'without'>('with');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/admin/api/admin/registration-forms`, {
          method: 'POST',
          body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const bookingsWithAccommodation = bookings.filter(
    b => b.pricingConfig?.accommodationOption
  );
  const bookingsWithoutAccommodation = bookings.filter(
    b => !b.pricingConfig?.accommodationOption
  );

  // Role check: block access if not admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-[#1a1a1a] p-8 rounded-xl border border-green-700">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Unauthorized</h2>
          <p className="text-gray-300">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen flex bg-gray-950 text-white">
    {/* Sidebar */}
    <Sidebar />

    {/* Main content */}
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-4xl font-bold text-green-400 mb-6 text-center">All Registrations</h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setView('with')}
          className={`px-5 py-2 rounded-lg font-semibold transition ${
            view === 'with'
              ? 'bg-green-500 text-black'
              : 'bg-gray-800 hover:bg-green-600 text-white'
          }`}
        >
          With Accommodation
        </button>
        <button
          onClick={() => setView('without')}
          className={`px-5 py-2 rounded-lg font-semibold transition ${
            view === 'without'
              ? 'bg-green-500 text-black'
              : 'bg-gray-800 hover:bg-green-600 text-white'
          }`}
        >
          Without Accommodation
        </button>
      </div>

      {loading && <p className="text-gray-300 text-center">Loading bookings...</p>}
      {error && <p className="text-red-400 text-center">Error: {error}</p>}

      {!loading && !error && (
        <Section
          title={view === 'with' ? 'With Accommodation' : 'Without Accommodation'}
          bookings={view === 'with' ? bookingsWithAccommodation : bookingsWithoutAccommodation}
          hasAccommodation={view === 'with'}
        />
      )}
    </main>
  </div>
);

};

const Section = ({ title, bookings, hasAccommodation }: { title: string; bookings: Booking[]; hasAccommodation: boolean }) => (
  <section>
    <h2 className="text-2xl font-semibold text-green-300 mb-6">{title}</h2>
    {bookings.length === 0 ? (
      <p className="text-gray-400">No bookings {hasAccommodation ? 'with' : 'without'} accommodation.</p>
    ) : (
      <div className="grid gap-6 md:grid-cols-2">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-gray-900 p-6 rounded-xl shadow-md border border-green-800 hover:shadow-green-600/30 transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2">{b.name}</h3>
            <p className="text-sm text-gray-400 mb-1">{b.email}</p>
            <p className="text-sm text-gray-400 mb-1">📞 {b.phone} | 🌍 {b.country}</p>
            <p className="mb-2 italic text-sm text-gray-400">{b.instituteOrUniversity}</p>

            <div className="text-sm text-white space-y-1">
              <p>
                <strong>Presentation:</strong> {b.pricingConfig.presentationType.type}{' '}
                <span className="text-purple-300 font-semibold bg-gray-800 px-2 py-0.5 rounded-lg">
                  ₹{b.pricingConfig.presentationType.price}
                </span>
              </p>

              {hasAccommodation && (
                <p>
                  <strong>Accommodation:</strong>{' '}
                  {b.pricingConfig.accommodationOption?.guests} Guest(s),{' '}
                  {b.pricingConfig.accommodationOption?.nights} Night(s) —{' '}
                  <span className="text-yellow-300 font-semibold bg-gray-800 px-2 py-0.5 rounded-lg">
                    ₹{b.pricingConfig.accommodationOption?.price}
                  </span>
                </p>
              )}

              <p>
                <strong>Total Paid:</strong>{' '}
                <span className="text-blue-300 font-bold bg-blue-900/40 px-3 py-1 rounded-md shadow-inner">₹{b.amountPaid}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

export default AdminBookings;