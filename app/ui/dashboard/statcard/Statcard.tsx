import React, { useEffect, useState } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
interface Data {
    totalTransactions:number,
    resolved:number,
}
export default function StatCards(){
    const [stats,setStats] = useState<Data>({
        totalTransactions:0,
        resolved:0,
    })
    useEffect(()=>{
        const fetchStats = async () => {
            try {
                const [txnRes,res] = await Promise.all([
                    fetch(`${BACKEND_URL}/api/transactions`,{credentials: "include"}),
                    fetch(`${BACKEND_URL}/api/transactions/resolved-revenue`,{credentials: "include"})
                ]);
                const txnData = await txnRes.json();
                const resData = await res.json();
                setStats({
                    totalTransactions: Array.isArray(txnData) ? txnData.length : txnData.content?.length || 0,
                    resolved: resData.resolved || 0,
                });
            } catch(err) {
                console.log("error",err);
            }
        }
        fetchStats();
    },[]);
    return(
        <>
        <Cards
         title="Total transactions processed"
         value={stats.totalTransactions}/>
         <Cards
         title="Estimated fraud value prevented"
         value={`₹ ${(stats.resolved / 100000).toLocaleString("en-IN", { maximumFractionDigits: 2 })}L`}/>
        </>
        
    )
};
interface CardProps {
    title: string;
    value: string;
}
const Cards:React.FC<CardProps>=({
    title,
    value,
})=>{
    return(
        <div className="p-4 col-span-6 rounded border border-stone-300 bg-gradient-to-br from-transparent via-transparent to-white/40">
            <div className="flex items-start justify-between mb-4">
                <div className="">
                    <h3 className="text-white mb-2 text-sm">{title}</h3>
                    <p className="text-white text-3xl font-semibold">{value}</p>
                </div>
            </div>
        </div>
    )
}