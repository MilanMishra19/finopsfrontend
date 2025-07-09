'use client';
import { useEffect, useState } from 'react';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function AnalystProfile() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchResolvedAlerts = async () => {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/alerts/resolved-alerts`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      } else {
        console.error("Failed to fetch resolved alerts");
      }
      setLoading(false);
    };

    fetchResolvedAlerts();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userRes = await fetch(`${BACKEND_URL}/api/analysts/me`, {
        credentials: "include",
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        console.log("User API response:", userData);
        setUser(userData);
      } else {
        console.error("Failed to fetch user data");
      }
    };
    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-5 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <span className='text-sm tracking-widest'>Fetching stats…</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Resolved Alerts By You</h1>

      <div className="bg-[#1e1e1e] p-4 rounded-lg shadow-md mb-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white/80 mb-2">Your Details</h2>
        <p className="text-sm text-white/50">
          <span className="text-white/70 font-medium">ID:</span> {user?.id || 'N/A'}
        </p>
        <p className="text-sm text-white/50">
          <span className="text-white/70 font-medium">Email:</span> {user?.email || 'N/A'}
        </p>
        <p className="text-sm text-white/50">
          <span className="text-white/70 font-medium">Name:</span> {user?.name || 'N/A'}
        </p>
      </div>

      {alerts.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
          <table className="min-w-full table-auto text-sm text-left text-gray-400">
            <thead className="bg-[#1f1f1f] text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Account Holder</th>
                <th className="px-6 py-3">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-[#181818]">
              {alerts.map((alert) => (
                <tr
                  key={alert.alertId}
                  className="border-b border-gray-700 hover:bg-[#222222] transition duration-200"
                >
                  <td className={`px-6 py-4 ${alert.severity==='CRITICAL'?'text-red-500':alert.severity==='MEDIUM'?'text-yellow-500':'text-green-500'}`}>{alert.severity}</td>
                  <td className="px-6 py-4">{alert.status}</td>
                  <td className="px-6 py-4">{alert.reason}</td>
                  <td className="px-6 py-4">₹{alert.amount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">{alert.name}</td>
                  <td className="px-6 py-4">
                    {new Date(alert.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-white/70">No resolved alerts found.</p>
      )}
    </div>
  );
}
