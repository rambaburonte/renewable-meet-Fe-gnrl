import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Add useLocation
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

interface AbstractFormData {
  title: string;
  name: string;
  phone: string;
  email: string;
  organization: string;
  interestedIn: string;
  session: string;
  country: string;
  abstractFile: File | null;
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
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
        background: #f0fdfa;
        border-radius: 0.75rem;
        padding: 1rem;
        box-shadow: 0 2px 8px #e0f2f1;
      }
      .captcha-image {
        font-size: 2rem;
        letter-spacing: 0.3em;
        font-weight: 700;
        background: linear-gradient(90deg,#4db6ac 30%,#fff 100%);
        color: #222;
        border: 2px dashed #4db6ac;
        padding: 0.75rem 1.5rem;
        border-radius: 0.75rem;
        text-shadow: 1px 1px 2px #b2dfdb;
      }
      .refresh-button {
        background: #fff;
        border: 2px solid #4db6ac;
        color: #4db6ac;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 1.5rem;
        margin-left: 0.5rem;
        transition: transform 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .refresh-button:hover {
        transform: rotate(90deg);
      }
      .accommodation-selectors {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .tabs {
        display: flex;
        border-bottom: 2px solid #e5e7eb;
        margin-bottom: 2rem;
      }
      .tab {
        flex: 1;
        text-align: center;
        padding: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .tab.active {
        background-color: #4db6ac;
        color: white;
        border-radius: 0.5rem 0.5rem 0 0;
      }
      .tab:hover:not(.active) {
        background-color: #f3f4f6;
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
      .file-input {
        padding: 0.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        width: 100%;
      }
      .file-preview {
        margin-top: 0.5rem;
        color: #4b5563;
        font-size: 0.875rem;
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
      }
      .button-group {
        display: flex;
        gap: 1rem;
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

      if (!response.ok) {
        throw new Error('Failed to fetch pricing');
      }

      const data: PricingConfig[] = await response.json();
      setPricing(data);
      setPricingError('');
    } catch (error) {
      console.error('Error fetching pricing:', error);
      setPricing(null);
      setPricingError('Unable to load pricing details. Please try again.');
    }
  };

  const handleRegistration = async () => {
    if (!pricing || pricing.length === 0) {
      alert('Pricing details are not available. Please try again.');
      return;
    }

    try {
      const response = await fetch('https://renewable-be.onrender.com/api/registration/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${registerFormData.title} ${registerFormData.name}`,
          phone: registerFormData.phone,
          email: registerFormData.email,
          instituteOrUniversity: registerFormData.institute,
          country: registerFormData.country,
          pricingConfig: {
            id: pricing[0].id
          },
          amountPaid: pricing[0].totalPrice
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setShowModal(true);
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [
    registerFormData.registrationType,
    registerFormData.presentationType,
    registerFormData.nights,
    registerFormData.guests,
  ]);

  const validateField = (name: string, value: string | number) => {
    let error = '';
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) {
      error = 'Invalid email format';
    }
    if (name === 'phone' && value && !/^\+?\d{10,15}$/.test(value.toString())) {
      error = 'Phone number must be 10-15 digits';
    }
    if (['title', 'name', 'institute', 'country', 'registrationType'].includes(name) && !value) {
      error = 'This field is required';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // If registrationType is changed to registrationOnly, reset guests and nights to 1
    if (name === 'registrationType' && value === 'registrationOnly') {
      setRegisterFormData((prev) => ({
        ...prev,
        [name]: value,
        guests: 1,
        nights: 1,
      }));
      validateField(name, value);
      return;
    }
    setRegisterFormData((prev) => ({ ...prev, [name]: parseInt(value) || value }));
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};
    Object.keys(registerFormData).forEach((key) => {
      validateField(key, registerFormData[key as keyof RegisterFormData] as string | number);
      if (['title', 'name', 'phone', 'email', 'institute', 'country', 'registrationType'].includes(key) && !registerFormData[key as keyof RegisterFormData]) {
        validationErrors[key] = 'This field is required';
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (registerFormData.captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      alert('Invalid CAPTCHA code');
      return;
    }

    handleRegistration();
  };

  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Title *
        </label>
        <select
          name="title"
          value={registerFormData.title}
          onChange={handleChange}
          required
          className={`form-select ${errors.title ? 'error' : ''}`}
        >
          <option value="">Title</option>
          <option value="Mr">Mr.</option>
          <option value="Ms">Ms.</option>
          <option value="Dr">Dr.</option>
          <option value="Prof">Prof.</option>
        </select>
        {errors.title && <p className="error-text">{errors.title}</p>}
      </div>



      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Name *
        </label>
        <input
          name="name"
          placeholder="Name"
          value={registerFormData.name}
          onChange={handleChange}
          required
          className={`form-input ${errors.name ? 'error' : ''}`}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Phone *
        </label>
        <input
          name="phone"
          placeholder="Phone"
          value={registerFormData.phone}
          onChange={handleChange}
          required
          className={`form-input ${errors.phone ? 'error' : ''}`}
        />
        {errors.phone && <p className="error-text">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email *
        </label>
        <input
          name="email"
          placeholder="Email"
          value={registerFormData.email}
          onChange={handleChange}
          required
          className={`form-input ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Institute/University *
        </label>
        <input
          name="institute"
          placeholder="Institute/University"
          value={registerFormData.institute}
          onChange={handleChange}
          required
          className={`form-input ${errors.institute ? 'error' : ''}`}
        />
        {errors.institute && <p className="error-text">{errors.institute}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Country *
        </label>
        <select
          name="country"
          value={registerFormData.country}
          onChange={handleChange}
          required
          className={`form-select ${errors.country ? 'error' : ''}`}
        >
          <option value="">Choose Country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
          <option value="au">Australia</option>
          <option value="de">Germany</option>
          <option value="fr">France</option>
          <option value="other">Other</option>
        </select>
        {errors.country && <p className="error-text">{errors.country}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Registration Type *
        </label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="registrationType"
              value="registrationOnly"
              onChange={handleChange}
              className="radio-input"
              required
            />
            Registration Only
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="registrationType"
              value="registrationAndAccommodation"
              onChange={handleChange}
              className="radio-input"
            />
            Registration and Accommodation
          </label>
        </div>
        {errors.registrationType && <p className="error-text">{errors.registrationType}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Presentation Type
        </label>
        <div className="radio-group">
          {['Speaker', 'Poster', 'Listener/Delegate', 'Sponsor', 'Student', 'Exhibitor'].map((type) => (
            <label key={type} className="radio-label">
              <input
                type="radio"
                name="presentationType"
                value={type.toLowerCase()}
                onChange={handleChange}
                className="radio-input"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Accommodation Type
        </label>
        <div className="accommodation-selectors">
          <select
            name="nights"
            value={registerFormData.nights}
            onChange={handleChange}
            className="form-select w-32"
            disabled={registerFormData.registrationType === 'registrationOnly'}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((night) => (
              <option key={night} value={night}>
                {night} Night{night > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <select
            name="guests"
            value={registerFormData.guests}
            onChange={handleChange}
            className="form-select w-32"
            disabled={registerFormData.registrationType === 'registrationOnly'}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((guest) => (
              <option key={guest} value={guest}>
                {guest} Guest{guest > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="payment-summary">
        <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>
        {pricingError && <p className="error-text mb-2">{pricingError}</p>}
        <div className="flex justify-between mb-2">
          <span>Registration Fee:</span>
          <span>{pricing && pricing[0]?.presentationType?.price ? `$${pricing[0].presentationType.price.toFixed(2)}` : 'TBD'}</span>
        </div>
        {/* Only show accommodation fee if registrationType is not 'registrationOnly' and accommodationOption exists */}
        {registerFormData.registrationType !== 'registrationOnly' && pricing && pricing[0]?.accommodationOption && (
          <div className="flex justify-between mb-2">
            <span>Accommodation Fee:</span>
            <span>{`$${pricing[0].accommodationOption.price.toFixed(2)}`}</span>
          </div>
        )}
        <div className="flex justify-between mb-2">
          <span>Processing Fee ({pricing && pricing[0]?.processingFeePercent ? pricing[0].processingFeePercent : 0}%):</span>
          <span>{pricing && pricing[0]?.totalPrice ? `$${(pricing[0].totalPrice - (pricing[0].presentationType.price + (pricing[0].accommodationOption?.price || 0))).toFixed(2)}` : 'TBD'}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Total Amount Payable in $:</span>
          <span>{pricing && pricing[0]?.totalPrice ? `$${pricing[0].totalPrice.toFixed(2)}` : 'TBD'}</span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          By clicking "Pay Now", you confirm that you have read the terms and conditions, that you understand them and that you agree to be bound by them.
        </p>

        <div className="captcha-section" style={{ background: '#f0fdfa', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 2px 8px #e0f2f1' }}>
          <span className="captcha-image" style={{ fontSize: '2rem', letterSpacing: '0.3em', fontWeight: 700, background: 'linear-gradient(90deg,#4db6ac 30%,#fff 100%)', color: '#222', border: '2px dashed #4db6ac', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', textShadow: '1px 1px 2px #b2dfdb' }}>{captchaCode}</span>
          <span style={{ fontWeight: 600, color: '#333' }}>Enter the code above here:</span>
          <input
            name="captcha"
            value={registerFormData.captcha}
            onChange={handleChange}
            required
            className="form-input w-32"
            style={{ fontSize: '1.2rem', border: '2px solid #4db6ac', borderRadius: '0.5rem', padding: '0.5rem 1rem', background: '#fff' }}
          />
          <button
            type="button"
            className="refresh-button flex items-center justify-center"
            onClick={generateCaptcha}
            style={{ background: '#fff', border: '2px solid #4db6ac', color: '#4db6ac', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '1.5rem', marginLeft: '0.5rem', transition: 'transform 0.2s' }}
            title="Refresh Captcha"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      <div className="pt-4 button-group">
        <button
          type="button"
          onClick={resetForm}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all"
        >
          Reset Form
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all"
        >
          Pay Now
        </button>
      </div>
    </form>
  );
};

const AbstractRegistration: React.FC<{
  captchaCode: string;
  generateCaptcha: () => void;
  setAbstractFormData: React.Dispatch<React.SetStateAction<AbstractFormData>>;
  abstractFormData: AbstractFormData;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
}> = ({ captchaCode, generateCaptcha, setAbstractFormData, abstractFormData, setShowModal, resetForm }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [interestedInOptions, setInterestedInOptions] = useState<{ id: string; option_name: string }[]>([]);
  const [sessionOptions, setSessionOptions] = useState<{ id: string; sessionName: string }[]>([]);

  useEffect(() => {
    // Fetch interested in options
    fetch('https://renewable-be.onrender.com/api/form-submission/get-interested-in-options')
      .then(res => res.json())
      .then(data => setInterestedInOptions(data || []))
      .catch(() => setInterestedInOptions([]));
    // Fetch session options
    fetch('https://renewable-be.onrender.com/api/form-submission/get-session-options')
      .then(res => res.json())
      .then(data => setSessionOptions(data || []))
      .catch(() => setSessionOptions([]));
  }, []);

  // Captcha auto-refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      generateCaptcha();
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, [generateCaptcha]);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Invalid email format';
    }
    if (name === 'phone' && value && !/^\+?\d{10,15}$/.test(value)) {
      error = 'Phone number must be 10-15 digits';
    }
    if (['title', 'name', 'email', 'phone'].includes(name) && !value) {
      error = 'This field is required';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAbstractFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAbstractFormData((prev) => ({ ...prev, abstractFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};
    Object.keys(abstractFormData).forEach((key) => {
      if (["title", "name", "email", "phone"].includes(key) && !abstractFormData[key as keyof AbstractFormData]) {
        validationErrors[key] = "This field is required";
      }
      validateField(key, abstractFormData[key as keyof AbstractFormData] as string);
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (abstractFormData.captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      alert("Invalid CAPTCHA code");
      return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append("titlePrefix", abstractFormData.title);
    formData.append("name", abstractFormData.name);
    formData.append("email", abstractFormData.email);
    formData.append("phone", abstractFormData.phone);
    formData.append("organizationName", abstractFormData.organization);
    // Pass only the id for interestedIn and session
    if (abstractFormData.interestedIn) {
      formData.append("interestedInId", abstractFormData.interestedIn);
    }
    if (abstractFormData.session) {
      formData.append("sessionId", abstractFormData.session);
    }
    if (abstractFormData.abstractFile) {
      formData.append("abstractFile", abstractFormData.abstractFile);
    }
    formData.append("country", abstractFormData.country);

    try {
      const response = await fetch("https://renewable-be.onrender.com/api/form-submission/submit", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Submission failed");
      }
      setShowModal(true);
    } catch (error) {
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <form className="space-y-6">
      <div className="info-section">
        <div className="info-item">
          <label>Conference Dates:</label>
          <p>April 24-26, 2026</p>
        </div>
        <div className="info-item">
          <label>Submission Deadline:</label>
          <p>September 15, 2025</p>
        </div>
        <div className="info-item">
          <label>Conference Venue:</label>
          <p>Seoul, South Korea</p>
        </div>
        <div className="info-item">
          <label>Early Bird Registration:</label>
          <p>July 28, 2025</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Titles *
        </label>
        <select
          name="title"
          value={abstractFormData.title}
          onChange={handleChange}
          required
          className={`form-select ${errors.title ? 'error' : ''}`}
        >
          <option value="">Select Titles</option>
          <option value="Mr">Mr.</option>
          <option value="Ms">Ms.</option>
          <option value="Dr">Dr.</option>
          <option value="Prof">Prof.</option>
        </select>
        {errors.title && <p className="error-text">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          name="name"
          placeholder="Your Name"
          value={abstractFormData.name}
          onChange={handleChange}
          required
          className={`form-input ${errors.name ? 'error' : ''}`}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Email *
        </label>
        <input
          name="email"
          placeholder="Your Email"
          value={abstractFormData.email}
          onChange={handleChange}
          required
          className={`form-input ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Phone *
        </label>
        <input
          name="phone"
          placeholder="Your Phone"
          value={abstractFormData.phone}
          onChange={handleChange}
          required
          className={`form-input ${errors.phone ? 'error' : ''}`}
        />
        {errors.phone && <p className="error-text">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Organization Name
        </label>
        <input
          name="organization"
          placeholder="Organization Name"
          value={abstractFormData.organization}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Interested In
        </label>
        <select
          name="interestedIn"
          value={abstractFormData.interestedIn}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Select Option</option>
          {interestedInOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.option_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Please Select Session
        </label>
        <select
          name="session"
          value={abstractFormData.session}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Please Select Session</option>
          {sessionOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.sessionName}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Country
        </label>
        <select
          name="country"
          value={abstractFormData.country}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Select Country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
          <option value="au">Australia</option>
          <option value="de">Germany</option>
          <option value="fr">France</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Abstract:
        </label>
        <input
          type="file"
          name="abstractFile"
          onChange={handleFileChange}
          className="file-input"
        />
        {abstractFormData.abstractFile && (
          <p className="file-preview">
            Selected file: {abstractFormData.abstractFile.name} ({(abstractFormData.abstractFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      <div className="captcha-section" style={{ background: '#f0fdfa', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 2px 8px #e0f2f1' }}>
        <span className="captcha-image" style={{ fontSize: '2rem', letterSpacing: '0.3em', fontWeight: 700, background: 'linear-gradient(90deg,#4db6ac 30%,#fff 100%)', color: '#222', border: '2px dashed #4db6ac', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', textShadow: '1px 1px 2px #b2dfdb' }}>{captchaCode}</span>
        <span style={{ fontWeight: 600, color: '#333' }}>Enter the code above here:</span>
        <input
          name="captcha"
          value={abstractFormData.captcha}
          onChange={handleChange}
          required
          className="form-input w-32"
          style={{ fontSize: '1.2rem', border: '2px solid #4db6ac', borderRadius: '0.5rem', padding: '0.5rem 1rem', background: '#fff' }}
        />
        <button
          type="button"
          className="refresh-button flex items-center justify-center"
          onClick={generateCaptcha}
          style={{ background: '#fff', border: '2px solid #4db6ac', color: '#4db6ac', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '1.5rem', marginLeft: '0.5rem', transition: 'transform 0.2s' }}
          title="Refresh Captcha"
        >
          <FaSyncAlt />
        </button>
      </div>

      <div className="pt-4 button-group">
        <button
          type="button"
          onClick={resetForm}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all"
        >
          Reset Form
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all"
        >
          Submit Abstract
        </button>
      </div>
    </form>
  );
};

const ConferenceRegistration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'abstract'>('register');
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
  const [abstractFormData, setAbstractFormData] = useState<AbstractFormData>({
    title: '',
    name: '',
    phone: '',
    email: '',
    organization: '',
    interestedIn: '',
    session: '',
    country: '',
    abstractFile: null,
    captcha: '',
  });

  const location = useLocation(); // Add useLocation to read query parameters

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaCode(result);
    if (activeTab === 'register') {
      setRegisterFormData((prev) => ({ ...prev, captcha: '' }));
    } else {
      setAbstractFormData((prev) => ({ ...prev, captcha: '' }));
    }
  };

  const resetRegisterForm = () => {
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

  const resetAbstractForm = () => {
    setAbstractFormData({
      title: '',
      name: '',
      phone: '',
      email: '',
      organization: '',
      interestedIn: '',
      session: '',
      country: '',
      abstractFile: null,
      captcha: '',
    });
    generateCaptcha();
  };

  // Handle tab change from URL or custom event
  useEffect(() => {
    // Check URL query parameter
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    // Also check for hash (for /register#abstract)
    const hash = location.hash.replace('#', '');
    if (tab === 'register' || tab === 'abstract') {
      setActiveTab(tab);
    } else if (hash === 'abstract' || hash === 'register') {
      setActiveTab(hash as 'register' | 'abstract');
    }

    // Listen for tabChange event
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ tab: 'register' | 'abstract' }>;
      if (customEvent.detail.tab === 'register' || customEvent.detail.tab === 'abstract') {
        setActiveTab(customEvent.detail.tab);
      }
    };

    window.addEventListener('tabChange', handleTabChange);
    return () => window.removeEventListener('tabChange', handleTabChange);
  }, [location.search, location.hash]);

  useEffect(() => {
    generateCaptcha();
  }, [activeTab]);

  return (
    <div>
      <Style />
      <section className="bg-gradient-to-b from-gray-50 py-8 to-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-black bg-gray-200 rounded-full mb-4">
              REGISTRATION OPEN
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Renewable Energy Summit 2026
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Secure your exclusive access to the premier renewable energy conference of the year
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="tabs">
              <div
                className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </div>
              <div
                className={`tab ${activeTab === 'abstract' ? 'active' : ''}`}
                onClick={() => setActiveTab('abstract')}
              >
                Abstract Submission
              </div>
            </div>

            {activeTab === 'register' ? (
              <Register
                captchaCode={captchaCode}
                generateCaptcha={generateCaptcha}
                setRegisterFormData={setRegisterFormData}
                registerFormData={registerFormData}
                setShowModal={setShowModal}
                resetForm={resetRegisterForm}
              />
            ) : (
              <AbstractRegistration
                captchaCode={captchaCode}
                generateCaptcha={generateCaptcha}
                setAbstractFormData={setAbstractFormData}
                abstractFormData={abstractFormData}
                setShowModal={setShowModal}
                resetForm={resetAbstractForm}
              />
            )}
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="text-xl font-semibold mb-4">
              {activeTab === 'register' ? 'Registration Successful!' : 'Abstract Submitted Successfully!'}
            </h3>
            <p className="mb-4">
              {activeTab === 'register'
                ? 'Thank you for registering for the Renewable Energy Summit 2026.'
                : 'Your abstract has been submitted successfully.'}
            </p>
            <button
              className="modal-button"
              onClick={() => {
                setShowModal(false);
                activeTab === 'register' ? resetRegisterForm() : resetAbstractForm();
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

export default ConferenceRegistration;