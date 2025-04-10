import { useState } from 'react';
import axios, { AxiosError } from 'axios';

const backendUrl = "https://micro-saas-link-analytics-dashboard.onrender.com";

interface ShortenProps {
  token: string;
}

export default function Shorten({ token }: ShortenProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/shorten`,
        { originalUrl, customAlias, expirationDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShortUrl(response.data.shortUrl);
    } catch (err) {
      const errorTyped = err as AxiosError<{ message: string }>;
      setError(errorTyped.response?.data?.message || 'Shorten failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Shorten Your URL</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Custom Alias (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Shorten
        </button>
      </form>

      {shortUrl && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded text-center">
          Short URL: <a href={shortUrl} className="text-blue-600 underline">{shortUrl}</a>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">
          {error}
        </div>
      )}
    </div>
  );
}
