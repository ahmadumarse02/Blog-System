"use client";

import { Bell, Search, Settings, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
    location?: string;
  };
  onToggleSidebar?: () => void;
  onLogout?: () => void;
}

export function Header({ user, onToggleSidebar, onLogout }: HeaderProps) {
  const initials = user.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const primaryRole = user.roles[0] || "Employee";

  return (
    <header className="border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-8 w-8 p-0"
            title="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-hrms-slate-400" />
              <Input
                placeholder="Search employees, schedules, reports..."
                className="pl-10 bg-hrms-slate-50 border-hrms-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-2 rounded bg-hrms-blue-50 border border-hrms-blue-200">
                  <p className="text-sm font-medium">Leave Request Pending</p>
                  <p className="text-xs text-hrms-slate-600">
                    John Smith's vacation request needs approval
                  </p>
                  <p className="text-xs text-hrms-slate-400 mt-1">2 hours ago</p>
                </div>
                <div className="p-2 rounded bg-hrms-emerald-50 border border-hrms-emerald-200">
                  <p className="text-sm font-medium">Timesheet Submitted</p>
                  <p className="text-xs text-hrms-slate-600">
                    Week ending 06/15 timesheet ready for review
                  </p>
                  <p className="text-xs text-hrms-slate-400 mt-1">4 hours ago</p>
                </div>
                <div className="p-2 rounded bg-yellow-50 border border-yellow-200">
                  <p className="text-sm font-medium">Schedule Update</p>
                  <p className="text-xs text-hrms-slate-600">
                    Tomorrow's shift has been updated
                  </p>
                  <p className="text-xs text-hrms-slate-400 mt-1">6 hours ago</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-10">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-hrms-blue-600 text-white text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {primaryRole}
                    </Badge>
                    {user.location && (
                      <span className="text-xs text-hrms-slate-500">
                        {user.location}
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-hrms-slate-500">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {user.roles.map((role, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}