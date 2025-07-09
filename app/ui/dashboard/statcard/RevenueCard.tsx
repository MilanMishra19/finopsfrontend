import React, { useEffect, useState } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function RevenueCards() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ rev: 0, fraud: 0, resolved: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revRes, fraudRes, res] = await Promise.all([
          fetch(`${BACKEND_URL}/api/transactions/revenue`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/api/transactions/fraud-total`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/api/transactions/resolved-revenue`, { credentials: "include" }),
        ]);

        const revData = await revRes.json();
        const fraudData = await fraudRes.json();
        const resData = await res.json();

        setStats({
          rev: revData.rev || 0,
          fraud: fraudData.fraud || 0,
          resolved: resData.resolved || 0,
        });
      } catch (err) {
        console.error("Error fetching revenue stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if(loading) {
    return (
      <div className="flex items-center justify-center gap-5">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        <span className='text-sm tracking-widest'>Fetching stats..</span>
      </div>
    )
  }

  return (
    <>
      <Cards
        title="Total Revenue"
        value={`₹ ${(stats.rev / 100000).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}L`}
      />
      <Cards
        title="Loss from Fraud"
        value={`₹ ${(stats.fraud / 100000).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}L`}
      />
      <Cards
        title="Recovered Revenue"
        value={`₹ ${(stats.resolved / 100000).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}L`}
      />
    </>
  );
}

// Card Component
interface CardProps {
  title: string;
  value: string;
}

const Cards: React.FC<CardProps> = ({
  title,
  value,
}) => {
  return (
    <div className="p-4 col-span-4 rounded border border-stone-300 bg-gradient-to-br from-transparent via-transparent to-white/40">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white mb-2 text-sm">{title}</h3>
          <p className="text-white text-3xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};
