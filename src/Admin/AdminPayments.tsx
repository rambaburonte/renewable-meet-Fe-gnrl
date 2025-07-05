import { useState, useEffect } from 'react';
import Sidebar from './AdminSidebar';
import PaymentDetailsModal from './PaymentDetailsModal';
import { isAdmin } from '../lib/authUtils';
import AdminPaymentService from '../services/AdminPaymentService';
import { FaMoneyBillWave, FaCheckCircle, FaSpinner, FaTimesCircle, FaClock, FaSearch, FaSyncAlt, FaClipboard, FaCopy, FaExclamationCircle } from 'react-icons/fa';

// Types for payment data
interface PaymentRecord {
  id: number;
  sessionId: string;
  paymentIntentId?: string;
  customerEmail: string;
  amountTotalEuros: number;
  amountTotalCents: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  paymentStatus: string;
  stripeCreatedAt: string;
  stripeExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  pricingConfigId?: number;
  pricingConfigTotalPrice?: number;
  customerName?: string;
  customerInstitute?: string;
  customerCountry?: string;
  registrationType?: string;
  presentationType?: string;
  presentationPrice?: number;
  processingFeePercent?: number;
}

interface PaymentStats {
  totalRecords: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  expiredPayments: number;
  totalAmountInEuros: number;
  totalAmountInDollars: number;
  totalAmountInEurosAsDouble: number;
}

