import React, { useState, useEffect } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { BASE_URL } from '../config';

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
        border: none;
      }
    `}
  </style>
);

const AbstractSubmission: React.FC<{
  captchaCode: string;
  generateCaptcha: () => void;
  setAbstractFormData: React.Dispatch<React.SetStateAction<AbstractFormData>>;
  abstractFormData: AbstractFormData;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
}> = ({ captchaCode, generateCaptcha, setAbstractFormData, abstractFormData, setShowModal, resetForm }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [interestedInOptions, setInterestedInOptions] = useState<{ id: string; option_name: string }[]>([]);
  const [sessionOptions, setSessionOptions] = useState<{ id: string; option_name: string }[]>([]);

  useEffect(() => {
    // Fetch interestedIn options
    fetch(`${BASE_URL}/api/form-submission/get-interested-in-options`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Interested In Options:', data);
        if (Array.isArray(data)) {
          setInterestedInOptions(
            data.map(option => ({
              id: option.id?.toString() || '',
              option_name: option.option_name || option.sessionName || option.name || option.label || ''
            }))
          );
        } else {
          console.error('Expected array for interested in options, got:', data);
          setInterestedInOptions([]);
        }
      })
      .catch(error => {
        console.error('Error fetching interested in options:', error);
        setInterestedInOptions([]);
      });

    // Fetch session options
    fetch(`${BASE_URL}/api/form-submission/get-session-options`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Session Options:', data);
        if (Array.isArray(data)) {
          setSessionOptions(
            data.map(option => ({
              id: option.id?.toString() || '',
              option_name: option.option_name || option.sessionName || option.name || option.label || ''
            }))
          );
        } else {
          console.error('Expected array for session options, got:', data);
          setSessionOptions([]);
        }
      })
      .catch(error => {
        console.error('Error fetching session options:', error);
        setSessionOptions([]);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // For interestedIn and session, store the id as string
    setAbstractFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrors((prev) => ({ ...prev, abstractFile: 'Only PDF files are accepted.' }));
        setAbstractFormData((prev) => ({ ...prev, abstractFile: null }));
        return;
      }
      
      // Check file size (25MB limit)
      const maxSizeInBytes = 25 * 1024 * 1024; // 25MB in bytes
      if (file.size > maxSizeInBytes) {
        setErrors((prev) => ({ ...prev, abstractFile: 'File size too large. Maximum allowed size is 25MB.' }));
        setAbstractFormData((prev) => ({ ...prev, abstractFile: null }));
        return;
      }
    }
    
    setAbstractFormData((prev) => ({ ...prev, abstractFile: file }));
    if (errors.abstractFile) {
      setErrors((prev) => ({ ...prev, abstractFile: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!abstractFormData.title) newErrors.title = 'Title is required';
    if (!abstractFormData.name) newErrors.name = 'Name is required';
    if (!abstractFormData.phone) newErrors.phone = 'Phone is required';
    if (!abstractFormData.email) newErrors.email = 'Email is required';
    if (!abstractFormData.organization) newErrors.organization = 'Organization is required';
    if (!abstractFormData.interestedIn) newErrors.interestedIn = 'Interest area is required';
    if (!abstractFormData.session) newErrors.session = 'Session is required';
    if (!abstractFormData.country) newErrors.country = 'Country is required';
    if (!abstractFormData.abstractFile) newErrors.abstractFile = 'Abstract file is required';
    if (!abstractFormData.captcha) newErrors.captcha = 'Captcha is required';
    if (abstractFormData.captcha && abstractFormData.captcha !== captchaCode) {
      newErrors.captcha = 'Captcha is incorrect';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    
    // Map frontend field names to backend DTO field names
    formData.append('titlePrefix', abstractFormData.title);
    formData.append('name', abstractFormData.name);
    formData.append('phone', abstractFormData.phone);
    formData.append('email', abstractFormData.email);
    formData.append('organizationName', abstractFormData.organization);
    // Convert string IDs to numbers for backend Long fields
    formData.append('interestedInId', abstractFormData.interestedIn);
    formData.append('sessionId', abstractFormData.session);
    formData.append('country', abstractFormData.country);
    // Note: captcha is not in the backend DTO, so we'll skip it or handle it separately
    
    // Append file if exists
    if (abstractFormData.abstractFile) {
      formData.append('abstractFile', abstractFormData.abstractFile);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/form-submission/submit`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it for FormData
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        const errorData = await response.text();
        console.error('Submission error:', errorData);
        
        if (response.status === 413) {
          alert('File size too large. Maximum allowed size is 25MB. Please upload a smaller file.');
        } else {
          alert('Abstract submission failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="info-section">
        <div className="info-item">
          <label>Abstract Deadline</label>
          <p>March 15, 2026</p>
        </div>
        <div className="info-item">
          <label>Notification</label>
          <p>March 25, 2026</p>
        </div>
        <div className="info-item">
          <label>File Format</label>
          <p>PDF, DOC, DOCX</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <select
            name="title"
            value={abstractFormData.title}
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
            value={abstractFormData.name}
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
            value={abstractFormData.phone}
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
            value={abstractFormData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className={`form-input ${errors.email ? 'error' : ''}`}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
          <input
            type="text"
            name="organization"
            value={abstractFormData.organization}
            onChange={handleInputChange}
            placeholder="Enter your organization"
            className={`form-input ${errors.organization ? 'error' : ''}`}
          />
          {errors.organization && <p className="error-text">{errors.organization}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <input
            type="text"
            name="country"
            value={abstractFormData.country}
            onChange={handleInputChange}
            placeholder="Enter your country"
            className={`form-input ${errors.country ? 'error' : ''}`}
          />
          {errors.country && <p className="error-text">{errors.country}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interested In *</label>
          <select
            name="interestedIn"
            value={abstractFormData.interestedIn}
            onChange={handleInputChange}
            className={`form-select ${errors.interestedIn ? 'error' : ''}`}
          >
            <option value="">Select Interest Area</option>
            {interestedInOptions.map(option => (
              <option key={option.id} value={option.id}>{option.option_name}</option>
            ))}
          </select>
          {errors.interestedIn && <p className="error-text">{errors.interestedIn}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session *</label>
          <select
            name="session"
            value={abstractFormData.session}
            onChange={handleInputChange}
            className={`form-select ${errors.session ? 'error' : ''}`}
          >
            <option value="">Select Session</option>
            {sessionOptions.map(option => (
              <option key={option.id} value={option.id}>{option.option_name}</option>
            ))}
          </select>
          {errors.session && <p className="error-text">{errors.session}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Abstract File *</label>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className={`file-input ${errors.abstractFile ? 'error' : ''}`}
        />
        {abstractFormData.abstractFile && (
          <div className="file-preview">
            Selected: {abstractFormData.abstractFile.name}
          </div>
        )}
        {errors.abstractFile && <p className="error-text">{errors.abstractFile}</p>}
        <p className="text-sm text-gray-500 mt-1">
          PDF only (max 25MB)
        </p>
      </div>

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
              value={abstractFormData.captcha}
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

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Submit Abstract
        </button>
      </div>
    </form>
  );
};

const AbstractSubmissionPage: React.FC = () => {
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
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

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaCode(result);
    setAbstractFormData((prev) => ({ ...prev, captcha: '' }));
  };

  const resetForm = () => {
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
              CALL FOR ABSTRACTS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Abstract Submission
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Submit your research abstract for the Renewable Energy Summit 2026
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <AbstractSubmission
              captchaCode={captchaCode}
              generateCaptcha={generateCaptcha}
              setAbstractFormData={setAbstractFormData}
              abstractFormData={abstractFormData}
              setShowModal={setShowModal}
              resetForm={resetForm}
            />
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="text-xl font-semibold mb-4">Abstract Submitted Successfully!</h3>
            <p className="mb-4">Your abstract has been submitted successfully. We will review it and get back to you soon.</p>
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

export default AbstractSubmissionPage;
