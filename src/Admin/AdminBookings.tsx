import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { BASE_URL } from '../config';
import { isAdmin } from '../lib/authUtils';
import AdminPaymentService from '../services/AdminPaymentService';
import { FaSearch, FaBed, FaUserFriends, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaClipboard, FaSpinner } from 'react-icons/fa';

// Utility function for consistent currency formatting
const formatCurrency = (amount: number, currency: string = 'EUR') => {
  if (amount === null || amount === undefined) return '€0.00';
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

type PaymentRecord = {
  id: number;
};

type Booking = {
  id: number;
  name: string;
  phone: string;
  email: string;
  country: string;
  instituteOrUniversity: string;
  amountPaid: number;
  paymentRecord: PaymentRecord;
  pricingConfig: {
    id: number;
    presentationType: {
      id: number;
      type: string;
      price: number;
    };
    accommodationOption?: {
      id: number;
      nights: number;
      guests: number;
      price: number;
    };
    processingFeePercent: number;
    totalPrice: number;
  };
};

type PaymentDetails = {
  id: number;
  sessionId: string;
  paymentIntentId?: string;
  customerEmail: string;
  amountTotal: number;
  amountTotalEuros: number;
  amountTotalCents: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  stripeCreatedAt?: string;
  stripeExpiresAt?: string;
};

const WEBSITE_OPTIONS = [
  { label: 'Optics', value: 'optics' },
  { label: 'Renewable', value: 'renewable' },
  { label: 'Nursing', value: 'nursing' },
];

const AdminBookings = () => {
  // Remove all URL param logic, use only state and sidebar
  const [website, setWebsite] = useState(() => localStorage.getItem('adminWebsite') || 'optics');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allPayments, setAllPayments] = useState<PaymentDetails[]>([]); // For revenue calculation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'with' | 'without'>('with');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searching, setSearching] = useState(false);
  // Universal search state
  const [universalSearch, setUniversalSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch bookings for the selected website
        const res = await fetchWithAuth(`${BASE_URL}/admin/api/admin/registration-forms/${website}`, {
          method: 'POST',
          body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);

        // Fetch ALL payments for revenue calculation consistency
        try {
          const allPaymentsData = await AdminPaymentService.getAllPayments(website);
          setAllPayments(Array.isArray(allPaymentsData) ? allPaymentsData : []);
        } catch (err) {
          console.error('Failed to fetch all payments for revenue calculation:', err);
        }

        // Fetch payment statuses for all bookings with payment records
        const paymentStatusPromises = data
          .filter((booking: Booking) => booking.paymentRecord?.id)
          .map(async (booking: Booking) => {
            try {
              const paymentData = await AdminPaymentService.getPaymentById(booking.paymentRecord.id, website);
              return { bookingId: booking.id, paymentData };
            } catch (err) {
              console.error(`Failed to fetch payment for booking ${booking.id}:`, err);
              return { bookingId: booking.id, paymentData: null };
            }
          });

        const paymentResults = await Promise.all(paymentStatusPromises);
        const statusMap: {[key: number]: PaymentDetails | null} = {};
        paymentResults.forEach(result => {
          statusMap[result.bookingId] = result.paymentData;
        });
        setBookingPaymentStatuses(statusMap);

      } catch (err: any) {
        setError(err.message || 'Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [website]);

  // Handle clicking on booking to show payment details
  const handleBookingClick = async (booking: Booking, event?: React.MouseEvent) => {
    // Prevent any default behavior or navigation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('Booking clicked:', booking.id, 'Payment Record:', booking.paymentRecord?.id);
    
    // Set booking and show modal immediately
    setSelectedBooking(booking);
    setPaymentDetails(null); // Reset payment details
    setShowDetailsModal(true); // Show modal immediately
    
    // Fetch payment details if payment record exists
    if (booking.paymentRecord?.id) {
      setLoadingPayment(true);
      try {
        const paymentData = await AdminPaymentService.getPaymentById(booking.paymentRecord.id);
        console.log('Payment data received:', paymentData);
        setPaymentDetails(paymentData);
      } catch (error) {
        console.error('Failed to fetch payment details:', error);
        setPaymentDetails(null);
      } finally {
        setLoadingPayment(false);
      }
    } else {
      console.log('No payment record for this booking');
      setLoadingPayment(false);
    }
  };

  // Enhanced payment status logic - check actual payment status
  const getPaymentStatusColor = (booking: Booking, paymentDetails?: PaymentDetails | null) => {
    if (!booking.paymentRecord?.id) {
      return 'bg-gray-500 text-gray-200';
    }
    
    // If we have payment details, use the actual status
    if (paymentDetails) {
      switch (paymentDetails.status) {
        case 'COMPLETED':
          return 'bg-green-500 text-green-900';
        case 'PENDING':
          return 'bg-yellow-500 text-yellow-900';
        case 'FAILED':
        case 'CANCELLED':
          return 'bg-red-500 text-red-900';
        case 'EXPIRED':
          return 'bg-orange-500 text-orange-900';
        default:
          return 'bg-gray-500 text-gray-200';
      }
    }
    
    // Default to yellow (unknown) if payment record exists but details not loaded
    return 'bg-yellow-500 text-yellow-900';
  };

  // Enhanced payment status text
  const getPaymentStatusText = (booking: Booking, paymentDetails?: PaymentDetails | null) => {
    if (!booking.paymentRecord?.id) {
      return '❌ No Payment Record';
    }
    
    // If we have payment details, show the actual status
    if (paymentDetails) {
      switch (paymentDetails.status) {
        case 'COMPLETED':
          return '✅ Paid';
        case 'PENDING':
          return '⏳ Pending';
        case 'FAILED':
          return '❌ Failed';
        case 'CANCELLED':
          return '🚫 Cancelled';
        case 'EXPIRED':
          return '⏰ Expired';
        default:
          return '❓ Unknown';
      }
    }
    
    return '🔄 Click to Check Status';
  };

  // Store payment statuses for cards to avoid re-fetching
  const [bookingPaymentStatuses, setBookingPaymentStatuses] = useState<{[key: number]: PaymentDetails | null}>({});

  // Enhanced summary statistics including payment status breakdown
  const paidBookings = bookings.filter(b => {
    const paymentStatus = bookingPaymentStatuses[b.id];
    return paymentStatus?.status === 'COMPLETED';
  });
  
  const pendingBookings = bookings.filter(b => {
    const paymentStatus = bookingPaymentStatuses[b.id];
    return paymentStatus?.status === 'PENDING' || (b.paymentRecord?.id && !paymentStatus);
  });

  const unpaidBookings = bookings.filter(b => !b.paymentRecord?.id);

  const bookingsWithAccommodation = bookings.filter(
    b => b.pricingConfig?.accommodationOption
  );
  const bookingsWithoutAccommodation = bookings.filter(
    b => !b.pricingConfig?.accommodationOption
  );

  // Universal search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBookings(bookings);
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    setFilteredBookings(
      bookings.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q) ||
        b.instituteOrUniversity.toLowerCase().includes(q) ||
        (b.pricingConfig.presentationType.type?.toLowerCase().includes(q)) ||
        (b.pricingConfig.accommodationOption?.nights?.toString().includes(q)) ||
        (b.pricingConfig.accommodationOption?.guests?.toString().includes(q)) ||
        (b.pricingConfig.accommodationOption?.price?.toString().includes(q)) ||
        (b.pricingConfig.totalPrice?.toString().includes(q))
      )
    );
  }, [searchQuery, bookings]);

  // Universal search filter function
  const filterByUniversalSearch = (booking: Booking) => {
    if (!universalSearch.trim()) return true;
    const search = universalSearch.trim().toLowerCase();
    return (
      booking.name?.toLowerCase().includes(search) ||
      booking.email?.toLowerCase().includes(search) ||
      booking.phone?.toLowerCase().includes(search) ||
      booking.country?.toLowerCase().includes(search) ||
      booking.instituteOrUniversity?.toLowerCase().includes(search) ||
      (booking.paymentRecord?.id?.toString() || '').includes(search) ||
      booking.pricingConfig?.presentationType?.type?.toLowerCase().includes(search) ||
      (booking.pricingConfig?.accommodationOption?.nights?.toString() || '').includes(search) ||
      (booking.pricingConfig?.accommodationOption?.guests?.toString() || '').includes(search)
    );
  };

  // Filtered bookings for each view
  const filteredBookingsWithAccommodation = bookingsWithAccommodation.filter(filterByUniversalSearch);
  const filteredBookingsWithoutAccommodation = bookingsWithoutAccommodation.filter(filterByUniversalSearch);

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
  <div className="min-h-screen bg-gray-950 text-white">
    {/* Sidebar */}
    <Sidebar website={website} setWebsite={setWebsite} />

    {/* Main content */}
    <main className="ml-64 p-8 overflow-y-auto">
      {/* Website/vertical selector */}
      {/* Website/vertical selector removed, now handled by sidebar */}
      <h1 className="text-4xl font-bold text-green-400 mb-6 text-center">All Registrations</h1>

      {/* Summary Statistics */}
      {!loading && !error && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#1a1a1a] border border-green-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2"><FaClipboard /> Total Bookings</h3>
              <p className="text-2xl font-bold text-white">{bookings.length}</p>
            </div>
            <div className="bg-[#1a1a1a] border border-green-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2"><FaCheckCircle className="text-green-400" /> Paid</h3>
              <p className="text-2xl font-bold text-green-400">{paidBookings.length}</p>
            </div>
            <div className="bg-[#1a1a1a] border border-yellow-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2 flex items-center gap-2"><FaSpinner className="animate-spin" /> Pending</h3>
              <p className="text-2xl font-bold text-yellow-400">{pendingBookings.length}</p>
            </div>
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-2 flex items-center gap-2"><FaTimesCircle className="text-gray-400" /> No Payment</h3>
              <p className="text-2xl font-bold text-gray-400">{unpaidBookings.length}</p>
            </div>
            <div className="bg-[#1a1a1a] border border-purple-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2"><FaMoneyBillWave /> Total Revenue</h3>
              <p className="text-2xl font-bold text-purple-400">
                {(() => {
                  const completedRevenue = allPayments
                    .filter(payment => payment.status === 'COMPLETED')
                    .reduce((total, payment) => total + (payment.amountTotalEuros || 0), 0);
                  return formatCurrency(completedRevenue, 'EUR');
                })()}
              </p>
              <p className="text-xs text-gray-400">Only completed payments</p>
            </div>
          </div>
          
          {/* Accommodation Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#1a1a1a] border border-blue-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-2 flex items-center gap-2"><FaBed /> With Accommodation</h3>
              <p className="text-2xl font-bold text-blue-400">{bookingsWithAccommodation.length}</p>
            </div>
            <div className="bg-[#1a1a1a] border border-purple-600 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2"><FaUserFriends /> Without Accommodation</h3>
              <p className="text-2xl font-bold text-purple-400">{bookingsWithoutAccommodation.length}</p>
            </div>
          </div>
        </div>
      )}
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

      {/* Universal Search Bar (only one, with icon) */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
            <FaSearch />
          </span>
          <input
            type="text"
            value={universalSearch}
            onChange={e => setUniversalSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') {/* Optionally: do nothing, search is live */} }}
            placeholder="Search all fields (name, email, phone, country, etc.)..."
            className="bg-[#222] border border-purple-600 rounded-lg px-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
          />
        </div>
        <button
          onClick={() => setUniversalSearch('')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
        >
          <FaTimesCircle /> Reset
        </button>
      </div>

      {loading && <p className="text-gray-300 text-center">Loading bookings...</p>}
      {error && <p className="text-red-400 text-center">Error: {error}</p>}

      {!loading && !error && (
        <Section
          title={view === 'with' ? 'With Accommodation' : 'Without Accommodation'}
          bookings={view === 'with' ? filteredBookingsWithAccommodation : filteredBookingsWithoutAccommodation}
          hasAccommodation={view === 'with'}
          onBookingClick={handleBookingClick}
          getPaymentStatusColor={(booking) => getPaymentStatusColor(booking, bookingPaymentStatuses[booking.id])}
          getPaymentStatusText={(booking) => getPaymentStatusText(booking, bookingPaymentStatuses[booking.id])}
          bookingPaymentStatuses={bookingPaymentStatuses}
        />
      )}
    </main>

    {/* Complete Payment Details Modal */}
    {showDetailsModal && selectedBooking && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <div className="bg-[#1a1a1a] text-white p-6 rounded-xl border-2 border-green-600 shadow-2xl w-[95%] max-w-6xl max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-600">
            <div>
              <h2 className="text-3xl font-bold text-green-400 mb-2">
                📋 Complete Booking & Payment Details
              </h2>
              <p className="text-gray-300">
                Customer: <span className="font-semibold text-white">{selectedBooking.name}</span> | 
                Booking ID: <span className="font-mono text-blue-300">#{selectedBooking.id}</span>
                {selectedBooking.paymentRecord?.id && (
                  <> | Payment Record: <span className="font-mono text-green-300">#{selectedBooking.paymentRecord.id}</span></>
                )}
              </p>
            </div>
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedBooking(null);
                setPaymentDetails(null);
              }}
              className="text-gray-400 hover:text-white text-4xl font-bold transition-colors"
              title="Close modal"
            >
              ×
            </button>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <h3 className="text-green-300 font-semibold mb-2">👤 Customer Info</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedBooking.name}</p>
                <p><strong>Email:</strong> {selectedBooking.email}</p>
                <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                <p><strong>Country:</strong> {selectedBooking.country}</p>
                <p><strong>Institute:</strong> {selectedBooking.instituteOrUniversity}</p>
              </div>
            </div>
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <h3 className="text-green-300 font-semibold mb-2">💰 Pricing Details</h3>
              <div className="space-y-2">
                <p><strong>Presentation:</strong> {selectedBooking.pricingConfig.presentationType.type}</p>
                <p><strong>Presentation Fee:</strong> €{(selectedBooking.pricingConfig.presentationType.price || 0).toFixed(2)}</p>
                {selectedBooking.pricingConfig.accommodationOption && (
                  <>
                    <p><strong>Accommodation:</strong> {selectedBooking.pricingConfig.accommodationOption.nights} nights, {selectedBooking.pricingConfig.accommodationOption.guests} guests</p>
                    <p><strong>Accommodation Fee:</strong> €{(selectedBooking.pricingConfig.accommodationOption.price || 0).toFixed(2)}</p>
                  </>
                )}
                <p><strong>Processing Fee:</strong> {selectedBooking.pricingConfig.processingFeePercent}%</p>
                <p className="text-sm text-gray-400">Processing Fee Amount: €{(((selectedBooking.pricingConfig.presentationType.price || 0) + (selectedBooking.pricingConfig.accommodationOption?.price || 0)) * (selectedBooking.pricingConfig.processingFeePercent || 0) / 100).toFixed(2)}</p>
                <p className="text-lg"><strong>Total Amount:</strong> <span className="text-green-400">€{(selectedBooking.pricingConfig.totalPrice || selectedBooking.amountPaid || 0).toFixed(2)}</span></p>
              </div>
            </div>
          </div>

          {/* Complete Payment Information */}
          <div className="bg-[#2a2a2a] rounded-lg p-6 mb-6">
            <h3 className="text-green-300 font-semibold mb-6 text-xl">💳 Complete Payment Details</h3>
            {loadingPayment ? (
              <div className="text-center text-green-400 py-8">
                <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-green-400 rounded-full" role="status" aria-label="loading">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-4">🔄 Loading complete payment details...</p>
              </div>
            ) : paymentDetails && paymentDetails.id ? (
              <div className="space-y-6">
                {/* Payment Status Header */}
                <div className="bg-[#1a1a1a] rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">Payment #{paymentDetails.id}</h4>
                      <p className="text-gray-400">Session: {paymentDetails.sessionId}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      paymentDetails.status === 'COMPLETED' 
                        ? 'bg-green-500 text-green-900' 
                        : paymentDetails.status === 'PENDING'
                        ? 'bg-yellow-500 text-yellow-900'
                        : 'bg-red-500 text-red-900'
                    }`}>
                      {paymentDetails.status}
                    </span>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h5 className="text-green-300 font-semibold mb-3">💰 Financial Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Total Amount</label>
                      <p className="text-2xl font-bold text-green-400">€{(paymentDetails.amountTotal || selectedBooking.pricingConfig.totalPrice || selectedBooking.amountPaid || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-400">{paymentDetails.currency || 'EUR'}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Customer Email</label>
                      <p className="text-white">{paymentDetails.customerEmail}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Processing Fee</label>
                      <p className="text-white font-bold">{selectedBooking.pricingConfig.processingFeePercent}%</p>
                      <p className="text-sm text-gray-400">€{(((selectedBooking.pricingConfig.presentationType.price || 0) + (selectedBooking.pricingConfig.accommodationOption?.price || 0)) * (selectedBooking.pricingConfig.processingFeePercent || 0) / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Total Amount</label>
                      <p className="text-white font-bold">€{(selectedBooking.pricingConfig.totalPrice || selectedBooking.amountPaid || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Status Details */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h5 className="text-blue-300 font-semibold mb-3">📊 Status Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Payment Status</label>
                      <p className="text-white font-medium">{paymentDetails.status}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Stripe Payment Status</label>
                      <p className="text-white font-medium">{paymentDetails.paymentStatus}</p>
                    </div>
                    {paymentDetails.paymentIntentId && (
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-1">Payment Intent ID</label>
                        <p className="text-white font-mono text-sm break-all">{paymentDetails.paymentIntentId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timing Information */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h5 className="text-purple-300 font-semibold mb-3">⏰ Timing Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Payment Created</label>
                      <p className="text-white">{new Date(paymentDetails.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Last Updated</label>
                      <p className="text-white">{new Date(paymentDetails.updatedAt).toLocaleString()}</p>
                    </div>
                    {paymentDetails.stripeCreatedAt && (
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Stripe Created</label>
                        <p className="text-white">{new Date(paymentDetails.stripeCreatedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {paymentDetails.stripeExpiresAt && (
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Stripe Expires</label>
                        <p className="text-white">{new Date(paymentDetails.stripeExpiresAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Session Details */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h5 className="text-yellow-300 font-semibold mb-3">🔗 Session Information</h5>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Session ID</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-mono text-sm break-all flex-1">{paymentDetails.sessionId}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(paymentDetails.sessionId)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Copy to clipboard"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Actions */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <h5 className="text-orange-300 font-semibold mb-3">🔧 Actions</h5>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const fullPaymentInfo = `
🔍 COMPLETE PAYMENT DETAILS

Payment ID: #${paymentDetails.id}
Session ID: ${paymentDetails.sessionId}
${paymentDetails.paymentIntentId ? `Payment Intent: ${paymentDetails.paymentIntentId}` : ''}

💰 FINANCIAL DETAILS
Amount: €${(paymentDetails.amountTotal || selectedBooking.pricingConfig.totalPrice || selectedBooking.amountPaid || 0).toFixed(2)} ${paymentDetails.currency || 'EUR'}
Customer: ${paymentDetails.customerEmail}
Total Amount: €${(selectedBooking.pricingConfig.totalPrice || selectedBooking.amountPaid || 0).toFixed(2)}

📊 STATUS INFORMATION
Payment Status: ${paymentDetails.status}
Stripe Status: ${paymentDetails.paymentStatus}

⏰ TIMING DETAILS
Created: ${new Date(paymentDetails.createdAt).toLocaleString()}
Updated: ${new Date(paymentDetails.updatedAt).toLocaleString()}
${paymentDetails.stripeCreatedAt ? `Stripe Created: ${new Date(paymentDetails.stripeCreatedAt).toLocaleString()}` : ''}
${paymentDetails.stripeExpiresAt ? `Stripe Expires: ${new Date(paymentDetails.stripeExpiresAt).toLocaleString()}` : ''}

📝 BOOKING ASSOCIATION
Booking ID: #${selectedBooking.id}
Customer: ${selectedBooking.name}
Email: ${selectedBooking.email}
Phone: ${selectedBooking.phone}
Country: ${selectedBooking.country}
                        `;
                        alert(fullPaymentInfo);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      📋 Copy All Details
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(paymentDetails.id.toString())}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      Copy Payment ID
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedBooking.paymentRecord?.id ? (
              <div className="text-center py-8">
                <div className="text-red-400 text-lg mb-2">❌ Payment Details Unavailable</div>
                <p className="text-gray-400">Failed to load payment details for Payment Record ID: #{selectedBooking.paymentRecord.id}</p>
                <div className="mt-4 bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Available Information:</h4>
                  <p className="text-sm text-gray-300">Payment Record exists with ID: #{selectedBooking.paymentRecord.id}</p>
                  <p className="text-sm text-gray-300">Total Amount: €{(selectedBooking.pricingConfig.totalPrice || selectedBooking.amountPaid || 0).toFixed(2)}</p>
                  <p className="text-sm text-gray-300">Customer: {selectedBooking.email}</p>
                </div>
                <button
                  onClick={() => handleBookingClick(selectedBooking)}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors"
                >
                  🔄 Retry Loading
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">❌ No Payment Record</div>
                <p className="text-gray-500">This booking does not have an associated payment record.</p>
                <div className="mt-4 bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    This could mean the booking was created but payment was never initiated or completed.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-600">
            <p className="text-sm text-gray-400">
              💡 All payment and booking details are displayed above
            </p>
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedBooking(null);
                setPaymentDetails(null);
              }}
              className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-lg transition-colors font-bold text-lg"
            >
              ✓ Close Details
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

const Section = ({ 
  title, 
  bookings, 
  hasAccommodation, 
  onBookingClick, 
  getPaymentStatusColor, 
  getPaymentStatusText,
  bookingPaymentStatuses
}: { 
  title: string; 
  bookings: Booking[]; 
  hasAccommodation: boolean;
  onBookingClick: (booking: Booking, event?: React.MouseEvent) => void;
  getPaymentStatusColor: (booking: Booking) => string;
  getPaymentStatusText: (booking: Booking) => string;
  bookingPaymentStatuses: {[key: number]: PaymentDetails | null};
}) => (
  <section>
    <h2 className="text-2xl font-semibold text-green-300 mb-6">{title}</h2>
    {bookings.length === 0 ? (
      <p className="text-gray-400">No bookings {hasAccommodation ? 'with' : 'without'} accommodation.</p>
    ) : (
      <div className="grid gap-6 md:grid-cols-2">
        {bookings.map((b) => {
          const paymentStatus = bookingPaymentStatuses[b.id];
          const isPaid = paymentStatus?.status === 'COMPLETED';
          const isPending = paymentStatus?.status === 'PENDING' || (b.paymentRecord?.id && !paymentStatus);
          const hasNoPayment = !b.paymentRecord?.id;
          
          return (
              <div
                key={b.id}
                className={`bg-gray-900 p-6 rounded-xl shadow-md border-2 hover:shadow-lg transition-all cursor-pointer relative ${
                  isPaid 
                    ? 'border-green-500 hover:border-green-400 hover:shadow-green-500/20'
                    : isPending
                    ? 'border-yellow-500 hover:border-yellow-400 hover:shadow-yellow-500/20'
                    : hasNoPayment
                    ? 'border-gray-500 hover:border-gray-400 hover:shadow-gray-500/20'
                    : 'border-red-500 hover:border-red-400 hover:shadow-red-500/20'
                }`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onBookingClick(b, event);
                }}
                title="Click to view payment details"
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    onBookingClick(b);
                  }
                }}
              >
              {/* Payment Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(b)}`}>
                  {getPaymentStatusText(b)}
                </span>
              </div>

              <div className="flex justify-between items-start mb-3 pr-16">
                <h3 className="text-xl font-bold">{b.name}</h3>
              </div>
              
              <p className="text-sm text-gray-400 mb-1">{b.email}</p>
              <p className="text-sm text-gray-400 mb-1">📞 {b.phone} | 🌍 {b.country}</p>
              <p className="mb-2 italic text-sm text-gray-400">{b.instituteOrUniversity}</p>

              {/* Payment Record Info */}
              {b.paymentRecord?.id && (
                <p className="text-xs text-blue-300 mb-2">
                  💳 Payment Record ID: #{b.paymentRecord.id}
                </p>
              )}

              <div className="text-sm text-white space-y-1">
                <p>
                  <strong>Presentation:</strong> {b.pricingConfig.presentationType.type}{' '}
                  <span className="text-purple-300 font-semibold bg-gray-800 px-2 py-0.5 rounded-lg">
                    €{(b.pricingConfig.presentationType.price || 0).toFixed(2)}
                  </span>
                </p>

                {hasAccommodation && (
                  <p>
                    <strong>Accommodation:</strong>{' '}
                    {b.pricingConfig.accommodationOption?.guests} Guest(s),{' '}
                    {b.pricingConfig.accommodationOption?.nights} Night(s) —{' '}
                    <span className="text-yellow-300 font-semibold bg-gray-800 px-2 py-0.5 rounded-lg">
                      €{(b.pricingConfig.accommodationOption?.price || 0).toFixed(2)}
                    </span>
                  </p>
                )}

                <p>
                  <strong>Total Amount:</strong>{' '}
                  <span className={`font-bold px-3 py-1 rounded-md shadow-inner ${
                    isPaid 
                      ? 'text-green-300 bg-green-900/40' 
                      : isPending 
                      ? 'text-yellow-300 bg-yellow-900/40'
                      : 'text-gray-300 bg-gray-900/40'
                  }`}>
                    €{(b.pricingConfig.totalPrice || b.amountPaid || 0).toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <span>�</span>
                  <span>Click to view complete payment details</span>
                  <span>💳</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </section>
);

export default AdminBookings;