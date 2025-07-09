"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Sidebar() {
    const router = useRouter();
    const [,startTransition] = useTransition();
    const handleLogOut = async () => {
        try{
            const res = await fetch(`${BACKEND_URL}/logout`,{
                method:"POST",
                credentials:"include",
            });
            if(res.ok){
                alert("Logout successful");
                startTransition(()=>{
                    router.push("/login")
                });
            }
            else{
                alert("Logout failed")
            }
        } catch(err) {
            console.error("Logout error",err)
            alert("Error occured on backend side")
        }
    };
    return(
        <div className="menu fixed w-64 h-screen left-0 top-0 bg-white/30 z-30 overflow-y-auto"> {/* Added overflow-y-auto for scrollable sidebar content if it gets too long */}
            <div className="item flex flex-col gap-10 mb-5 justify-between">
                <span className="title text-xs font-light tracking-widest flex flex-col justify-between gap-2.5">
                    <span className='text-xs font-extralight tracking-widest uppercase text-white/30 pl-2'>pages</span>
                    <Link  href='/dashboard' className='flex items-center gap-2.5 p-[10px] rounded-md hover:bg-white/50'>
                    <Image height={500} width={500} src='/home.svg' alt="home" className="h-6 w-6 text-white"/>
                    <span className="listItem uppercase">Home</span>
                    </Link>
                     <Link  href='/dashboard/accounts' className='flex items-center gap-2.5 p-[10px] rounded-md hover:bg-white/50'>
                    <Image height={500} width={500} src='/account.svg' alt="account" className="h-6 w-6 text-white"/>
                    <span className="listItem uppercase">Account</span>
                    </Link>
                     <Link  href='/dashboard/alerts' className='flex items-center gap-2.5 p-[10px] rounded-md hover:bg-white/50'>
                    <Image height={500} width={500} src='/alrt.svg' alt="alerts" className="h-6 w-6 text-white"/>
                    <span className="listItem uppercase">Alerts</span>
                    </Link>
                    <span className='text-xs font-extralight tracking-widest uppercase text-white/30 pl-2'>Analytics</span>
                     <Link  href='/dashboard/revenue' className='flex items-center gap-2.5 p-[10px] rounded-md hover:bg-white/50'>
                    <Image height={500} width={500} src='/card.svg' alt="revenue" className="h-6 w-6 text-white"/>
                    <span className="listItem uppercase">Revenue</span>
                    </Link>
                     <Link  href='/dashboard/reports' className='flex items-center gap-2.5 p-[10px] rounded-md hover:bg-white/50'>
                    <Image height={500} width={500} src='/report.svg' alt="report" className="h-6 w-6 text-white"/>
                    <span className="listItem uppercase">report</span>
                    </Link>
                     <Link  href='/dashboard/team' className='flex items-center gap-2.5 p-[10px] rounded-md hover:bg-white/50'>
                    <Image height={500} width={500} src='/team.svg' alt="team" className="h-6 w-6 text-white"/>
                    <span className="listItem uppercase">teams</span>
                    </Link>
                    <span className='text-xs font-extralight tracking-widest uppercase text-white/30 pl-2'>User</span>
                     <Link  href='/dashboard/settings' className='flex items-center gap-2.5 p-[10px] rounded-md hover:bg-white/50'>
                    <Image height={500} width={500} src='/setting.svg' alt="home" className="h-6 w-6 text-white"/>
                    <span className="listItem uppercase">settings</span>
                    </Link>
                     <Link  href='/dashboard/help' className='flex items-center gap-2.5 p-[10px] rounded-md hover:bg-white/50'>
                    <Image height={500} width={500} src='/logout.svg' alt="setting" className="h-6 w-6 text-white"/>
                    <span className="listItem uppercase">help</span>
                    </Link>
                    <span
                      onClick={handleLogOut}
                      className="cursor-pointer flex items-center gap-2.5 p-[10px] rounded-md hover:bg-red-500/50"
                    >
                      <Image height={500} width={500} src='/logou.svg' alt="logout" className="h-6 w-6 text-white" />
                      <span className="listItem uppercase">logout</span>
                    </span>
                    <Image src='/logo.svg' alt="logo" height={500} width={500} className="h-10 w-10"/>
                    <span className="listItem tracking-widest text-xl">FinOps</span>
                </span>
            </div>
        </div>
    )
}