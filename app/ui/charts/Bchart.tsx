"use client";

import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Bchart() {
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/transactions/type`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setDatas(data);
        } else {
          console.error("Failed to fetch transaction type data:", res.status);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={datas}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="method" tick={{ fontSize: 8 }} interval={0}/>
        <YAxis tick={{fontSize:8}}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="volume" fill="#cc8899" />
      </BarChart>
    </ResponsiveContainer>
  );
}
