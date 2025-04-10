import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const backendUrl = "https://micro-saas-link-analytics-dashboard.onrender.com";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/signup`, { email, password });

      // ✅ Redirect to SignIn with success message
      navigate('/signin', {
        state: { message: 'Signup successful. Please sign in with your credentials.' },
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-md w-full bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 mt-2 rounded hover:bg-blue-700"
          onClick={handleSignup}
        >
          Sign Up
        </button>

        {message && (
          <p className="text-red-500 text-sm mt-2 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
