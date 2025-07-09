"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { TextHoverEffect } from "@/app/ui/TextAnimate";
import Image from "next/image";

// ✅ Type Definitions
type Account = {
  accountId: string;
  name?: string;
};

type FormDataType = {
  accountId: string;
  amount: string;
  method: string;
  location: string;
  deviceId: string;
  isFraud: boolean;
  status: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Users() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState<FormDataType>({
    accountId: "",
    amount: "",
    method: "",
    location: "",
    deviceId: "",
    isFraud: false,
    status: "SUCCESS",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/accounts`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error("Error fetching accounts:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(`✅ Transaction created for account ${formData.accountId}`);
        setFormData({
          accountId: "",
          amount: "",
          method: "",
          location: "",
          deviceId: "",
          isFraud: false,
          status: "SUCCESS",
        });
      } else {
        setMessage(" Failed to create transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      setMessage(" An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 sm:p-12 bg-[#121212]">
      <motion.div
        className="form-container relative flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur-lg sm:p-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 z-0 h-full w-full rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #39FF14 0%, transparent 70%)',
            filter: 'blur(100px) opacity(0.4)',
            transform: 'scale(1.2)',
          }}
        ></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full gap-8">
          <div className="flex flex-row items-center gap-4">
            <Image src="/logo.svg" alt="logo" height={100} width={100} className="h-20 w-20" />
            <TextHoverEffect text="FinOps" />
          </div>

          {message && (
            <div className="text-white text-center font-medium">{message}</div>
          )}

          <form className="flex w-full flex-col items-center gap-6" onSubmit={handleSubmit}>
            {/* Account Dropdown */}
            <select
              className="w-full rounded-lg border-b-2 border-white bg-transparent py-4 text-sm text-white placeholder-white/70"
              required
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
            >
              <option value="">Select Account</option>
              {accounts.map((acc) => (
                <option key={acc.accountId} value={acc.accountId} className="text-black">
                  {acc.accountId}
                </option>
              ))}
            </select>

            {/* Amount */}
            <input
              className="w-full rounded-lg border-b-2 border-white bg-transparent py-4 text-sm text-white placeholder-white/80"
              type="number"
              required
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />

            {/* Method */}
            <input
              className="w-full rounded-lg border-b-2 border-white bg-transparent py-4 text-sm text-white placeholder-white/80"
              type="text"
              required
              placeholder="Payment Method (e.g. UPI, Card)"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            />

            {/* Location */}
            <input
              className="w-full rounded-lg border-b-2 border-white bg-transparent py-4 text-sm text-white placeholder-white/80"
              type="text"
              required
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            {/* Device ID */}
            <input
              className="w-full rounded-lg border-b-2 border-white bg-transparent py-4 text-sm text-white placeholder-white/80"
              type="text"
              required
              placeholder="Device ID"
              value={formData.deviceId}
              onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-white/90 py-4 font-bold uppercase tracking-widest text-black shadow-lg transition-all duration-300 hover:bg-white focus:outline-none"
            >
              {loading ? "Submitting..." : "Submit Transaction"}
            </button>

            <Link href="/login">
              <h3 className="text-sm text-blue-300 tracking-widest hover:underline">Analyst?</h3>
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
