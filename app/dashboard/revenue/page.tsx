"use client";

import RevenueCard from "@/app/ui/dashboard/statcard/RevenueCard";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Revenue() {
  const [rev, setRev] = useState<{
    data: any[] | null;
    statData: any[] | null;
    frdData: any[] | null;
  }>({
    data: null,
    statData: null,
    frdData: null,
  });

  const [loading, setLoading] = useState(true);

  const COLORS = ['#6200ee', '#3700b3', '#03dac6', '#018786'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [res, statRes, frdRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/transactions/revenue-fraud`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/api/alerts/status-distribution`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/api/transactions/fraud-city`, { credentials: "include" }),
        ]);

        const data = await res.json();
        const statData = await statRes.json();
        const frdData = await frdRes.json();

        // Ensure 'name' key exists for location
        const processedFrdData = (frdData || []).map((item: any) => ({
          ...item,
          name: item.location,
        }));

        setRev({ data, statData, frdData: processedFrdData });
      } catch (err) {
        console.error("Error fetching revenue data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Loading revenue dashboard...</div>;
  }

  return (
    <>
      <div className="grid px-4 grid-cols-12 gap-3 pb-3">
        <div className="col-span-11 p-1 rounded">
          <div className="flex flex-col justify-between items-start gap-2 p-5">
            <h1 className="uppercase tracking-widest leading-none font-bold text-white">
              Revenue Overview
            </h1>
          </div>
        </div>
      </div>

      <div className="grid px-4 grid-cols-12 gap-3">
        {/* Stats Cards */}
        <RevenueCard />

        {/* Area Chart */}
        <div className="col-span-12 border border-stone-300 p-5 rounded h-[300px]">
          <h1 className="font-bold tracking-widest text-center mb-2 text-white">
            Revenue & Fraud Loss Over Time
          </h1>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rev.data || []}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#03dac6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#03dac6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fraudLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#ccc" fontSize={10}/>
              <YAxis stroke="#ccc" fontSize={10}/>
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#03dac6" fill="url(#revenue)" />
              <Area type="monotone" dataKey="fraudLoss" stroke="#ef4444" fill="url(#fraudLoss)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="col-span-4 border border-stone-300 p-5 rounded h-[300px]">
          <h1 className="font-bold tracking-widest text-center mb-2 text-white">
            Alert Count by Status
          </h1>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={rev.statData || []}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {(rev.statData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart (Fraud Loss by Location) */}
        <div className="col-span-8 border border-stone-300 p-5 rounded h-[300px]">
          <h1 className="font-bold tracking-widest text-center mb-2 text-white">
            Fraud Loss by Location
          </h1>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rev.frdData || []}>
              <XAxis dataKey="name" 
              fontSize={8} 
  stroke="#ccc"
  interval={0} 
  angle={-45} 
  textAnchor="end" 
  height={70} />
              <YAxis stroke="#ccc" fontSize={8}/>
              <Tooltip
                formatter={(value: number) => `₹${(value / 100000).toFixed(2)}L`}
              />
              <Legend />
              <Bar dataKey="fraudLoss" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
