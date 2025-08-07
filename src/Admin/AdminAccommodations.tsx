import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import { WebsiteContext } from '../Context/WebsiteContext';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { BASE_URL } from '../config';
import { isAdmin } from '../lib/authUtils';
import AdminPaymentService from '../services/AdminPaymentService';
import { FaBed, FaUserFriends, FaEuroSign, FaCheckCircle, FaInfoCircle, FaMoneyBillWave, FaEdit, FaSave, FaTrashAlt, FaTimesCircle, FaPlus } from 'react-icons/fa';

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


const AdminAccommodations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const websiteContext = useContext(WebsiteContext);
  const website = websiteContext?.website || 'optics';



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

  // Modal state for edit/delete
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch all accommodations (admin endpoint, vertical aware)
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      let url = '';
      if (website === 'optics') {
        url = `${BASE_URL}/admin/api/admin/accommodation/optics`;
      } else if (website === 'renewable') {
        url = `${BASE_URL}/admin/api/admin/accommodation/renewable`;
      } else if (website === 'nursing') {
        url = `${BASE_URL}/admin/api/admin/accommodation/nursing`;
      } else if (website === 'polymers') {
        url = `${BASE_URL}/admin/api/admin/accommodation/polymers`;
      } else {
        url = `${BASE_URL}/admin/api/admin/accommodation/${website}`;
      }
      const response = await fetchWithAuth(url, { method: 'GET' });
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
      const response = await fetchWithAuth(`${BASE_URL}/admin/api/admin/registration-forms/${website}`, {
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

    // Only include paid bookings for revenue
    const paidBookings = bookingsForAccommodation.filter(form => form.paymentRecord?.id);
    const totalBookings = bookingsForAccommodation.length;
    // Revenue = price * number of paid bookings
    const acc = accommodations.find(a => a.id === accommodationId);
    const price = acc ? acc.price : 0;
    const totalRevenue = price * paidBookings.length;

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
      // Pass website to ensure correct vertical endpoint is used
      const paymentData = await AdminPaymentService.getPaymentById(paymentRecordId, website);
      return paymentData;
    } catch (err) {
      console.error('Error fetching payment details:', err);
      return null;
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
  }, [website]);

  // Add combo (admin endpoint, vertical aware)
  const addCombo = async () => {
    if (!nights || !guests || !price) {
      setError('All fields are required.');
      return;
    }
    try {
      let url = '';
      if (website === 'optics') {
        url = `${BASE_URL}/admin/api/admin/accommodation/optics`;
      } else if (website === 'renewable') {
        url = `${BASE_URL}/admin/api/admin/accommodation/renewable`;
      } else if (website === 'nursing') {
        url = `${BASE_URL}/admin/api/admin/accommodation/nursing`;
      } else if (website === 'polymers') {
        url = `${BASE_URL}/admin/api/admin/accommodation/polymers`;
      } else {
        url = `${BASE_URL}/admin/api/admin/accommodation/${website}`;
      }
      const response = await fetchWithAuth(url, {
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
      await fetchAccommodations();
      await fetchRegistrationForms();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Save edit (admin endpoint, vertical aware)
  const saveEdit = async () => {
    if (!nights || !guests || !price) {
      setError('All fields are required.');
      return;
    }
    try {
      let url = '';
      if (website === 'optics') {
        url = `${BASE_URL}/admin/api/admin/accommodation/edit/optics/${selectedAccommodation.id}`;
      } else if (website === 'renewable') {
        url = `${BASE_URL}/admin/api/admin/accommodation/edit/renewable/${selectedAccommodation.id}`;
      } else if (website === 'nursing') {
        url = `${BASE_URL}/admin/api/admin/accommodation/edit/nursing/${selectedAccommodation.id}`;
      } else if (website === 'polymers') {
        url = `${BASE_URL}/admin/api/admin/accommodation/edit/polymers/${selectedAccommodation.id}`;
      } else {
        url = `${BASE_URL}/admin/api/admin/accommodation/edit/${website}/${selectedAccommodation.id}`;
      }
      const response = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify({
          nights: parseInt(nights),
          guests: parseInt(guests),
          price: parseFloat(price)
        })
      });
      if (!response.ok) throw new Error('Failed to update combo');
      setEditModalOpen(false);
      setSelectedAccommodation(null);
      setNights('');
      setGuests('');
      setPrice('');
      await fetchAccommodations();
      await fetchRegistrationForms();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Open delete modal
  const handleDelete = (accommodation: AccommodationOption) => {
    setSelectedAccommodation(accommodation);
    setDeleteModalOpen(true);
  };

  // Confirm delete (admin endpoint, vertical aware)
  const confirmDelete = async () => {
    try {
      let url = '';
      if (website === 'optics') {
        url = `${BASE_URL}/admin/api/admin/accommodation/delete/optics/${selectedAccommodation.id}`;
      } else if (website === 'renewable') {
        url = `${BASE_URL}/admin/api/admin/accommodation/delete/renewable/${selectedAccommodation.id}`;
      } else if (website === 'nursing') {
        url = `${BASE_URL}/admin/api/admin/accommodation/delete/nursing/${selectedAccommodation.id}`;
      } else if (website === 'polymers') {
        url = `${BASE_URL}/admin/api/admin/accommodation/delete/polymers/${selectedAccommodation.id}`;
      } else {
        url = `${BASE_URL}/admin/api/admin/accommodation/delete/${website}/${selectedAccommodation.id}`;
      }
      const response = await fetchWithAuth(url, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to delete combo');
      setDeleteModalOpen(false);
      setSelectedAccommodation(null);
      await fetchAccommodations();
      setError(null);
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
      {/* Sidebar */}
      <div className="w-[250px] fixed top-0 left-0 h-full">
        <Sidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 ml-[250px] p-6">
        <h1 className="text-3xl font-bold text-green-400 mb-6 flex items-center gap-2">
          <FaBed className="inline-block mr-2" /> Accommodation Combinations
        </h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Add Combo Form */}
        <div className="bg-[#1a1a1a] border border-green-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl text-green-300 font-semibold mb-4 flex items-center gap-2">
            <FaBed className="inline-block" /> Add New Combo
          </h2>
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <FaBed />
              <input
                type="number"
                placeholder="Nights"
                className="bg-black border border-green-600 px-3 py-2 rounded-md text-white w-24"
                value={nights}
                onChange={e => setNights(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <FaUserFriends />
              <input
                type="number"
                placeholder="Guests"
                className="bg-black border border-green-600 px-3 py-2 rounded-md text-white w-24"
                value={guests}
                onChange={e => setGuests(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <FaEuroSign />
              <input
                type="number"
                placeholder="Price"
                className="bg-black border border-green-600 px-3 py-2 rounded-md text-white w-28"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <button
              onClick={addCombo}
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md"
            >
              Add
            </button>
          </div>
        </div>

        {/* Add Combo Button */}
        <div className="flex justify-end mb-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-1"
            onClick={() => {
              setNights('');
              setGuests('');
              setPrice('');
              setAddModalOpen(true);
            }}
          >
            <FaPlus /> Add Combo
          </button>
        </div>
        {/* Add Combo Modal */}
        {addModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-[#1a1a1a] text-white p-2 rounded-lg border border-green-600 shadow-lg w-[95%] max-w-lg max-h-[60vh] overflow-y-auto relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                onClick={() => setAddModalOpen(false)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2">
                <FaPlus className="mr-1" /> Add Combo
              </h2>
              <div className="mb-2 grid grid-cols-1 gap-2">
                <input
                  type="number"
                  placeholder="Nights"
                  value={nights}
                  onChange={e => setNights(e.target.value)}
                  className="bg-[#222] border border-green-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Guests"
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  className="bg-[#222] border border-green-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="bg-[#222] border border-green-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await addCombo();
                    setAddModalOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
                >
                  <FaSave /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-[#1a1a1a] border border-green-600 rounded-xl">
          <table className="min-w-full table-auto text-left text-sm">
            <thead>
              <tr className="bg-green-800 text-black">
                <th className="px-4 py-3">Nights</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {accommodations.map((acc) => (
                <tr key={acc.id} className="border-t border-green-700 hover:bg-green-900/10">
                  <td className="px-4 py-3">{acc.nights}</td>
                  <td className="px-4 py-3">{acc.guests}</td>
                  <td className="px-4 py-3">€{acc.price}</td>
                  <td className="px-4 py-3">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded flex items-center gap-1 text-xs"
                      title="Edit Combo"
                      onClick={() => {
                        setSelectedAccommodation(acc);
                        setNights(acc.nights.toString());
                        setGuests(acc.guests.toString());
                        setPrice(acc.price.toString());
                        setEditModalOpen(true);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs"
                      title="Delete Combo"
                      onClick={() => handleDelete(acc)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Combo Modal */}
        {editModalOpen && selectedAccommodation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-[#1a1a1a] text-white p-2 rounded-lg border border-green-600 shadow-lg w-[95%] max-w-lg max-h-[60vh] overflow-y-auto relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                onClick={() => setEditModalOpen(false)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2">
                <FaEdit className="mr-1" /> Edit Combo
              </h2>
              <div className="mb-2 grid grid-cols-1 gap-2">
                <input
                  type="number"
                  placeholder="Nights"
                  value={nights}
                  onChange={e => setNights(e.target.value)}
                  className="bg-[#222] border border-yellow-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Guests"
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  className="bg-[#222] border border-yellow-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="bg-[#222] border border-yellow-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await saveEdit();
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md flex items-center gap-1"
                >
                  <FaSave /> Save
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Modal */}
        {deleteModalOpen && selectedAccommodation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-[#1a1a1a] text-white p-2 rounded-lg border border-green-600 shadow-lg w-[95%] max-w-lg max-h-[60vh] overflow-y-auto relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                onClick={() => setDeleteModalOpen(false)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
                <FaTrashAlt className="mr-1" /> Delete Accommodation
              </h2>
              <p>Are you sure you want to delete this accommodation combo?</p>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await confirmDelete();
                    setDeleteModalOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-1"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccommodations;
