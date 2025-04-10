import { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

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

interface Analytics {
  _id: string;
  shortLinkId: string;
  timestamp: string;
  ip: string;
  device: string;
  browser: string;
  location: string;
}

interface DashboardProps {
  token: string;
}

export default function Dashboard({ token }: DashboardProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linksRes, analyticsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/auth/links`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/api/auth/analytics`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLinks(linksRes.data);
        setAnalytics(analyticsRes.data.analytics);
        console.log("Fetched Analytics:", analyticsRes.data.analytics);
        // Process chart data here
        const countMap: Record<string, number> = {};
        analyticsRes.data.analytics.forEach((entry: Analytics) => {
          const key = `${entry.device || "Unknown"} ${entry.browser || "Unknown"}`;
          countMap[key] = (countMap[key] || 0) + 1;
        });

        const processedChartData = Object.entries(countMap).map(([name, count]) => ({
          name,
          count,
        }));

        console.log("Processed Chart Data:", processedChartData);
        setChartData(processedChartData);
        console.log("Chart Data Generated:", processedChartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getAnalyticsForLink = (linkId: string) =>
    analytics.filter((entry) => entry.shortLinkId === linkId);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          {links.length === 0 ? (
            <p className="text-gray-600">No links found.</p>
          ) : (
            <div className="space-y-6">
              {links.map((link) => {
                const stats = getAnalyticsForLink(link._id);
                const shortUrl = `${backendUrl}/${link.shortCode}`;

                return (
                  <div
                    key={link._id}
                    className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white"
                  >
                    <div className="mb-2">
                      <h2 className="text-xl font-semibold text-blue-700">
                        🔗 {link.customAlias || link.shortCode}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Original:{" "}
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          className="underline"
                        >
                          {link.originalUrl}
                        </a>
                      </p>
                      <p className="text-sm text-gray-500">
                        Created At: {new Date(link.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires:{" "}
                        {link.expirationDate
                          ? new Date(link.expirationDate).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>

                    <div className="mt-2">
                      <p className="font-medium text-gray-800">
                        Total Clicks: {link.totalClicks}
                      </p>

                      {stats.length > 0 ? (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">
                            Latest Clicks:
                          </p>
                          <ul className="text-sm text-gray-700 space-y-1 max-h-40 overflow-auto">
                            {stats.map((entry) => (
                              <li key={entry._id} className="border-b pb-1">
                                {new Date(entry.timestamp).toLocaleString()} –{" "}
                                {entry.device}, {entry.browser}, IP: {entry.ip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No analytics yet.</p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col">
                      <p className="text-sm text-gray-600 mb-1">Scan QR Code:</p>
                      <QRCodeSVG value={shortUrl} size={128} />
                      <a
                        href={shortUrl}
                        target="_blank"
                        className="text-sm text-blue-500 mt-2 underline"
                      >
                        {shortUrl}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

         {/* 📊 Device/Browser Breakdown Chart */}
<div className="mt-10 bg-white p-4 rounded-lg shadow" style={{ height: 400 }}>
  <h3 className="text-lg font-semibold mb-4">Device/Browser Breakdown</h3>
  {chartData.length > 0 ? (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <p className="text-gray-500">No analytics data available for chart.</p>
  )}
</div>

        </>
      )}
    </div>
  );
}
