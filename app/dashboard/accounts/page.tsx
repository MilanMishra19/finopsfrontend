"use client";

import AccountCards from "@/app/ui/dashboard/statcard/Accountcard";
import Link from "next/link";
import { useEffect, useState } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Account(){
    const [accountData,setAccountData] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        const fetchAccounts = async () => {
            try{
                const res = await fetch(`${BACKEND_URL}/api/accounts`,{credentials:"include"});
                const data = await res.json();
                setAccountData(data);
            } catch(err) {
                console.error("failed to fetch accounts: ",err);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    },[]);
    const getAlertStats = (fraudTxns) => {
        if(fraudTxns>=3) return {label:"Alert", class:"bg-red-100 text-red-800"}
        if(fraudTxns >=1) return {label:"Under review",class:"bg-yellow-100 text-yellow-800"}
        return {label:"Pass", class:"bg-green-100 text-green-500"}
    };
    if(loading) {
    return (
      <div className="flex items-center justify-center gap-5">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        <span className='text-sm tracking-widest'>Fetching stats..</span>
      </div>
    )
  }
    return(
        <>
        <div className="grid px-4 grid-cols-12 gap-3 pb-3">
                    <div className="col-span-11 p-2 rounded">
                        <h1 className="uppercase tracking-widest leading-none font-bold">Accounts Overview</h1>
                    </div>
                </div>
                <div className="grid px-2 grid-cols-12 gap-3">
                    <AccountCards/>
                    <div className="col-span-12 bg-transperant border border-stone-300 rounded">
                          <table className="min-w-full divide-y divide-gray-200 rounded">
                <thead>
                    <tr className="bg-black">
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Account Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Account Holder Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Alert Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fraud Txns</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total Txns</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">KYC Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Summary</th>
                    </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gray-200">
                    {accountData.map((acc) => {
                        const alert = getAlertStats(acc.fraudTxns || 0);
                        return (
                            <tr key={acc.accountId} className="hover:bg-gray-500">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white/40">
                                    {acc.accountNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90">
                                    {acc.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${alert.class}`}>
                                        {alert.label}
                                    </span>
                                    {acc.fraudTxns > 0 && (
                                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                                            {acc.fraudTxns}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                    {acc.fraudTxns}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                    {acc.totalTxns}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        acc.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-500' : 'bg-yellow-100 text-yellow-500'
                                    }`}>
                                        {acc.kycStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/dashboard/accounts/${acc.accountId}`} className="text-indigo-600 hover:text-indigo-900">
                                        View Summary
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
                            
                    </div>
                </div>
        </>
    )
}