import React, { useEffect, useState } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
interface StatsData {
  totalAccounts: number;
  totalTransactions: number;
  totalAlerts: number;
}

export default function AccountCards() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalAccounts: 0,
    totalTransactions: 0,
    totalAlerts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [accRes, txnRes, alertRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/accounts`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/api/transactions/total`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/api/alerts`, { credentials: "include" }),
        ]);

        const accData = await accRes.json();
        const txnData = await txnRes.json();
        const alertData = await alertRes.json();

        setStats({
          totalAccounts: Array.isArray(accData) ? accData.length : accData.content?.length || 0,
          totalTransactions: txnData.total || 0,
          totalAlerts: Array.isArray(alertData) ? alertData.length : alertData.content?.length || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
        title="Total accounts"
        value={stats.totalAccounts.toString()}
      />
      <Cards
        title="Total transactions processed"
        value={`₹ ${(stats.totalTransactions / 100000).toLocaleString("en-IN", { maximumFractionDigits: 2 })}L`}
      />
      <Cards
        title="Total alerts"
        value={stats.totalAlerts.toString()}
      />
    </>
  );
}


interface CardProps {
  title: string;
  value: string;
}

const Cards: React.FC<CardProps> = ({ title, value }) => {
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
