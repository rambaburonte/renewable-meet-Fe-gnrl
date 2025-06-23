import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminUserContext } from '../Context/AdminUserContext';
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { setAdminUser } = useAdminUserContext();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/admin/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: send and receive cookies
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const adminData = await response.json();

      // Store only admin data (JWT is now in HttpOnly cookie)
      sessionStorage.setItem('adminUser', JSON.stringify(adminData));

      // Update user context
      setAdminUser(adminData);

      // Redirect to dashboard or admin page
      navigate('/admin-dashboard');

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#111111] rounded-2xl shadow-lg p-8 border border-yellow-600">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">Admin Login</h2>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="admin@renewablemeet.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 bg-black text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
