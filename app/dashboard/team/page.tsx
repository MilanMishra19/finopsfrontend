'use client';

import { useEffect, useState } from 'react';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
type Analyst = {
  analystId: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
};

export default function AnalystTable() {
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysts = async () => {
      const res = await fetch(`${BACKEND_URL}/api/analysts`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysts(data);
      }
      setLoading(false);
    };

    fetchAnalysts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <div className="animate-spin h-8 w-8 mr-3 border border-t-white border-gray-800 rounded-full" />
        <p>Loading analysts...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#121212] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Meet your Analytical Team</h1>
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
        <table className="min-w-full table-auto text-sm text-left text-gray-400">
          <thead className="bg-[#1f1f1f] text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-[#181818]">
            {analysts.map((analyst) => (
              <tr
                key={analyst.analystId}
                className="border-b border-gray-700 hover:bg-[#222222] transition duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-white">{analyst.name}</td>
                <td className="px-6 py-4">{analyst.email}</td>
                <td className="px-6 py-4">{analyst.phoneNumber}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      analyst.status === 'ACTIVE'
                        ? 'bg-green-600 text-white'
                        : analyst.status === 'ON LEAVE'?'bg-yellow-600 text-white':'bg-red-500 text-white'
                    }`}
                  >
                    {analyst.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(analyst.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
