import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const backendUrl = "https://micro-saas-link-analytics-dashboard.onrender.com";

export default function SignIn({ onAuth }: { onAuth: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const handleSignin = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
      onAuth(res.data.token);
      setMessage('Sign in successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.data && typeof err.response.data === 'object') {
        const data = err.response.data as { message?: string };
        setMessage(data.message || 'Login failed');
      } else {
        setMessage('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-md w-full bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

        

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white w-full p-2 mt-2 rounded hover:bg-blue-700"
          onClick={handleSignin}
        >
          Sign In
        </button>
        {message && (
        <p className="text-sm text-blue-600 text-center mt-5">{message}</p>
      )}  
      </div>
    </div>
  );
}
