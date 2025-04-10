import { useState } from 'react';
import axios, { AxiosError } from 'axios';

const backendUrl = "https://micro-saas-link-analytics-dashboard.onrender.com";

interface Link {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  totalClicks: number;
  createdAt: string;
  expirationDate?: string;
}

export default function Search({ token }: { token: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Link[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/search`,
        { originalUrl: query },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResults(res.data.results);
      setError('');
    } catch (err) {
      const errorTyped = err as AxiosError<{ message: string }>;
      setError(errorTyped.response?.data?.message || 'Search failed');
      setResults([]);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔍 Search Your Shortened Links</h2>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter full or partial original URL"
          className="border border-gray-300 p-2 rounded w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold mb-2">🔗 Matching Results:</h3>
          {results.map((link) => (
            <div
              key={link._id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <p className="text-gray-800">
                <strong>Alias:</strong> {link.customAlias || link.shortCode}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Original:</strong>{' '}
                <a
                  href={link.originalUrl}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {link.originalUrl}
                </a>
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(link.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Expires:{' '}
                {link.expirationDate
                  ? new Date(link.expirationDate).toLocaleDateString()
                  : 'Never'}
              </p>
              <p className="text-sm font-medium text-gray-700">
                Total Clicks: {link.totalClicks}
              </p>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !error && (
        <p className="text-gray-500 mt-4">No results yet.</p>
      )}
    </div>
  );
}
