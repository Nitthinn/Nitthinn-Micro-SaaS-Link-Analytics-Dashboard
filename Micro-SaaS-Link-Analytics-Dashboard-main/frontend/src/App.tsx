import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Shorten from './pages/Shorten';
import Navbar from './components/Navbar';
import Analytics from './pages/Analytics'; 

const App = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  const handleAuth = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Navbar />
        <Routes>
          <Route path="/signin" element={<SignIn onAuth={handleAuth} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard token={token} /> : <Navigate to="/signin" />}
          />
          <Route
            path="/search"
            element={token ? <Search token={token} /> : <Navigate to="/signin" />}
          />
          <Route
            path="/shorten"
            element={token ? <Shorten token={token} /> : <Navigate to="/signin" />}
          />
          <Route
                path="/analytics"
                  element={token ? <Analytics token={token} /> : <Navigate to="/signin" />}
              />

          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
