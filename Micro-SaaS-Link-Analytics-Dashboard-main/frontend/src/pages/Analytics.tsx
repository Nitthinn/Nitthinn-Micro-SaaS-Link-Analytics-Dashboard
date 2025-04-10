// src/pages/Analytics.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const backendUrl = "https://micro-saas-link-analytics-dashboard.onrender.com";

interface UrlData {
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  expired: boolean;
}

interface ClickData {
  date: string;
  clicks: number;
}

interface DeviceData {
  name: string;
  count: number;
}

interface AnalyticsProps {
  token: string;
}

export default function Analytics({ token }: AnalyticsProps) {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [clickData, setClickData] = useState<ClickData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUrls(res.data.urls || []);
        setClickData(res.data.clicksOverTime || []);
        setDeviceData(res.data.deviceStats || []);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
    };

    if (token) fetchAnalytics();
  }, [token]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>

      {/* URL Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Original URL</th>
              <th className="p-2">Short URL</th>
              <th className="p-2">Clicks</th>
              <th className="p-2">Created</th>
              <th className="p-2">Expires?</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{url.originalUrl}</td>
                <td className="p-2 text-blue-600 break-words">{url.shortUrl}</td>
                <td className="p-2">{url.clicks}</td>
                <td className="p-2">
                  {new Date(url.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="p-2">{url.expired ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clicks Over Time Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Clicks Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={clickData}>
            <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Device Breakdown Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Device/Browser Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deviceData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
