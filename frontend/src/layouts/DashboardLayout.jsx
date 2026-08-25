import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import FreshBot from '../components/FreshBot';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <FreshBot />
    </div>
  );
}
