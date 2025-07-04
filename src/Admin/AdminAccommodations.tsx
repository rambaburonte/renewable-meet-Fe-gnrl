import { useEffect, useState } from 'react';
import Sidebar from './AdminSidebar';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { BASE_URL } from '../config';
import { isAdmin } from '../lib/authUtils';
import AdminPaymentService from '../services/AdminPaymentService';

// Types based on the actual API response
interface AccommodationOption {
  id: number;
  nights: number;
  guests: number;
  price: number;
}

interface PresentationType {
  id: number;
  type: string;
  price: number;
}

interface PricingConfig {
  id: number;
  presentationType: PresentationType;
  accommodationOption: AccommodationOption;
  processingFeePercent: number;
  totalPrice: number;
}

interface PaymentRecord {
  id: number;
}

interface RegistrationForm {
  id: number;
  name: string;
  phone: string;
  email: string;
  instituteOrUniversity: string;
  country: string;
  pricingConfig: PricingConfig;
  amountPaid: number;
  paymentRecord: PaymentRecord;
}

interface PaymentDetails {
  id: number;
  sessionId: string;
  paymentIntentId?: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  stripeCreatedAt?: string;
  stripeExpiresAt?: string;
}

const AdminCombos = () => {
  const [accommodations, setAccommodations] = useState<AccommodationOption[]>([]);
  const [registrationForms, setRegistrationForms] = useState<RegistrationForm[]>([]);
  const [nights, setNights] = useState('');
  const [guests, setGuests] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAccommodation, setSelectedAccommodation] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<PaymentDetails | null>(null);

  // Fetch all accommodations and registration data
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/registration/get-all-accommodation-options`);
      if (!response.ok) throw new Error('Failed to fetch accommodations');
      const data = await response.json();
      setAccommodations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all registration forms with payment data
  const fetchRegistrationForms = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}/admin/api/admin/registration-forms`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to fetch registration forms');
      const data = await response.json();
      setRegistrationForms(data);
    } catch (err: any) {
      console.error('Error fetching registration forms:', err);
    }
  };

  // Get accommodation booking details by accommodation ID
  const getAccommodationBookingDetails = (accommodationId: number) => {
    const bookingsForAccommodation = registrationForms.filter(
      form => form.pricingConfig?.accommodationOption?.id === accommodationId
    );

    const totalBookings = bookingsForAccommodation.length;
    const totalRevenue = bookingsForAccommodation.reduce(
      (sum, form) => sum + (form.amountPaid || 0), 0
    );

    // Count payment statuses (we'll need to fetch actual payment details for accurate status)
    const paidBookings = bookingsForAccommodation.filter(form => form.paymentRecord?.id);

    return {
      totalBookings,
      paidBookings: paidBookings.length,
      totalRevenue,
      bookings: bookingsForAccommodation
    };
  };

  // Fetch payment details for a specific payment record ID
  const fetchPaymentDetails = async (paymentRecordId: number) => {
    try {
      const paymentData = await AdminPaymentService.getPaymentById(paymentRecordId);
      return paymentData;
    } catch (err) {
      console.error('Error fetching payment details:', err);
      return null;
    }
  };

  // Show payment details for a specific booking
  const showBookingPaymentDetails = async (booking: RegistrationForm, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (booking.paymentRecord?.id) {
      try {
        const paymentData = await fetchPaymentDetails(booking.paymentRecord.id);
        if (paymentData) {
          // Create a detailed alert with payment information
          const paymentInfo = `
Payment Details for ${booking.name}:

Payment ID: #${paymentData.id}
Status: ${paymentData.status}
Stripe Status: ${paymentData.paymentStatus}
Amount: €${paymentData.amountTotal.toFixed(2)} ${paymentData.currency}
Customer: ${paymentData.customerEmail}
Session ID: ${paymentData.sessionId}
${paymentData.paymentIntentId ? `Payment Intent: ${paymentData.paymentIntentId}` : ''}
Created: ${new Date(paymentData.createdAt).toLocaleString()}
Updated: ${new Date(paymentData.updatedAt).toLocaleString()}
          `;
          alert(paymentInfo);
        } else {
          alert('Failed to fetch payment details');
        }
      } catch (error) {
        alert('Error fetching payment details: ' + error);
      }
    } else {
      alert('No payment record found for this booking');
    }
  };

  // Handle clicking on accommodation row to show details
  const handleAccommodationClick = async (accommodation: AccommodationOption, event?: React.MouseEvent) => {
    // Prevent any default behavior or navigation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setSelectedAccommodation(accommodation);
    const bookingDetails = getAccommodationBookingDetails(accommodation.id);
    
    // Reset payment details first
    setPaymentDetails(null);
    
    // If there are bookings, fetch payment details for the first one as example
    if (bookingDetails.bookings.length > 0) {
      const firstBooking = bookingDetails.bookings[0];
      if (firstBooking.paymentRecord?.id) {
        try {
          const paymentData = await fetchPaymentDetails(firstBooking.paymentRecord.id);
          setPaymentDetails(paymentData);
        } catch (error) {
          console.error('Failed to fetch payment details:', error);
        }
      }
    }
    
    setShowDetailsModal(true);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchAccommodations();
      await fetchRegistrationForms();
    };
    loadData();
  }, []);

  const addCombo = async () => {
    if (!nights || !guests || !price) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetchWithAuth(`${BASE_URL}/admin/api/admin/accommodation`, {
        method: 'POST',
        body: JSON.stringify({
          nights: parseInt(nights),
          guests: parseInt(guests),
          price: parseFloat(price)
        })
      });

      if (!response.ok) throw new Error('Failed to add combo');

      setNights('');
      setGuests('');
      setPrice('');
      setShowModal(true);
      // Refresh both accommodation list and registration data
      await fetchAccommodations();
      await fetchRegistrationForms();
    } catch (err: any) {
      setError(err.message);
    }
  };

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
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <div className="flex-1 p-6 ml-[250px]">
        <h1 className="text-3xl font-bold text-green-400 mb-6">Manage Accommodation Combos</h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Accommodation Payment Summary */}
        {!loading && accommodations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1a1a1a] border border-green-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-green-300 mb-2">Total Accommodations</h3>
              <p className="text-2xl font-bold text-white">{accommodations.length}</p>
            </div>
            <div className="bg-[#1a1a1a] border border-blue-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">With Bookings</h3>
              <p className="text-2xl font-bold text-blue-400">
                {accommodations.filter(acc => getAccommodationBookingDetails(acc.id).totalBookings > 0).length}
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-purple-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Total Bookings</h3>
              <p className="text-2xl font-bold text-purple-400">
                {accommodations.reduce((sum, acc) => sum + getAccommodationBookingDetails(acc.id).totalBookings, 0)}
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-yellow-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold text-yellow-400">
                €{accommodations.reduce((sum, acc) => sum + getAccommodationBookingDetails(acc.id).totalRevenue, 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Add combo form */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <input
            type="number"
            placeholder="Nights"
            value={nights}
            onChange={(e) => setNights(e.target.value)}
            className="bg-[#1a1a1a] border border-green-600 px-4 py-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="bg-[#1a1a1a] border border-green-600 px-4 py-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-[#1a1a1a] border-2 border-blue-500 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <button
            onClick={addCombo}
            className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md"
          >
            Add Combo
          </button>
        </div>

        {/* Accommodation list */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-green-400">🔄 Loading accommodations and booking data...</div>
          </div>
        ) : (
          <table className="w-full table-auto border border-green-800 text-sm">
            <thead className="bg-green-900 text-green-300">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Nights</th>
                <th className="p-2 border">Guests</th>
                <th className="p-2 border bg-green-800">Price</th>
                <th className="p-2 border bg-blue-800">Bookings</th>
                <th className="p-2 border bg-purple-800">Paid</th>
                <th className="p-2 border bg-yellow-800">Revenue</th>
                <th className="p-2 border bg-orange-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {accommodations.map((accommodation) => {
                const bookingDetails = getAccommodationBookingDetails(accommodation.id);
                const hasPaidBookings = bookingDetails.paidBookings > 0;
                return (
                  <tr 
                    key={accommodation.id} 
                    className="text-center border-t border-green-800 hover:bg-green-900/20 cursor-pointer transition-colors"
                    onClick={(e) => handleAccommodationClick(accommodation, e)}
                    title="Click to view details"
                  >
                    <td className="p-2">{accommodation.id}</td>
                    <td className="p-2">{accommodation.nights}</td>
                    <td className="p-2">{accommodation.guests}</td>
                    <td className="p-2 font-bold text-blue-300">€{accommodation.price.toFixed(2)}</td>
                    <td className="p-2 font-bold text-purple-300">
                      {bookingDetails.totalBookings}
                    </td>
                    <td className="p-2 font-bold text-green-300">
                      {bookingDetails.paidBookings}
                    </td>
                    <td className="p-2 font-bold text-yellow-300">
                      €{bookingDetails.totalRevenue.toFixed(2)}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hasPaidBookings 
                          ? 'bg-green-500 text-green-900' 
                          : bookingDetails.totalBookings > 0
                          ? 'bg-yellow-500 text-yellow-900'
                          : 'bg-gray-500 text-gray-200'
                      }`}>
                        {hasPaidBookings 
                          ? '✅ Paid' 
                          : bookingDetails.totalBookings > 0 
                          ? '⏳ Pending'
                          : '❌ No Bookings'
                        }
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1a1a1a] text-white p-6 rounded-lg border border-green-600 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-green-400 mb-4">Accommodation Added</h2>
            <p className="mb-4">The new accommodation has been successfully added.</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Accommodation Details Modal */}
      {showDetailsModal && selectedAccommodation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1a1a1a] text-white p-6 rounded-lg border border-green-600 shadow-lg w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-400">
                🏨 Accommodation Details - ID #{selectedAccommodation.id}
              </h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedAccommodation(null);
                  setPaymentDetails(null);
                }}
                className="text-gray-400 hover:text-white text-3xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Accommodation Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-green-300 font-semibold mb-2">🌙 Nights</h3>
                <p className="text-2xl font-bold text-white">{selectedAccommodation.nights}</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-green-300 font-semibold mb-2">👥 Guests</h3>
                <p className="text-2xl font-bold text-white">{selectedAccommodation.guests}</p>
              </div>
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-green-300 font-semibold mb-2">💰 Price</h3>
                <p className="text-2xl font-bold text-blue-400">€{selectedAccommodation.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Booking Statistics */}
            {(() => {
              const bookingDetails = getAccommodationBookingDetails(selectedAccommodation.id);
              return (
                <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
                  <h3 className="text-green-300 font-semibold mb-4">📊 Booking Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Total Bookings</label>
                      <p className="text-white text-lg font-bold">{bookingDetails.totalBookings}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Paid Bookings</label>
                      <p className="text-green-400 text-lg font-bold">{bookingDetails.paidBookings}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Total Revenue</label>
                      <p className="text-yellow-400 text-lg font-bold">€{bookingDetails.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Payment Details */}
            {paymentDetails && (
              <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
                <h3 className="text-green-300 font-semibold mb-4">💳 Sample Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Payment ID</label>
                    <p className="text-white">#{paymentDetails.id}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      paymentDetails.status === 'COMPLETED' 
                        ? 'bg-green-500 text-green-900' 
                        : paymentDetails.status === 'PENDING'
                        ? 'bg-yellow-500 text-yellow-900'
                        : 'bg-red-500 text-red-900'
                    }`}>
                      {paymentDetails.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Stripe Status</label>
                    <p className="text-white">{paymentDetails.paymentStatus}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Amount</label>
                    <p className="text-white">€{paymentDetails.amountTotal.toFixed(2)} {paymentDetails.currency}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Customer Email</label>
                    <p className="text-white">{paymentDetails.customerEmail}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Session ID</label>
                    <div className="flex items-center">
                      <p className="text-white font-mono text-xs break-all mr-2">{paymentDetails.sessionId}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(paymentDetails.sessionId);
                          alert('Session ID copied to clipboard');
                        }}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                        title="Copy Session ID"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  {paymentDetails.paymentIntentId && (
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Payment Intent ID</label>
                      <div className="flex items-center">
                        <p className="text-white font-mono text-xs break-all mr-2">{paymentDetails.paymentIntentId}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(paymentDetails.paymentIntentId!);
                            alert('Payment Intent ID copied to clipboard');
                          }}
                          className="text-blue-400 hover:text-blue-300 text-xs"
                          title="Copy Payment Intent ID"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Created At</label>
                    <p className="text-white">{new Date(paymentDetails.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Updated At</label>
                    <p className="text-white">{new Date(paymentDetails.updatedAt).toLocaleString()}</p>
                  </div>
                  {paymentDetails.stripeCreatedAt && (
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Stripe Created At</label>
                      <p className="text-white">{new Date(paymentDetails.stripeCreatedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {paymentDetails.stripeExpiresAt && (
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Stripe Expires At</label>
                      <p className="text-white">{new Date(paymentDetails.stripeExpiresAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* All Bookings List */}
            {(() => {
              const bookingDetails = getAccommodationBookingDetails(selectedAccommodation.id);
              return bookingDetails.bookings.length > 0 && (
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <h3 className="text-green-300 font-semibold mb-4">📋 All Bookings ({bookingDetails.bookings.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {bookingDetails.bookings.map((booking) => (
                      <div key={booking.id} className="bg-[#1a1a1a] p-3 rounded border border-gray-600 hover:border-green-500 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-semibold text-white">{booking.name}</p>
                            <p className="text-sm text-gray-400">{booking.email}</p>
                            <p className="text-xs text-gray-500">{booking.phone} | {booking.country}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-bold">€{booking.amountPaid.toFixed(2)}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-400">
                                Payment ID: {booking.paymentRecord?.id || 'N/A'}
                              </p>
                              {booking.paymentRecord?.id && (
                                <button
                                  onClick={(e) => showBookingPaymentDetails(booking, e)}
                                  className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 bg-blue-900/30 rounded border border-blue-600 hover:border-blue-400 transition-colors"
                                  title="Click to view payment details"
                                >
                                  💳 View Payment
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Booking Details */}
                        <div className="mt-2 pt-2 border-t border-gray-700">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-400">Presentation:</span>
                              <span className="text-white ml-1">{booking.pricingConfig.presentationType.type}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Institute:</span>
                              <span className="text-white ml-1">{booking.instituteOrUniversity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-400 text-center">
                    💡 Click "💳 View Payment" buttons to see individual payment details
                  </div>
                </div>
              );
            })()}

            {/* Close Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedAccommodation(null);
                  setPaymentDetails(null);
                }}
                className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCombos;
