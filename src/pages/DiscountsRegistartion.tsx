// src/pages/DiscountRegistrationPage.tsx

import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config";
import { fetchCountries } from "../lib/countriesApi";

const generateRandomCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const DiscountRegistrationPage = () => {
  const [form, setForm] = useState({
    title: "",
    name: "",
    phone: "",
    email: "",
    institute: "",
    country: "",
    description: "",
    discountAmount: "",
    captcha: "",
  });
  const [captchaCode, setCaptchaCode] = useState(generateRandomCaptcha());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState<string[]>(["India", "USA", "UK", "Germany", "Other"]);

  const generateCaptcha = () => {
    setCaptchaCode(generateRandomCaptcha());
    setForm(f => ({ ...f, captcha: "" }));
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (form.captcha !== captchaCode) {
      setError("Captcha does not match. Please try again.");
      generateCaptcha();
      return;
    }
    setSubmitting(true);
    try {
      // Prepare request body as per backend DTO, but send discountAmount as-is (no cents conversion)
      const reqBody = {
        productName: "Discount Registration",
        description: form.description,
        orderReference: `DISCOUNT-${Date.now()}`,
        unitAmount: form.discountAmount, // send as entered
        quantity: 1,
        currency: "eur",
        successUrl: window.location.origin + "/discount-success",
        cancelUrl: window.location.origin + "/discount-cancel",
        customerEmail: form.email,
        name: form.name,
        phone: form.phone,
        instituteOrUniversity: form.institute,
        country: form.country,
      };
      const response = await fetch(`${BASE_URL}/api/discounts/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to create Stripe session");
      }
      const data = await response.json();
      // If your backend returns a Stripe Checkout URL, redirect:
      if (data && data.url) {
        window.location.href = data.url;
        return;
      }
      setSuccess(true);
      setForm({
        title: "",
        name: "",
        phone: "",
        email: "",
        institute: "",
        country: "",
        description: "",
        discountAmount: "",
        captcha: "",
      });
      generateCaptcha();
    } catch (err: any) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-white flex items-center justify-center p-4 pt-20">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-10 border border-blue-100 relative">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-2 tracking-tight">Discount Registration</h2>
        <p className="text-center text-gray-500 mb-6">Fill in the form below to request a discount for your registration.</p>
        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center font-medium animate-fade-in">
            Registration submitted successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-center font-medium animate-fade-in">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Title *</label>
            <select required className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" value={form.title} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange("title", e.target.value)}>
              <option value="">Select Title</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Name *</label>
              <input placeholder="Name" required className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Phone *</label>
              <input placeholder="Phone" required className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" value={form.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Email *</label>
              <input placeholder="Email" type="email" required className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" value={form.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Institute/University *</label>
              <input placeholder="Institute/University" required className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" value={form.institute} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("institute", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Country *</label>
            <select required className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" value={form.country} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange("country", e.target.value)}>
              <option value="">Choose Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Registration Description *</label>
            <textarea placeholder="Describe your registration..." required className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300 min-h-[80px]" value={form.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("description", e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Discount Amount (€) *</label>
            <input placeholder="Enter Discount Amount" required type="number" min="0" className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" value={form.discountAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("discountAmount", e.target.value)} />
          </div>

          <div className="flex flex-col gap-2 items-center">
            <label className="block text-sm font-semibold text-blue-700 mb-1">Captcha *</label>
            <div
              className="w-36 h-12 flex items-center justify-center font-mono text-xl font-bold bg-gradient-to-r from-blue-200 to-blue-100 rounded select-none tracking-widest border border-blue-400 mb-1 shadow-inner"
              style={{ letterSpacing: '0.3em', userSelect: 'none', textShadow: '1px 1px 2px #b6c6e6' }}
            >
              {captchaCode}
            </div>
            <button
              type="button"
              className="text-xs text-blue-700 underline mb-1 hover:text-blue-900"
              onClick={generateCaptcha}
              tabIndex={-1}
            >
              Refresh Captcha
            </button>
            <input placeholder="Enter the code above" required className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" value={form.captcha} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("captcha", e.target.value)} />
          </div>

          <button type="submit" disabled={submitting} className={`w-full bg-blue-700 hover:bg-blue-800 text-white p-2 rounded font-semibold transition-all duration-200 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiscountRegistrationPage;