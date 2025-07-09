"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from 'react';

export default function Navbar() {
    const [stats,setStats] = useState('');
    useEffect(()=>{
        const fetchStats = async () => {
                const response = await fetch("http://localhost:8080/api/analysts/me",{credentials:'include'});
                if(response.ok) {
                    const data = await response.json();
                    setStats(data);
                    console.log("Stats fetched successfully:", data);
                }
                else{
                    console.error("user unauthorized");
                }
        }
        fetchStats();
    },[]);
    return(
        <div className="navbar bg-gray-800 border-b border-b-white/20 h-[59px] flex flex-row justify-between">
            <div className="flex items-center p-5">
                <div className="flex flex-col gap-2">
                    <Image src='/user.svg' height={500} width={500} alt="user" className="h-7 w-7 rounded-full bg-white"/>
                    <span className="text-[10px] uppercase tracking-wide text-white">{stats.name}</span>
                </div>
            </div>
            <div className="navitem flex items-center gap-10 pr-5">
                <Link href='/'>
                <Image alt="search" src='/search.svg' width={500} height={500} className="h-7 w-7"/> 
                </Link>
                <Link href='/'>
                <Image alt="notif" src='/bell.svg' width={500} height={500} className="h-7 w-7"/>
                </Link>
                <Link href='/'>
                <Image alt="refresh" src='/refresh.svg' width={500} height={500} className="h-7 w-7"/> 
                </Link>
            </div>
        </div>
    )
}