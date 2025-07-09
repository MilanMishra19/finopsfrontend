'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

interface AccountDetails {
  accountId: string;
  accountNumber: string;
  name: string;
  dob: string;
  city: string;
  kycStatus: string;
  riskScore: number;
  totalTxns: number;
  fraudTxns: number;
}

interface Transaction {
  txnId: string;
  timeStamp: string;
  amount: number;
  location: string;
  deviceId: string;
  method: string;
  isFraud: string;
  isFlagged: string;
}

export default function AccountDetailsPage() {
  const { id } = useParams();
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [fraudTransactions, setFraudTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const [accRes, txnRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/accounts/${id}`, { credentials: 'include' }),
          fetch(`${BACKEND_URL}/api/transactions/fraud/${id}`, { credentials: 'include' }),
        ]);
        const acc = await accRes.json();
        const txns = await txnRes.json();
        setAccountDetails(acc);
        setFraudTransactions(txns);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!accountDetails) return <p className="text-white p-6">No account found.</p>;

  const totalFraudAmount = fraudTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const avgFraudAmount = fraudTransactions.length > 0 ? totalFraudAmount / fraudTransactions.length : 0;
  const maxFraudTxn = Math.max(...fraudTransactions.map((t) => t.amount), 0);

  return (
    <div className="text-white p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-10">
          <Image src="/user.svg" alt="user" height={100} width={100} />
          <div>
            <h1 className="text-xl font-bold tracking-widest">{accountDetails.name}</h1>
            <p className="text-sm tracking-wider">Account No: {accountDetails.accountNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { label: 'DOB', value: accountDetails.dob },
            { label: 'City', value: accountDetails.city },
            { label: 'KYC', value: accountDetails.kycStatus },
            { label: 'Risk', value: accountDetails.riskScore },
            { label: 'Total Txns', value: accountDetails.totalTxns },
            { label: 'Fraud Txns', value: accountDetails.fraudTxns },
          ].map(({ label, value }) => (
            <div key={label} className="p-2 bg-white/10 rounded">
              <strong className="block text-white/80">{label}</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-black p-3 rounded shadow-md mt-4">
          <h2 className="font-bold text-white/60 mb-2 uppercase tracking-wider">Fraud Insights</h2>
          <p>Avg Fraud Spend: ₹{avgFraudAmount.toFixed(2)}</p>
          <p>Total Fraud Spend: ₹{totalFraudAmount.toLocaleString("en-IN")}</p>
          <p>Max Fraud Spend: ₹{maxFraudTxn.toLocaleString("en-IN")}</p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <h2 className="text-white/80 tracking-wider text-lg">Fraud Transactions</h2>
          <Link href="/dashboard/accounts">
            <span className="text-blue-400 text-sm">← Back to Accounts</span>
          </Link>
        </div>

        <table className="w-full text-xs text-white mt-2">
          <thead className="bg-black">
            <tr>
              <th className="p-2">Time</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Location</th>
              <th className="p-2">Device</th>
              <th className="p-2">Method</th>
              <th className="p-2">Fraud</th>
              <th className="p-2">Flagged</th>
            </tr>
          </thead>
          <tbody>
            {fraudTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-white/60">No fraud transactions.</td>
              </tr>
            ) : (
              fraudTransactions.map((txn) => (
                <tr key={txn.txnId} className="bg-white/5 border-b border-white/10">
                  <td className="p-2">{new Date(txn.timeStamp).toLocaleString()}</td>
                  <td className="p-2">₹{txn.amount.toLocaleString("en-IN")}</td>
                  <td className="p-2">{txn.location}</td>
                  <td className="p-2">{txn.deviceId}</td>
                  <td className="p-2">{txn.method}</td>
                  <td className="p-2">{txn.isFraud === 'true' ? 'Fraud' : 'Legit'}</td>
                  <td className="p-2">{txn.isFlagged === 'true' ? 'Flagged' : 'Clear'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
