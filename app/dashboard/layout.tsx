import Navbar from "../ui/dashboard/navbar/Navbar";
import Sidebar from "../ui/dashboard/sidebar/Sidebar";
import React, { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const SIDEBAR_WIDTH_CLASS = "w-64";
  const MAIN_CONTENT_OFFSET_CLASS = "ml-64";

  return (
    <div className="flex h-screen">
      <div className={`fixed top-0 left-0 h-screen ${SIDEBAR_WIDTH_CLASS} shadow-lg z-30 overflow-y-auto`}>
        <Sidebar />
      </div>
      <div className={`flex-1 flex flex-col overflow-hidden ${MAIN_CONTENT_OFFSET_CLASS}`}>
        <div className="w-full h-[59px] border-b border-b-white/20 sticky top-0 z-10">
          <Navbar />
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
