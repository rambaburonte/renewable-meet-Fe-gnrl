import React, { useState, useEffect } from 'react';
import { FaSyncAlt } from 'react-icons/fa';

interface RegisterFormData {
  title: string;
  name: string;
  phone: string;
  email: string;
  institute: string;
  country: string;
  registrationType: string;
  presentationType: string;
  guests: number;
  nights: number;
  accompanyingPerson: boolean;
  extraNights: number;
  captcha: string;
}

interface PricingConfig {
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
}

const Style: React.FC = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

      * {
        font-family: 'IBM Plex Sans', sans-serif;
      }

      .form-input, .form-select {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 1rem;
        color: #1f2937;
        transition: border-color 0.2s ease;
      }
      .form-input:focus, .form-select:focus {
        outline: none;
        border-color: #000;
      }
      .form-input.error, .form-select.error {
        border-color: #ef4444;
      }
      .error-text {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      .custom-checkbox {
        width: 1.5rem;
        height: 1.5rem;
        border: 2px solid #1f2937;
        border-radius: 0.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
      }
      .custom-checkbox.checked {
        background-color: #1f2937;
        border-color: #1f2937;
      }
      .custom-checkbox.checked::before {
        content: '✔';
        color: #fff;
        font-size: 1rem;
        font-weight: bold;
      }
      .radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .radio-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }
      .radio-input {
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid #1f2937;
        border-radius: 50%;
        appearance: none;
        cursor: pointer;
      }
      .radio-input:checked {
        background-color: #1f2937;
        border-color: #1f2937;
        position: relative;
      }
      .radio-input:checked::before {
        content: '';
        width: 0.5rem;
        height: 0.5rem;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .payment-summary {
        border-top: 2px dashed #1f2937;
        padding-top: 1.5rem;
        margin-top: 2rem;
      }
      .captcha-section {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border: 1px solid #cbd5e1;
        border-radius: 1rem;
        padding: 1.5rem;
        margin-top: 1.5rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      }
      .captcha-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .captcha-display {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: #ffffff;
        padding: 1rem;
        border-radius: 0.75rem;
        border: 2px solid #e2e8f0;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
      }
      .captcha-image {
        font-size: 1.75rem;
        font-weight: 700;
        letter-spacing: 0.2em;
        background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
        color: #ffffff;
        padding: 0.75rem 1.25rem;
        border-radius: 0.5rem;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        font-family: 'Courier New', monospace;
        user-select: none;
        min-width: 120px;
        text-align: center;
        position: relative;
      }
      .captcha-image::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="20" cy="20" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        border-radius: 0.5rem;
        pointer-events: none;
      }
      .refresh-button {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        border: none;
        color: white;
        padding: 0.75rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 44px;
        height: 44px;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
      }
      .refresh-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
      .refresh-button:active {
        transform: translateY(0);
      }
      .captcha-input-container {
        position: relative;
      }
      .captcha-input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-weight: 500;
        color: #1e293b;
        background: #ffffff;
        transition: all 0.2s ease;
        letter-spacing: 0.1em;
      }
      .captcha-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .captcha-input.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
      .captcha-label {
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.5rem;
        display: block;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .captcha-help-text {
        font-size: 0.75rem;
        color: #64748b;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .security-icon {
        width: 1rem;
        height: 1rem;
        color: #64748b;
      }
      .accommodation-selectors {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .info-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        padding: 1rem;
        background-color: #f9fafb;
        border-radius: 0.5rem;
      }
      .info-item {
        text-align: center;
      }
      .info-item label {
        font-weight: 600;
        color: #1f2937;
      }
      .info-item p {
        color: #4b5563;
      }
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .modal-content {
        background-color: white;
        padding: 2rem;
        border-radius: 0.5rem;
        text-align: center;
      }
      .modal-button {
        background-color: #4db6ac;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
        cursor: pointer;
        border: none;
      }
    `}
  </style>
);

const Register: React.FC<{
  captchaCode: string;
  generateCaptcha: () => void;
  setRegisterFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  registerFormData: RegisterFormData;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
}> = ({ captchaCode, generateCaptcha, setRegisterFormData, registerFormData, setShowModal, resetForm }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pricing, setPricing] = useState<PricingConfig[] | null>(null);
  const [pricingError, setPricingError] = useState<string>('');

  const fetchPricing = async () => {
    if (!registerFormData.registrationType || !registerFormData.presentationType) {
      setPricing(null);
      return;
    }

    try {
      const response = await fetch('https://renewable-be.onrender.com/api/registration/get-pricing-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationType: registerFormData.registrationType === 'registrationAndAccommodation'
            ? 'REGISTRATION_AND_ACCOMMODATION'
            : 'REGISTRATION_ONLY',
          presentationType: registerFormData.presentationType.toUpperCase(),
          numberOfNights: registerFormData.nights,
          numberOfGuests: registerFormData.guests,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPricing(data);
        setPricingError('');
      } else {
        setPricingError('Failed to fetch pricing information');
        setPricing(null);
      }
    } catch (error) {
      setPricingError('Error fetching pricing information');
      setPricing(null);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [registerFormData.registrationType, registerFormData.presentationType, registerFormData.nights, registerFormData.guests]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setRegisterFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (name: string, value: number) => {
    setRegisterFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!registerFormData.title) newErrors.title = 'Title is required';
    if (!registerFormData.name) newErrors.name = 'Name is required';
    if (!registerFormData.phone) newErrors.phone = 'Phone is required';
    if (!registerFormData.email) newErrors.email = 'Email is required';
    if (!registerFormData.institute) newErrors.institute = 'Institute is required';
    if (!registerFormData.country) newErrors.country = 'Country is required';
    if (!registerFormData.registrationType) newErrors.registrationType = 'Registration type is required';
    if (!registerFormData.presentationType) newErrors.presentationType = 'Presentation type is required';
    if (!registerFormData.captcha) newErrors.captcha = 'Captcha is required';
    if (registerFormData.captcha && registerFormData.captcha !== captchaCode) {
      newErrors.captcha = 'Captcha is incorrect';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('https://renewable-be.onrender.com/api/registration/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...registerFormData,
          registrationType: registerFormData.registrationType === 'registrationAndAccommodation'
            ? 'REGISTRATION_AND_ACCOMMODATION'
            : 'REGISTRATION_ONLY',
          presentationType: registerFormData.presentationType.toUpperCase(),
        }),
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="info-section">
        <div className="info-item">
          <label>Conference Date</label>
          <p>April 17-19, 2026</p>
        </div>
        <div className="info-item">
          <label>Location</label>
          <p>Dubai, UAE</p>
        </div>
        <div className="info-item">
          <label>Registration Deadline</label>
          <p>March 30, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <select
            name="title"
            value={registerFormData.title}
            onChange={handleInputChange}
            className={`form-select ${errors.title ? 'error' : ''}`}
          >
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
          </select>
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            value={registerFormData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className={`form-input ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={registerFormData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            className={`form-input ${errors.phone ? 'error' : ''}`}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            value={registerFormData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className={`form-input ${errors.email ? 'error' : ''}`}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institute/Organization *</label>
          <input
            type="text"
            name="institute"
            value={registerFormData.institute}
            onChange={handleInputChange}
            placeholder="Enter your institute/organization"
            className={`form-input ${errors.institute ? 'error' : ''}`}
          />
          {errors.institute && <p className="error-text">{errors.institute}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <input
            type="text"
            name="country"
            value={registerFormData.country}
            onChange={handleInputChange}
            placeholder="Enter your country"
            className={`form-input ${errors.country ? 'error' : ''}`}
          />
          {errors.country && <p className="error-text">{errors.country}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Registration Type *</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="registrationType"
              value="registrationOnly"
              checked={registerFormData.registrationType === 'registrationOnly'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Registration Only</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="registrationType"
              value="registrationAndAccommodation"
              checked={registerFormData.registrationType === 'registrationAndAccommodation'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Registration + Accommodation</span>
          </label>
        </div>
        {errors.registrationType && <p className="error-text">{errors.registrationType}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Presentation Type *</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="presentationType"
              value="speaker"
              checked={registerFormData.presentationType === 'speaker'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Speaker</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="presentationType"
              value="poster"
              checked={registerFormData.presentationType === 'poster'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Poster</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="presentationType"
              value="listener/delegate"
              checked={registerFormData.presentationType === 'listener/delegate'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Listener/Delegate</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="presentationType"
              value="sponsor"
              checked={registerFormData.presentationType === 'sponsor'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Sponsor</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="presentationType"
              value="student"
              checked={registerFormData.presentationType === 'student'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Student</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="presentationType"
              value="exhibitor"
              checked={registerFormData.presentationType === 'exhibitor'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Exhibitor</span>
          </label>
        </div>
        {errors.presentationType && <p className="error-text">{errors.presentationType}</p>}
      </div>

      {registerFormData.registrationType === 'registrationAndAccommodation' && (
        <div className="accommodation-selectors">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
            <select
              name="guests"
              value={registerFormData.guests}
              onChange={handleInputChange}
              className="form-select"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Nights</label>
            <select
              name="nights"
              value={registerFormData.nights}
              onChange={handleInputChange}
              className="form-select"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Night{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="captcha-section">
        <div className="captcha-container">
          <label className="captcha-label">Security Verification</label>
          <div className="captcha-display">
            <div className="captcha-image">{captchaCode}</div>
            <button type="button" onClick={generateCaptcha} className="refresh-button" title="Generate new captcha">
              <FaSyncAlt />
            </button>
          </div>
          <div className="captcha-input-container">
            <input
              type="text"
              name="captcha"
              value={registerFormData.captcha}
              onChange={handleInputChange}
              placeholder="Enter the code shown above"
              className={`captcha-input ${errors.captcha ? 'error' : ''}`}
              autoComplete="off"
              maxLength={6}
            />
            <div className="captcha-help-text">
              <svg className="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Please enter the 6-character code to verify you're human
            </div>
          </div>
          {errors.captcha && <p className="error-text">{errors.captcha}</p>}
        </div>
      </div>

      {pricing && pricing.length > 0 && (
        <div className="payment-summary">
          <h3 className="text-lg font-semibold mb-4">Pricing Summary</h3>
          {pricing.map((config, index) => (
            <div key={config.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{config.presentationType.type}</span>
                <span className="font-bold">${config.presentationType.price}</span>
              </div>
              {config.accommodationOption && (
                <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                  <span>Accommodation ({config.accommodationOption.nights} nights, {config.accommodationOption.guests} guests)</span>
                  <span>${config.accommodationOption.price}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Processing Fee ({config.processingFeePercent}%)</span>
                <span>${(config.totalPrice * config.processingFeePercent / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>${config.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {pricingError && (
        <div className="text-red-500 text-sm">{pricingError}</div>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Register Now
        </button>
      </div>
    </form>
  );
};

const RegistrationPage: React.FC = () => {
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    title: '',
    name: '',
    phone: '',
    email: '',
    institute: '',
    country: '',
    registrationType: '',
    presentationType: '',
    guests: 1,
    nights: 1,
    accompanyingPerson: false,
    extraNights: 0,
    captcha: '',
  });

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaCode(result);
    setRegisterFormData((prev) => ({ ...prev, captcha: '' }));
  };

  const resetForm = () => {
    setRegisterFormData({
      title: '',
      name: '',
      phone: '',
      email: '',
      institute: '',
      country: '',
      registrationType: '',
      presentationType: '',
      guests: 1,
      nights: 1,
      accompanyingPerson: false,
      extraNights: 0,
      captcha: '',
    });
    generateCaptcha();
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="pt-20">
      <Style />
      <section className="bg-gradient-to-b from-gray-50 py-8 to-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-black bg-gray-200 rounded-full mb-4">
              REGISTRATION OPEN
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Conference Registration
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Register for the Renewable Energy Summit 2026
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <Register
              captchaCode={captchaCode}
              generateCaptcha={generateCaptcha}
              setRegisterFormData={setRegisterFormData}
              registerFormData={registerFormData}
              setShowModal={setShowModal}
              resetForm={resetForm}
            />
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="text-xl font-semibold mb-4">Registration Successful!</h3>
            <p className="mb-4">Thank you for registering for the Renewable Energy Summit 2026.</p>
            <button
              className="modal-button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
