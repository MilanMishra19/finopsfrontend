"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Pchart() {
  const COLORS = ['#ef444480', '#f59e0b80', '#22c55e80']; // red, amber, green

  const [method, setMethod] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/transactions/method-stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include", 
        });

        if (!res.ok) {
          console.error("Failed to fetch method stats:", res.status);
          return;
        }

        const data = await res.json();
        setMethod(data);
      } catch (error) {
        console.error("Error fetching method stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
        <Tooltip />
        <Legend fontSize={8}/>
        <Pie
          data={method}
          dataKey="count" 
          nameKey="method" 
          cx="50%"
          cy="50%"
          outerRadius={80}
          fontSize={8}
          fill="#8884d8"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {method.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
