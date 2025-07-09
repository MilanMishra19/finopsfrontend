"use client";

import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Bbchart() {
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/alerts/severity`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (res.ok) {
          const json = await res.json();
          setDatas(json);
        } else {
          console.error("Not authenticated or error fetching alerts:", res.status);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={datas}
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="severity" tick={{fontSize: 8}} interval={0}/>
        <YAxis tick={{fontSize: 8}}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="triggers" fill="#8f00ff" />
      </BarChart>
    </ResponsiveContainer>
  );
}
