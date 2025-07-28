import React, { useState, useEffect, useRef } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { BASE_URL, PAYMENT_API_URL } from '../config';

interface RegisterFormData {
  title: string; // Frontend only field for user experience
  name: string;
  phone: string;
  email: string;
  institute: string; // Will be mapped to instituteOrUniversity for backend
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
}> = ({ captchaCode, generateCaptcha, setRegisterFormData, registerFormData }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pricing, setPricing] = useState<PricingConfig[] | null>(null);
  const [pricingError, setPricingError] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [showCaptcha, setShowCaptcha] = useState(false);

  // Add refs for error fields
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const instituteRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const registrationTypeRef = useRef<HTMLInputElement>(null);
  const presentationTypeRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HTMLInputElement>(null);
  const errorSectionRef = useRef<HTMLDivElement>(null);

  // Map error keys to refs
  const fieldRefs: { [key: string]: React.RefObject<any> } = {
    name: nameRef,
    phone: phoneRef,
    email: emailRef,
    institute: instituteRef,
    country: countryRef,
    registrationType: registrationTypeRef,
    presentationType: presentationTypeRef,
    captcha: captchaRef,
  };

  const fetchPricing = async () => {
    if (!registerFormData.registrationType || !registerFormData.presentationType) {
      setPricing(null);
      return;
    }

    try {
      const pricingRequest = {
        registrationType: registerFormData.registrationType === 'registrationAndAccommodation'
          ? 'REGISTRATION_AND_ACCOMMODATION'
          : 'REGISTRATION_ONLY',
        presentationType: registerFormData.presentationType.toUpperCase(),
        numberOfNights: registerFormData.nights,
        numberOfGuests: registerFormData.guests,
      };

      const response = await fetch(`${BASE_URL}/api/registration/get-pricing-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricingRequest),
      });

      if (response.ok) {
        const data = await response.json();
        setPricing(data);
        setPricingError('');
        
        // Debug accommodation data
        if (data && data.length > 0) {
          data.forEach((config: PricingConfig) => {
            if (config.accommodationOption) {
              
            }
          });
        }
      } else {
        let errorMessage = 'Failed to fetch pricing information';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Pricing fetch failed: ${response.status} ${response.statusText}`;
        }
        setPricingError(errorMessage);
        setPricing(null);
      }
    } catch (error) {
      const errorMessage = `Error fetching pricing information: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setPricingError(errorMessage);
      setPricing(null);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [registerFormData.registrationType, registerFormData.presentationType, registerFormData.nights, registerFormData.guests]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setRegisterFormData((prev) => {
      // If registrationType is changed to registrationAndAccommodation, reset guests to 0
      if (name === 'registrationType' && value === 'registrationAndAccommodation') {
        return {
          ...prev,
          [name]: value,
          guests: 0,
        };
      }
      // If registrationType is changed to registrationOnly, reset guests to 1
      if (name === 'registrationType' && value === 'registrationOnly') {
        return {
          ...prev,
          [name]: value,
          guests: 1,
        };
      }
      return {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // Note: title is not validated as it's frontend-only for UX
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
    // Scroll to first error field or error section (always scroll up)
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const ref = fieldRefs[firstErrorKey];
      if (ref && ref.current) {
        // Scroll to top of the field (start of viewport)
        const y = ref.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
        ref.current.focus();
      } else if (errorSectionRef.current) {
        const y = errorSectionRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    return Object.keys(newErrors).length === 0;
  };

  const createPaymentSession = async (pricingConfigId: number) => {
    setIsProcessingPayment(true);
    setPaymentError('');

    try {
      // First, calculate the amount from pricing
      const selectedPricing = pricing?.find(p => p.id === pricingConfigId);
      if (!selectedPricing) {
        throw new Error('Pricing configuration not found');
      }

      // Build detailed description including accommodation
      let description = `Registration for ${registerFormData.name} - ${selectedPricing.presentationType.type}`;
      let productName = `Renewable Energy Summit 2026 - ${selectedPricing.presentationType.type}`;
      
      if (selectedPricing.accommodationOption) {
        description += ` + Accommodation (${selectedPricing.accommodationOption.nights} nights, ${selectedPricing.accommodationOption.guests} guests)`;
        productName += ` + Accommodation`;
      }

      const paymentData = {
        // Basic payment information
        productName: productName,
        description: description,
        orderReference: `REG-${Date.now()}-${registerFormData.name.replace(/\s+/g, '')}`,
        unitAmount: selectedPricing.totalPrice, // Keep as euros (backend expects euros, not cents)
        quantity: 1,
        currency: "eur",
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/registration`,
        pricingConfigId: pricingConfigId,
        
        // Customer registration information (matching CheckoutRequest fields exactly)
        name: registerFormData.name,
        phone: registerFormData.phone,
        email: registerFormData.email,
        instituteOrUniversity: registerFormData.institute, // Map institute to instituteOrUniversity
        country: registerFormData.country,
        registrationType: registerFormData.registrationType === 'registrationAndAccommodation' 
          ? 'REGISTRATION_AND_ACCOMMODATION' 
          : 'REGISTRATION_ONLY',
        presentationType: registerFormData.presentationType.toUpperCase(),
        
        // Accommodation information (if applicable)
        accompanyingPerson: registerFormData.accompanyingPerson,
        extraNights: registerFormData.extraNights,
        accommodationNights: selectedPricing.accommodationOption ? selectedPricing.accommodationOption.nights : 0,
        accommodationGuests: selectedPricing.accommodationOption ? selectedPricing.accommodationOption.guests : 0,
      };

      const response = await fetch(`${PAYMENT_API_URL}/api/payment/create-checkout-session?pricingConfigId=${pricingConfigId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const paymentSession = await response.json();
        
        // Redirect to Stripe checkout
        if (paymentSession.url) {
          window.location.href = paymentSession.url;
        } else {
          throw new Error('No payment URL received');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment session');
      }
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Failed to create payment session');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Check if we have pricing information
    if (!pricing || pricing.length === 0) {
      alert('Please wait for pricing information to load or check your selection.');
      return;
    }

    try {
      const selectedType = registerFormData.presentationType;
      const registrationData = {
        name: registerFormData.name,
        phone: registerFormData.phone,
        email: registerFormData.email,
        instituteOrUniversity: registerFormData.institute,
        country: registerFormData.country,
        registrationType: registerFormData.registrationType === 'registrationAndAccommodation'
          ? 'REGISTRATION_AND_ACCOMMODATION'
          : 'REGISTRATION_ONLY',
        presentationType: selectedType.toUpperCase(),
      };

      const response = await fetch(`${BASE_URL}/api/registration/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        // Registration successful, now create payment session
        // Find the correct pricing config for selected type
        const selectedConfig = pricing.find(
          (p) => p.presentationType.type.toLowerCase() === selectedType.toLowerCase()
        );
        if (!selectedConfig) {
          alert('Pricing configuration not found for selected type.');
          return;
        }
        await createPaymentSession(selectedConfig.id);
      } else {
        // Registration failed, let's try direct payment approach
        // Store registration data in localStorage for later processing
        const registrationDataForStorage = {
          name: registerFormData.name,
          phone: registerFormData.phone,
          email: registerFormData.email,
          instituteOrUniversity: registerFormData.institute,
          country: registerFormData.country,
          registrationType: registerFormData.registrationType === 'registrationAndAccommodation'
            ? 'REGISTRATION_AND_ACCOMMODATION'
            : 'REGISTRATION_ONLY',
          presentationType: selectedType.toUpperCase(),
        };
        localStorage.setItem('pendingRegistration', JSON.stringify(registrationDataForStorage));
        // Proceed directly to payment
        const selectedConfig = pricing.find(
          (p) => p.presentationType.type.toLowerCase() === selectedType.toLowerCase()
        );
        if (!selectedConfig) {
          alert('Pricing configuration not found for selected type.');
          return;
        }
        await createPaymentSession(selectedConfig.id);
      }
    } catch (error) {
      // If registration API fails completely, try direct payment
      try {
        const selectedType = registerFormData.presentationType;
        const registrationDataForStorage = {
          name: registerFormData.name,
          phone: registerFormData.phone,
          email: registerFormData.email,
          instituteOrUniversity: registerFormData.institute,
          country: registerFormData.country,
          registrationType: registerFormData.registrationType === 'registrationAndAccommodation'
            ? 'REGISTRATION_AND_ACCOMMODATION'
            : 'REGISTRATION_ONLY',
          presentationType: selectedType.toUpperCase(),
        };
        localStorage.setItem('pendingRegistration', JSON.stringify(registrationDataForStorage));
        // Proceed to payment
        const selectedConfig = pricing.find(
          (p) => p.presentationType.type.toLowerCase() === selectedType.toLowerCase()
        );
        if (!selectedConfig) {
          alert('Pricing configuration not found for selected type.');
          return;
        }
        await createPaymentSession(selectedConfig.id);
      } catch (paymentError) {
        alert(`Unable to process registration and payment: ${paymentError instanceof Error ? paymentError.message : 'Unknown error'}`);
      }
    }
  };

  // Add handler for captcha input paste shortcut
  useEffect(() => {
    const handlePasteShortcut = (e: KeyboardEvent) => {
      // Only trigger if captcha input is focused
      if (document.activeElement === captchaRef.current) {
        if ((e.altKey && e.key.toLowerCase() === 'v') || (e.ctrlKey && e.key.toLowerCase() === 'v')) {
          e.preventDefault();
          navigator.clipboard.readText().then((clipText) => {
            setRegisterFormData((prev) => ({ ...prev, captcha: clipText.slice(0, 6) }));
          });
        }
      }
    };
    window.addEventListener('keydown', handlePasteShortcut);
    return () => window.removeEventListener('keydown', handlePasteShortcut);
  }, [setRegisterFormData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="info-section">
        <div className="info-item">
          <label>Conference Date</label>
          <p>May 29-31, 2026</p>
        </div>
        <div className="info-item">
          <label>Location</label>
          <p>DoubleTree by Hilton Tokyo Ariake - Deira Tokyo Japan</p>
        </div>
        <div className="info-item">
          <label>Registration Deadline</label>
          <p>March 30, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <select
            name="title"
            value={registerFormData.title}
            onChange={handleInputChange}
            className={`form-select ${errors.title ? 'error' : ''}`}
          >
            <option value="">Select Title (Optional)</option>
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
            ref={nameRef}
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
            ref={phoneRef}
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
            ref={emailRef}
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
            ref={instituteRef}
          />
          {errors.institute && <p className="error-text">{errors.institute}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <select
            name="country"
            value={registerFormData.country}
            onChange={handleInputChange}
            className={`form-select ${errors.country ? 'error' : ''}`}
            ref={countryRef}
          >
            <option value="">Select your country</option>
            <option value="Afghanistan">Afghanistan</option>
            <option value="Albania">Albania</option>
            <option value="Algeria">Algeria</option>
            <option value="Andorra">Andorra</option>
            <option value="Angola">Angola</option>
            <option value="Argentina">Argentina</option>
            <option value="Armenia">Armenia</option>
            <option value="Australia">Australia</option>
            <option value="Austria">Austria</option>
            <option value="Azerbaijan">Azerbaijan</option>
            <option value="Bahamas">Bahamas</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Barbados">Barbados</option>
            <option value="Belarus">Belarus</option>
            <option value="Belgium">Belgium</option>
            <option value="Belize">Belize</option>
            <option value="Benin">Benin</option>
            <option value="Bhutan">Bhutan</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
            <option value="Botswana">Botswana</option>
            <option value="Brazil">Brazil</option>
            <option value="Brunei">Brunei</option>
            <option value="Bulgaria">Bulgaria</option>
            <option value="Burkina Faso">Burkina Faso</option>
            <option value="Burundi">Burundi</option>
            <option value="Cabo Verde">Cabo Verde</option>
            <option value="Cambodia">Cambodia</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Canada">Canada</option>
            <option value="Central African Republic">Central African Republic</option>
            <option value="Chad">Chad</option>
            <option value="Chile">Chile</option>
            <option value="China">China</option>
            <option value="Colombia">Colombia</option>
            <option value="Comoros">Comoros</option>
            <option value="Congo, Democratic Republic of the">Congo, Democratic Republic of the</option>
            <option value="Congo, Republic of the">Congo, Republic of the</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="Croatia">Croatia</option>
            <option value="Cuba">Cuba</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Czech Republic">Czech Republic</option>
            <option value="Denmark">Denmark</option>
            <option value="Djibouti">Djibouti</option>
            <option value="Dominica">Dominica</option>
            <option value="Dominican Republic">Dominican Republic</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Egypt">Egypt</option>
            <option value="El Salvador">El Salvador</option>
            <option value="Equatorial Guinea">Equatorial Guinea</option>
            <option value="Eritrea">Eritrea</option>
            <option value="Estonia">Estonia</option>
            <option value="Eswatini">Eswatini</option>
            <option value="Ethiopia">Ethiopia</option>
            <option value="Fiji">Fiji</option>
            <option value="Finland">Finland</option>
            <option value="France">France</option>
            <option value="Gabon">Gabon</option>
            <option value="Gambia">Gambia</option>
            <option value="Georgia">Georgia</option>
            <option value="Germany">Germany</option>
            <option value="Ghana">Ghana</option>
            <option value="Greece">Greece</option>
            <option value="Grenada">Grenada</option>
            <option value="Guatemala">Guatemala</option>
            <option value="Guinea">Guinea</option>
            <option value="Guinea-Bissau">Guinea-Bissau</option>
            <option value="Guyana">Guyana</option>
            <option value="Haiti">Haiti</option>
            <option value="Honduras">Honduras</option>
            <option value="Hungary">Hungary</option>
            <option value="Iceland">Iceland</option>
            <option value="India">India</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Iran">Iran</option>
            <option value="Iraq">Iraq</option>
            <option value="Ireland">Ireland</option>
            <option value="Israel">Israel</option>
            <option value="Italy">Italy</option>
            <option value="Jamaica">Jamaica</option>
            <option value="Japan">Japan</option>
            <option value="Jordan">Jordan</option>
            <option value="Kazakhstan">Kazakhstan</option>
            <option value="Kenya">Kenya</option>
            <option value="Kiribati">Kiribati</option>
            <option value="Korea, North">Korea, North</option>
            <option value="Korea, South">Korea, South</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Kyrgyzstan">Kyrgyzstan</option>
            <option value="Laos">Laos</option>
            <option value="Latvia">Latvia</option>
            <option value="Lebanon">Lebanon</option>
            <option value="Lesotho">Lesotho</option>
            <option value="Liberia">Liberia</option>
            <option value="Libya">Libya</option>
            <option value="Liechtenstein">Liechtenstein</option>
            <option value="Lithuania">Lithuania</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Madagascar">Madagascar</option>
            <option value="Malawi">Malawi</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Maldives">Maldives</option>
            <option value="Mali">Mali</option>
            <option value="Malta">Malta</option>
            <option value="Marshall Islands">Marshall Islands</option>
            <option value="Mauritania">Mauritania</option>
            <option value="Mauritius">Mauritius</option>
            <option value="Mexico">Mexico</option>
            <option value="Micronesia">Micronesia</option>
            <option value="Moldova">Moldova</option>
            <option value="Monaco">Monaco</option>
            <option value="Mongolia">Mongolia</option>
            <option value="Montenegro">Montenegro</option>
            <option value="Morocco">Morocco</option>
            <option value="Mozambique">Mozambique</option>
            <option value="Myanmar">Myanmar</option>
            <option value="Namibia">Namibia</option>
            <option value="Nauru">Nauru</option>
            <option value="Nepal">Nepal</option>
            <option value="Netherlands">Netherlands</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Nicaragua">Nicaragua</option>
            <option value="Niger">Niger</option>
            <option value="Nigeria">Nigeria</option>
            <option value="North Macedonia">North Macedonia</option>
            <option value="Norway">Norway</option>
            <option value="Oman">Oman</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Palau">Palau</option>
            <option value="Palestine">Palestine</option>
            <option value="Panama">Panama</option>
            <option value="Papua New Guinea">Papua New Guinea</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Peru">Peru</option>
            <option value="Philippines">Philippines</option>
            <option value="Poland">Poland</option>
            <option value="Portugal">Portugal</option>
            <option value="Qatar">Qatar</option>
            <option value="Romania">Romania</option>
            <option value="Russia">Russia</option>
            <option value="Rwanda">Rwanda</option>
            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
            <option value="Saint Lucia">Saint Lucia</option>
            <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
            <option value="Samoa">Samoa</option>
            <option value="San Marino">San Marino</option>
            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Senegal">Senegal</option>
            <option value="Serbia">Serbia</option>
            <option value="Seychelles">Seychelles</option>
            <option value="Sierra Leone">Sierra Leone</option>
            <option value="Singapore">Singapore</option>
            <option value="Slovakia">Slovakia</option>
            <option value="Slovenia">Slovenia</option>
            <option value="Solomon Islands">Solomon Islands</option>
            <option value="Somalia">Somalia</option>
            <option value="South Africa">South Africa</option>
            <option value="South Sudan">South Sudan</option>
            <option value="Spain">Spain</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Sudan">Sudan</option>
            <option value="Suriname">Suriname</option>
            <option value="Sweden">Sweden</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Syria">Syria</option>
            <option value="Taiwan">Taiwan</option>
            <option value="Tajikistan">Tajikistan</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Thailand">Thailand</option>
            <option value="Timor-Leste">Timor-Leste</option>
            <option value="Togo">Togo</option>
            <option value="Tonga">Tonga</option>
            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
            <option value="Tunisia">Tunisia</option>
            <option value="Turkey">Turkey</option>
            <option value="Turkmenistan">Turkmenistan</option>
            <option value="Tuvalu">Tuvalu</option>
            <option value="Uganda">Uganda</option>
            <option value="Ukraine">Ukraine</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Uzbekistan">Uzbekistan</option>
            <option value="Vanuatu">Vanuatu</option>
            <option value="Vatican City">Vatican City</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Vietnam">Vietnam</option>
            <option value="Yemen">Yemen</option>
            <option value="Zambia">Zambia</option>
            <option value="Zimbabwe">Zimbabwe</option>
          </select>
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
              ref={registrationTypeRef}
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
              ref={presentationTypeRef}
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
              value="listener"
              checked={registerFormData.presentationType === 'listener'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Listener</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="presentationType"
              value="delegate"
              checked={registerFormData.presentationType === 'delegate'}
              onChange={handleInputChange}
              className="radio-input"
            />
            <span>Delegate</span>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h4 className="text-lg font-semibold text-blue-900">Accommodation Options</h4>
          </div>
          {/* Posh clarification message */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-400 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
              <span className="text-blue-900 font-medium text-base">
                {registerFormData.guests === 0
                  ? 'Accommodation will be provided for you only.'
                  : `Accommodation will be provided for you and ${registerFormData.guests} additional guest${registerFormData.guests > 1 ? 's' : ''}.`
                }
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-2">Select the number of guests to clarify your accommodation needs. <br /> <span className="font-semibold">0</span> means only you, <span className="font-semibold">1</span> or more means you plus that number of guests.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
              <select
                name="guests"
                value={registerFormData.guests}
                onChange={handleInputChange}
                className="form-select"
              >
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>{i === 0 ? '0 (Just Me)' : `${i} Guest${i > 1 ? 's' : ''}`}</option>
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
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Night{i + 1 > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white border border-blue-200 rounded text-sm text-gray-700">
            <p className="font-medium text-gray-900 mb-1">Accommodation Details:</p>
            <p>• Hotel: DoubleTree by Hilton Tokyo Ariake</p>
            <p>• Location: Deira Tokyo, Japan</p>
            <p>• Selected: {registerFormData.guests === 0 ? 'Just you' : `${registerFormData.guests} guest${registerFormData.guests > 1 ? 's' : ''} + you`} for {registerFormData.nights} night{registerFormData.nights > 1 ? 's' : ''}</p>
            <p>• Dates: May 29, 2026 – {(() => {
              const start = new Date(2026, 4, 29); // May is month 4 (0-based)
              const end = new Date(start);
              end.setDate(start.getDate() + registerFormData.nights);
              const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
              return end.toLocaleDateString('en-US', options);
            })()}</p>
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
            <div style={{ position: 'relative' }}>
              <input
                type={showCaptcha ? 'text' : 'password'}
                name="captcha"
                value={registerFormData.captcha}
                onChange={handleInputChange}
                placeholder="Enter the code shown above"
                className={`captcha-input ${errors.captcha ? 'error' : ''}`}
                autoComplete="off"
                maxLength={6}
                ref={captchaRef}
              />
              <button
                type="button"
                aria-label={showCaptcha ? 'Hide captcha' : 'Show captcha'}
                onClick={() => setShowCaptcha((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#64748b',
                }}
                tabIndex={-1}
              >
                {showCaptcha ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-4.03-9-7 0-1.13.44-2.19 1.22-3.13M6.53 6.53A9.97 9.97 0 0 1 12 5c5 0 9 4.03 9 7 0 1.13-.44 2.19-1.22 3.13M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            <div className="captcha-help-text">
              <svg className="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Please enter the 6-character code to verify you're human. <span style={{marginLeft: 4}}> <b>Show/Hide</b> with the eye icon.</span>
            </div>
          </div>
          {errors.captcha && <p className="error-text">{errors.captcha}</p>}
        </div>
      </div>

      {/* Error section for scrolling fallback */}
      {Object.keys(errors).length > 0 && (
        <div ref={errorSectionRef}></div>
      )}

      {/* Pricing summary and payment section */}
      {pricing && pricing.length > 0 && (
        <div className="payment-summary">
          <h3 className="text-lg font-semibold mb-4">Pricing Summary</h3>
          {pricing.map((config) => {
            // Calculate subtotal (registration + accommodation before processing fee)
            const registrationPrice = config.presentationType.price;
            const accommodationPrice = config.accommodationOption ? config.accommodationOption.price : 0;
            const subtotal = registrationPrice + accommodationPrice;
            const processingFee = subtotal * ((config.processingFeePercent ?? 5) / 100);
            // Ensure totalPrice is always used as-is for payment, never rounded
            return (
              <div key={config.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-gray-900">Order Details</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{config.presentationType.type} Registration</span>
                  <span className="font-semibold">€{registrationPrice}</span>
                </div>
                {config.accommodationOption && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      Accommodation ({config.accommodationOption.nights} night{config.accommodationOption.nights > 1 ? 's' : ''}, {config.accommodationOption.guests} guest{config.accommodationOption.guests > 1 ? 's' : ''})
                    </span>
                    <span className="font-semibold">€{accommodationPrice}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 my-3"></div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">€{subtotal}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Processing Fee ({config.processingFeePercent ?? 5}%)</span>
                  <span className="font-medium">€{processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-xl border-t border-gray-400 pt-3">
                  <span>Total Amount</span>
                  <span className="text-green-600">€{config.totalPrice}</span>
                </div>
                {registerFormData.registrationType === 'registrationAndAccommodation' && config.accommodationOption && (
                  <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold">Accommodation Details:</p>
                      <p>• Hotel: DoubleTree by Hilton Tokyo Ariake</p>
                      <p>• Location: Deira Tokyo, Japan</p>
                      <p>• Duration: {config.accommodationOption.nights} night{config.accommodationOption.nights > 1 ? 's' : ''}</p>
                      <p>• Capacity: {config.accommodationOption.guests} guest{config.accommodationOption.guests > 1 ? 's' : ''}</p>
                      <p>• Check-in: May 29, 2026</p>
                      <p>• Check-out: {(() => {
                        const start = new Date(2026, 4, 29);
                        const end = new Date(start);
                        end.setDate(start.getDate() + config.accommodationOption.nights);
                        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
                        return end.toLocaleDateString('en-US', options);
                      })()}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Secure Payment Process</p>
                <p>After clicking "Register & Pay Now", you'll be redirected to our secure Stripe payment page to complete your registration payment in euros (EUR).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error and payment error sections only if defined */}
      {pricingError && (
        <div className="text-red-500 text-sm">{pricingError}</div>
      )}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <strong>Payment Error:</strong> {paymentError}
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isProcessingPayment || !pricing || pricing.length === 0}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            isProcessingPayment || !pricing || pricing.length === 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isProcessingPayment ? 'Processing...' : 'Register & Pay Now'}
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
    guests: 0, // Default to 0 (Just Me)
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
      guests: 0, // Default to 0 (Just Me)
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
