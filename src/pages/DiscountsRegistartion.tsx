import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config";
import { fetchCountries } from "../lib/countriesApi";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    const [countries, setCountries] = useState<string[]>([
        "India", "USA", "UK", "Germany", "France", "Canada", "Australia", "Japan", "China", "Brazil",
        "Italy", "Spain", "Netherlands", "Switzerland", "Sweden", "Norway", "Denmark", "Belgium",
        "Austria", "Poland", "Turkey", "Russia", "South Korea", "Singapore", "Malaysia", "Thailand",
        "Indonesia", "Philippines", "Vietnam", "South Africa", "Egypt", "Nigeria", "Kenya", "Other"
    ]);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const [paypalProcessing, setPaypalProcessing] = useState(false);

    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        if (!form.title.trim()) errors.title = 'Title is required';
        if (!form.name.trim()) errors.name = 'Name is required';
        if (!form.phone.trim()) errors.phone = 'Phone is required';
        if (!form.email.trim()) errors.email = 'Email is required';
        if (!form.institute.trim()) errors.institute = 'Institute/University is required';
        if (!form.country.trim()) errors.country = 'Country is required';
        if (!form.description.trim()) errors.description = 'Description is required';
        if (!form.discountAmount.trim()) errors.discountAmount = 'Discount amount is required';
        if (form.discountAmount && (isNaN(Number(form.discountAmount)) || Number(form.discountAmount) <= 0)) {
            errors.discountAmount = 'Please enter a valid discount amount';
        }
        if (!form.captcha.trim()) errors.captcha = 'Captcha is required';
        if (form.captcha && form.captcha !== captchaCode) {
            errors.captcha = 'Captcha is incorrect';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

  const generateCaptcha = () => {
    setCaptchaCode(generateRandomCaptcha());
    setForm(f => ({ ...f, captcha: "" }));
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
        setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  const handleStripePayment = async () => {
    setError("");
    setSuccess(false);
    
    if (!validateForm()) {
        setError("Please fill in all required fields correctly.");
        return;
    }

    setSubmitting(true);
    try {
        // Calculate total amount including 5% processing fee
        const baseAmount = parseFloat(form.discountAmount);
        const processingFee = baseAmount * 0.05;
        const totalAmount = baseAmount + processingFee;
        
        // Prepare request body as per backend DTO
        const reqBody = {
            productName: "RENEWABLE 2026 DISCOUNT REGISTRATION",
            description: `RENEWABLE 2026 DISCOUNT REQUEST: ${form.description} (Base: €${baseAmount.toFixed(2)}, Processing Fee: €${processingFee.toFixed(2)})`,
            orderReference: `DISCOUNT-${Date.now()}`,
            unitAmount: totalAmount.toFixed(2), // send total amount including processing fee
            quantity: 1,
            currency: "eur",
            successUrl: window.location.origin + "/payment-success",
            cancelUrl: window.location.origin + "/payment-failure",
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
            sessionStorage.setItem("stripeRedirect", "true");
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

  const handlePayPalPayment = async () => {
    setError("");
    setSuccess(false);
    
    if (!validateForm()) {
        setError("Please fill in all required fields correctly.");
        return;
    }

    setSubmitting(true);
    setPaypalProcessing(true);
    
    try {
        // Calculate total amount including 5% processing fee
        const baseAmount = parseFloat(form.discountAmount);
        const processingFee = Math.round(baseAmount * 0.05 * 100) / 100; // Round to 2 decimal places
        const totalAmount = Math.round((baseAmount + processingFee) * 100) / 100; // Round to 2 decimal places
        
        // Validate amounts
        if (isNaN(baseAmount) || baseAmount <= 0) {
            throw new Error('Invalid discount amount');
        }
        if (isNaN(totalAmount) || totalAmount <= 0) {
            throw new Error('Invalid total amount');
        }
        
        // Create PayPal order via API - matching nursing structure  
        const paypalRequest = {
            customerEmail: form.email,
            customerName: form.name,
            phone: form.phone,
            country: form.country,
            instituteOrUniversity: form.institute,
            amount: totalAmount, // send total amount including processing fee
            currency: 'EUR',
            successUrl: `${window.location.origin}/payment-success`,
            cancelUrl: `${window.location.origin}/discount-registration`
        };

        console.log('Creating PayPal order with request:', paypalRequest);

        const response = await fetch(`${BASE_URL}/api/discounts/paypal/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paypalRequest),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('PayPal order creation response:', data);
            
            if (data.approvalUrl) {
                // Store registration data for PayPal return
                sessionStorage.setItem('paypalDiscountRegistration', JSON.stringify({
                    ...form,
                    totalAmount: totalAmount,
                    processingFee: processingFee
                }));
                
                console.log('Redirecting to PayPal approval URL:', data.approvalUrl);
                window.location.href = data.approvalUrl;
                return;
            } else {
                throw new Error('No approval URL received from PayPal');
            }
        } else {
            let errorMessage = 'PayPal order creation failed';
            try {
                const errorData = await response.json();
                console.error('PayPal create error response:', errorData);
                errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
            } catch (parseError) {
                console.error('Failed to parse error response:', parseError);
                const errorText = await response.text();
                console.error('Raw error response:', errorText);
                errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('PayPal order creation error:', error);
        setError(`PayPal error: ${error.message || 'Unknown error'}`);
    } finally {
        setSubmitting(false);
        setPaypalProcessing(false);
    }
  };

  // Add PayPal direct payment function following Register.tsx pattern
  const handlePayPalDirectPayment = async () => {
    if (!validateForm()) return;

    // Call the main PayPal payment handler
    await handlePayPalPayment();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check which payment method is selected and handle accordingly
    if (paymentMethod === 'stripe') {
        await handleStripePayment();
    } else if (paymentMethod === 'paypal') {
        await handlePayPalDirectPayment();
    }
  };

  useEffect(() => {
    // Load countries asynchronously without blocking the UI
    fetchCountries()
        .then((fetchedCountries) => {
            if (fetchedCountries && fetchedCountries.length > 0) {
                setCountries(fetchedCountries);
            }
        })
        .catch((error) => {
            console.warn("Failed to fetch countries from API, using fallback list:", error);
            // Already have fallback list in state, so no action needed
        });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4 pt-20">
            <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-10 border border-blue-100 relative">
                <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-2 tracking-tight">Renewable Energy Summit Discount Registration</h2>
                <p className="text-center text-gray-500 mb-6">Fill in the form below to request a discount for your registration to the Renewable Energy Summit 2026.</p>
                <div className="text-center text-gray-700 mb-6">Venue: DoubleTree by Hilton Tokyo Ariake <br/>Deira Tokyo, Japan</div>
                
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
                        <select 
                            required 
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 ${formErrors.title ? 'border-red-500' : 'border-blue-200'}`}
                            value={form.title} 
                            onChange={(e) => handleChange("title", e.target.value)}
                        >
                            <option value="">Select Title</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Dr.">Dr.</option>
                            <option value="Prof.">Prof.</option>
                        </select>
                        {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-blue-700 mb-1">Name *</label>
                            <input 
                                placeholder="Name" 
                                required 
                                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 ${formErrors.name ? 'border-red-500' : 'border-blue-200'}`}
                                value={form.name} 
                                onChange={(e) => handleChange("name", e.target.value)} 
                            />
                            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-blue-700 mb-1">Phone *</label>
                            <input 
                                placeholder="Phone" 
                                required 
                                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 ${formErrors.phone ? 'border-red-500' : 'border-blue-200'}`}
                                value={form.phone} 
                                onChange={(e) => handleChange("phone", e.target.value)} 
                            />
                            {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-blue-700 mb-1">Email *</label>
                            <input 
                                placeholder="Email" 
                                type="email" 
                                required 
                                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 ${formErrors.email ? 'border-red-500' : 'border-blue-200'}`}
                                value={form.email} 
                                onChange={(e) => handleChange("email", e.target.value)} 
                            />
                            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-blue-700 mb-1">Institute/University *</label>
                            <input 
                                placeholder="Institute/University" 
                                required 
                                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 ${formErrors.institute ? 'border-red-500' : 'border-blue-200'}`}
                                value={form.institute} 
                                onChange={(e) => handleChange("institute", e.target.value)} 
                            />
                            {formErrors.institute && <p className="text-red-500 text-sm mt-1">{formErrors.institute}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-1">Country *</label>
                        <select 
                            required 
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 ${formErrors.country ? 'border-red-500' : 'border-blue-200'}`}
                            value={form.country} 
                            onChange={(e) => handleChange("country", e.target.value)}
                        >
                            <option value="">Choose Country</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                        {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-1">Registration Description *</label>
                        <textarea 
                            placeholder="Describe your registration..." 
                            required 
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 min-h-[80px] ${formErrors.description ? 'border-red-500' : 'border-blue-200'}`}
                            value={form.description} 
                            onChange={(e) => handleChange("description", e.target.value)} 
                        />
                        {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-1">Discount Amount (€) *</label>
                        <input 
                            placeholder="Enter Discount Amount" 
                            required 
                            type="number" 
                            min="0" 
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 ${formErrors.discountAmount ? 'border-red-500' : 'border-blue-200'}`}
                            value={form.discountAmount} 
                            onChange={(e) => handleChange("discountAmount", e.target.value)} 
                        />
                        {formErrors.discountAmount && <p className="text-red-500 text-sm mt-1">{formErrors.discountAmount}</p>}
                        
                        {/* Processing Fee Display */}
                        {form.discountAmount && !isNaN(Number(form.discountAmount)) && Number(form.discountAmount) > 0 && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-sm text-blue-800">
                                    <div className="flex justify-between">
                                        <span>Base Amount:</span>
                                        <span>€{Number(form.discountAmount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Processing Fee (5%):</span>
                                        <span>€{(Number(form.discountAmount) * 0.05).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold border-t border-blue-300 pt-1 mt-1">
                                        <span>Total Amount:</span>
                                        <span>€{(Number(form.discountAmount) * 1.05).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
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
                        <input 
                            placeholder="Enter the code above" 
                            required 
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 ${formErrors.captcha ? 'border-red-500' : 'border-blue-200'}`}
                            value={form.captcha} 
                            onChange={(e) => handleChange("captcha", e.target.value)} 
                        />
                        {formErrors.captcha && <p className="text-red-500 text-sm mt-1">{formErrors.captcha}</p>}
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-blue-700 mb-2">Payment Method *</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    paymentMethod === 'stripe' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-300 hover:border-blue-300'
                                }`}
                                onClick={() => setPaymentMethod('stripe')}
                            >
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="stripe"
                                        checked={paymentMethod === 'stripe'}
                                        onChange={() => setPaymentMethod('stripe')}
                                        className="text-blue-600"
                                    />
                                    <span className="font-medium text-gray-900">Credit Card</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Pay securely with Stripe</p>
                            </div>
                            
                            <div 
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    paymentMethod === 'paypal' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-300 hover:border-blue-300'
                                }`}
                                onClick={() => setPaymentMethod('paypal')}
                            >
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="paypal"
                                        checked={paymentMethod === 'paypal'}
                                        onChange={() => setPaymentMethod('paypal')}
                                        className="text-blue-600"
                                    />
                                    <span className="font-medium text-gray-900">PayPal</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Pay with your PayPal account</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting} 
                        className={`w-full bg-blue-700 hover:bg-blue-800 text-white p-3 rounded font-semibold transition-all duration-200 ${
                            submitting ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                    >
                        {submitting 
                            ? (paypalProcessing ? 'Processing PayPal...' : 'Processing Stripe...') 
                            : `Pay with ${paymentMethod === 'paypal' ? 'PayPal' : 'Credit Card'}`
                        }
                    </button>
                </form>
            </div>
        </div>
     
    </div>
  );
};

export default DiscountRegistrationPage;