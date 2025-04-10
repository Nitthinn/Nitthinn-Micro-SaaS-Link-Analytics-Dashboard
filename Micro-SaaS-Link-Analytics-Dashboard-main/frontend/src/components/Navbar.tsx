import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/signin');
  };

  return (
    <nav className="bg-black text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          URL Shortener
        </Link>

        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/shorten" className="hover:underline">Shorten</Link>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/search" className="hover:underline">Search</Link>
              <Link to="/analytics" className="hover:underline">Analytics</Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:underline">Sign In</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>

            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