const AdminPayments = () => {
  // Role check
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

  // State management
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [allPayments, setAllPayments] = useState<PaymentRecord[]>([]); // Store all payments for revenue calculation
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchSession, setSearchSession] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch payment statistics
  const fetchStats = async () => {
    try {
      const statsData = await AdminPaymentService.getPaymentStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await AdminPaymentService.getAllPayments();
      const paymentsArray = Array.isArray(data) ? data : [];
      setPayments(paymentsArray);
      setAllPayments(paymentsArray); // Store all payments for revenue calculation
    } catch (err) {
      setError('Failed to fetch payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payments by status
  const fetchPaymentsByStatus = async (status: string) => {
    if (status === 'ALL') {
      fetchPayments();
      return;
    }
    
    try {
      setLoading(true);
      const data = await AdminPaymentService.getPaymentsByStatus(status);
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Failed to fetch ${status} payments`);
      console.error('Error fetching payments by status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search by customer email
  const searchByEmail = async () => {
    if (!searchEmail.trim()) {
      setError(null);
      setSelectedStatus('ALL');
      setSearchSession('');
      fetchPayments(); // Reset to all payments if input is empty
      return;
    }
    setSelectedStatus('ALL'); // Reset status filter
    setSearchSession(''); // Clear session search
    try {
      setLoading(true);
      setError(null);
      const data = await AdminPaymentService.searchByEmail(searchEmail.trim());
      let result = Array.isArray(data) ? data : data ? [data] : [];
      // If no results, try client-side substring match
      if (result.length === 0 && allPayments.length > 0) {
        const searchLower = searchEmail.trim().toLowerCase();
        result = allPayments.filter(p => p.customerEmail && p.customerEmail.toLowerCase().includes(searchLower));
      }
      setPayments(result);
      if (result.length === 0) {
        setError(`No payments found for email: ${searchEmail}`);
      }
    } catch (err) {
      setError(`Failed to search for email: ${searchEmail}`);
      console.error('Error searching by email:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search by session ID
  const searchBySession = async () => {
    if (!searchSession.trim()) return;
    
    try {
      setLoading(true);
      const data = await AdminPaymentService.searchBySession(searchSession);
      // Backend returns single object for session search, not array
      setPayments(data ? [data] : []);
    } catch (err) {
      setError('Failed to find payment session');
      console.error('Error searching by session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Expire stale payments
  const expireStalePayments = async () => {
    try {
      await AdminPaymentService.expireStalePayments();
      alert(`Expired stale payments successfully`);
      fetchPayments(); // Refresh the list
    } catch (err) {
      alert('Failed to expire stale payments');
      console.error('Error expiring stale payments:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchStats();
    fetchPayments();
  }, []);

  // Handle status filter change
  useEffect(() => {
    fetchPaymentsByStatus(selectedStatus);
  }, [selectedStatus]);

  // Format currency helper
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    if (!amount && amount !== 0) return 'N/A';
    
    try {
      return new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency: currency.toUpperCase(),
      }).format(amount);
    } catch (error) {
      // Fallback if currency is invalid
      return `€${amount.toFixed(2)}`;
    }
  };

  // Show payment details modal
  const showPaymentDetails = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedPayment(null);
    setShowModal(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2 flex items-center gap-2"><FaMoneyBillWave /> Payment Records</h1>
          <p className="text-gray-400">Manage and monitor all payment transactions</p>
        </header>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-[#1a1a1a] border border-green-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2"><FaClipboard /> Total Payments</h3>
              <p className="text-3xl font-bold text-white">{stats.totalRecords}</p>
              <p className="text-xs text-gray-400">All status types</p>
            </div>
            <div className="bg-[#1a1a1a] border border-green-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2"><FaMoneyBillWave /> Total Revenue</h3>
              <p className="text-3xl font-bold text-white">
                {(() => {
                  // Calculate revenue only from completed payments using ALL payments, not filtered ones
                  const completedRevenue = allPayments
                    .filter(payment => payment.status === 'COMPLETED')
                    .reduce((total, payment) => total + (payment.amountTotalEuros || 0), 0);
                  return formatCurrency(completedRevenue, 'EUR');
                })()}
              </p>
              <p className="text-xs text-gray-400">Completed payments only</p>
            </div>
            <div className="bg-[#1a1a1a] border border-green-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2"><FaCheckCircle className="text-green-400" /> Completed</h3>
              <p className="text-3xl font-bold text-green-400">{stats.completedPayments}</p>
              <p className="text-xs text-gray-400">Successfully paid</p>
            </div>
            <div className="bg-[#1a1a1a] border border-yellow-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2 flex items-center gap-2"><FaSpinner className="animate-spin" /> Pending</h3>
              <p className="text-3xl font-bold text-yellow-400">{stats.pendingPayments}</p>
              <p className="text-xs text-gray-400">Awaiting payment</p>
            </div>
            <div className="bg-[#1a1a1a] border border-red-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-300 mb-2 flex items-center gap-2"><FaTimesCircle /> Failed</h3>
              <p className="text-3xl font-bold text-red-400">{stats.failedPayments}</p>
              <p className="text-xs text-gray-400">Failed transactions</p>
            </div>
            <div className="bg-[#1a1a1a] border border-orange-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-300 mb-2 flex items-center gap-2"><FaClock /> Expired</h3>
              <p className="text-3xl font-bold text-orange-400">{stats.expiredPayments}</p>
              <p className="text-xs text-gray-400">Expired sessions</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-[#1a1a1a] border border-green-600 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-green-300 mb-2">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-green-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            {/* Email Search */}
            <div>
              <label className="block text-sm font-medium text-green-300 mb-2">Search by Email</label>
              <div className="flex">
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => {
                    setSearchEmail(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') searchByEmail();
                  }}
                  placeholder="customer@example.com"
                  className="flex-1 bg-[#2a2a2a] border border-green-600 rounded-l-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  disabled={loading}
                />
                <button
                  onClick={searchByEmail}
                  className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-r-lg transition-colors flex items-center gap-1"
                  disabled={loading}
                  title="Search by Email"
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* Session Search */}
            <div>
              <label className="block text-sm font-medium text-green-300 mb-2">Search by Session ID</label>
              <div className="flex">
                <input
                  type="text"
                  value={searchSession}
                  onChange={(e) => setSearchSession(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      searchBySession();
                    }
                  }}
                  placeholder="cs_test_..."
                  className="flex-1 bg-[#2a2a2a] border border-green-600 rounded-l-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={searchBySession}
                  className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-r-lg transition-colors flex items-center gap-1"
                  title="Search by Session ID"
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div>
              <label className="block text-sm font-medium text-green-300 mb-2">Actions</label>
              <div className="space-y-2">
                <button
                  onClick={() => fetchPayments()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                >
                  <FaSyncAlt /> Refresh
                </button>
                <button
                  onClick={expireStalePayments}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                >
                  <FaClock /> Expire Stale
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6 flex items-center gap-2">
            <FaExclamationCircle className="text-red-400 text-xl" />
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-sm text-red-300 hover:text-red-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-green-400 text-5xl mx-auto mb-4" />
            <p className="mt-4 text-gray-400">Loading payments...</p>
          </div>
        )}

        {/* Payment Records Table */}
        {!loading && payments.length > 0 && (
          <div className="bg-[#1a1a1a] border border-green-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2a2a2a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">Customer Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">Amount & Currency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">Session Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-white font-bold">#{payment.id}</div>
                        {payment.paymentIntentId && (
                          <div className="text-xs text-blue-300 mt-1">
                            Intent: {payment.paymentIntentId.substring(0, 20)}...
                          </div>
                        )}
                        {payment.pricingConfigId && (
                          <div className="text-xs text-purple-300 mt-1">
                            Config: #{payment.pricingConfigId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-white font-medium">{payment.customerEmail}</div>
                        {payment.customerName && (
                          <div className="text-green-300 text-sm mt-1">{payment.customerName}</div>
                        )}
                        {payment.customerInstitute && (
                          <div className="text-xs text-gray-400">{payment.customerInstitute}</div>
                        )}
                        {payment.customerCountry && (
                          <div className="text-xs text-blue-300 mt-1">{payment.customerCountry}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-white font-bold text-lg">
                          {formatCurrency(payment.amountTotalEuros, payment.currency)}
                        </div>
                        <div className="text-xs text-gray-400">{payment.currency.toUpperCase()}</div>
                        {payment.pricingConfigTotalPrice && (
                          <div className="text-xs text-yellow-300 mt-1">
                            Config: €{payment.pricingConfigTotalPrice.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold mb-2 flex items-center gap-1 ${
                          payment.status === 'COMPLETED' ? 'bg-green-500 text-green-900' :
                          payment.status === 'PENDING' ? 'bg-yellow-500 text-yellow-900' :
                          payment.status === 'FAILED' ? 'bg-red-500 text-red-900' :
                          payment.status === 'CANCELLED' ? 'bg-gray-500 text-gray-900' :
                          'bg-orange-500 text-orange-900'
                        }`}>
                          {payment.status === 'COMPLETED' && <FaCheckCircle className="mr-1" />}
                          {payment.status === 'PENDING' && <FaSpinner className="animate-spin mr-1" />}
                          {payment.status === 'FAILED' && <FaTimesCircle className="mr-1" />}
                          {payment.status === 'CANCELLED' && <FaTimesCircle className="mr-1" />}
                          {payment.status === 'EXPIRED' && <FaClock className="mr-1" />}
                          {payment.status}
                        </div>
                        <div className="text-xs text-gray-300">
                          Stripe: {payment.paymentStatus}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-white font-mono text-xs mb-1">
                          {payment.sessionId.substring(0, 25)}...
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(payment.sessionId);
                            alert('Session ID copied!');
                          }}
                          className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                          title="Copy full session ID"
                        >
                          <FaCopy /> Copy Full ID
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => showPaymentDetails(payment)}
                            className="bg-green-500 hover:bg-green-600 text-black px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                            title="View Complete Details"
                          >
                            <FaClipboard /> Full Details
                          </button>
                          <button
                            onClick={() => {
                              const fullDetails = `
PAYMENT DETAILS #${payment.id}
Session: ${payment.sessionId}
Customer: ${payment.customerEmail}
Amount: ${formatCurrency(payment.amountTotalEuros, payment.currency)}
Status: ${payment.status}
Stripe Status: ${payment.paymentStatus}
Created: ${formatDate(payment.createdAt)}
${payment.customerName ? `Customer Name: ${payment.customerName}` : ''}
${payment.customerInstitute ? `Institute: ${payment.customerInstitute}` : ''}
${payment.paymentIntentId ? `Payment Intent: ${payment.paymentIntentId}` : ''}
                              `;
                              navigator.clipboard.writeText(fullDetails);
                              alert('Payment details copied to clipboard!');
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                            title="Copy All Details"
                          >
                            <FaCopy /> Copy All
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Results Info */}
            <div className="bg-[#2a2a2a] px-6 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {payments.length} payment{payments.length !== 1 ? 's' : ''}
              </div>
              <button
                onClick={fetchPayments}
                className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-black transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && payments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No payment records found</p>
            <button
              onClick={() => {
                setSelectedStatus('ALL');
                setSearchEmail('');
                setSearchSession('');
                fetchPayments();
              }}
              className="mt-4 bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        payment={selectedPayment}
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  );
};

export default AdminPayments;
