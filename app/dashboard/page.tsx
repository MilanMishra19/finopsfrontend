"use client";

import Bchart from "../ui/charts/Bchart";
import Lchart from "../ui/charts/Lchart";
import Bbchart from "../ui/charts/Bbchart";
import Pchart from "../ui/charts/Pchart";
import StatCards from "../ui/dashboard/statcard/Statcard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

type Analyst = {
  name: string;
  email?: string;
  id?: string;
  // Add other fields if required
};

export default function Dashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<Analyst | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/analysts/me`, {
          credentials: "include",
        });

        if (response.ok) {
          const data: Analyst = await response.json();
          setStats(data);
          setAuthorized(true);
          console.log("Stats fetched successfully:", data);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        setAuthorized(false);
        console.log("Error fetching stats:", error);
        alert("You are not authorized to view this page. Please log in.");
        router.push("/login");
      }
    };

    fetchStats();
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mr-4"></div>
        <span className="tracking-widest text-sm">Checking authorization…</span>
      </div>
    );
  }

  if (!authorized || !stats) {
    return null; // avoids flicker during redirect
  }

  return (
    <>
      <div className="grid px-4 grid-cols-12 gap-3 pb-3">
        <div className="col-span-11 p-1 rounded">
          <div className="flex flex-col justify-between items-start gap-2 p-5">
            <h1 className="uppercase tracking-widest leading-none font-bold">
              Hi, {stats.name}
            </h1>
            <p className="tracking-widest font-light text-white/30">
              Welcome to your fraud analysis dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="grid px-4 grid-cols-12 gap-3">
        <StatCards />

        <div className="col-span-12 bg-transparent border border-stone-300 p-5 rounded h-[300px]">
          <h1 className="font-bold tracking-widest text-center">
            Alert triggers over time (hourly)
          </h1>
          <Lchart />
        </div>

        <div className="col-span-4 bg-transparent border border-stone-300 p-5 rounded h-[300px]">
          <h1 className="font-bold tracking-widest text-center">
            Volume vs Mode of Payment
          </h1>
          <Bchart />
        </div>

        <div className="col-span-4 bg-transparent p-5 rounded border border-stone-300 h-[300px]">
          <h1 className="font-bold tracking-widest text-center">
            Alert count vs Severity
          </h1>
          <Bbchart />
        </div>

        <div className="col-span-4 bg-transparent p-5 rounded border border-stone-300 h-[300px]">
          <h1 className="font-bold tracking-widest text-center">
            Txn count vs Method
          </h1>
          <Pchart />
        </div>
      </div>
    </>
  );
}
