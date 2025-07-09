"use client";

import { LineChart, Line, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts"; 
import { useEffect, useState } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Lchart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHourlyAlerts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/alerts/hourly`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include', // 🔑 Important for session cookie
        });

        if (!res.ok) {
          console.error("Failed to fetch hourly alerts:", res.status);
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching data from alerts API:", err);
      }
    };

    fetchHourlyAlerts();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
