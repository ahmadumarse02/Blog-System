"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { toast } from "sonner";

interface MainLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
    location?: string;
  };
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    console.log("Logging out user...");
    
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        toast.success("Logged out successfully");
        window.location.href = "/login";
      } else {
        toast.error("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-hrms-slate-50 via-white to-hrms-blue-50/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-hrms-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-hrms-emerald-100/50 rounded-full blur-3xl"></div>
      </div>
      
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex-shrink-0 relative z-10`}>
        <Sidebar 
          userRoles={user.roles} 
          isCollapsed={sidebarCollapsed}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header 
          user={user}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
        />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}