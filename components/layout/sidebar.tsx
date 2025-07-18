"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  Plane,
  BarChart3,
  Settings,
  Building2,
  UserCog,
  FileText,
  MapPin,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavigationItem {
  title: string;
  href?: string;
  icon: React.ComponentType<any>;
  roles: string[];
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    roles: ["Admin", "HR Manager", "Location Manager", "Employee"],
  },
  {
    title: "Employee Management",
    icon: Users,
    roles: ["Admin", "HR Manager", "Location Manager"],
    children: [
      {
        title: "All Employees",
        href: "/employees",
        icon: Users,
        roles: ["Admin", "HR Manager"],
      },
      {
        title: "My Team",
        href: "/employees/team",
        icon: Users,
        roles: ["Location Manager"],
      },
      {
        title: "Organizational Chart",
        href: "/employees/org-chart",
        icon: Building2,
        roles: ["Admin", "HR Manager"],
      },
    ],
  },
  {
    title: "Time & Attendance",
    icon: Clock,
    roles: ["Admin", "HR Manager", "Location Manager", "Employee"],
    children: [
      {
        title: "Clock In/Out",
        href: "/attendance/clock",
        icon: Clock,
        roles: ["Employee"],
      },
      {
        title: "My Timesheet",
        href: "/attendance/timesheet",
        icon: FileText,
        roles: ["Employee"],
      },
      {
        title: "Team Attendance",
        href: "/attendance/team",
        icon: Users,
        roles: ["Location Manager"],
      },
      {
        title: "All Attendance",
        href: "/attendance",
        icon: Clock,
        roles: ["Admin", "HR Manager"],
      },
      {
        title: "Timesheet Management",
        href: "/timesheets",
        icon: FileText,
        roles: ["Admin", "HR Manager", "Location Manager"],
      },
      {
        title: "Attendance Reports",
        href: "/attendance/reports",
        icon: BarChart3,
        roles: ["Admin", "HR Manager", "Location Manager"],
      },
    ],
  },
  {
    title: "Scheduling",
    icon: Calendar,
    roles: ["Admin", "HR Manager", "Location Manager", "Employee"],
    children: [
      {
        title: "My Schedule",
        href: "/schedule/my",
        icon: Calendar,
        roles: ["Employee"],
      },
      {
        title: "Team Schedule",
        href: "/schedule/team",
        icon: Calendar,
        roles: ["Location Manager"],
      },
      {
        title: "Roster Management",
        href: "/schedule/roster",
        icon: Calendar,
        roles: ["Admin", "HR Manager", "Location Manager"],
      },
      {
        title: "Shift Templates",
        href: "/schedule/templates",
        icon: Settings,
        roles: ["Admin", "HR Manager"],
      },
    ],
  },
  {
    title: "Leave Management",
    icon: Plane,
    roles: ["Admin", "HR Manager", "Location Manager", "Employee"],
    children: [
      {
        title: "Request Leave",
        href: "/leave/request",
        icon: Plane,
        roles: ["Employee"],
      },
      {
        title: "My Leave",
        href: "/leave/my",
        icon: Plane,
        roles: ["Employee"],
      },
      {
        title: "Pending Approvals",
        href: "/leave/approvals",
        icon: FileText,
        roles: ["Location Manager", "HR Manager"],
      },
      {
        title: "Team Leave",
        href: "/leave/team",
        icon: Users,
        roles: ["Location Manager"],
      },
      {
        title: "Leave Calendar",
        href: "/leave/calendar",
        icon: Calendar,
        roles: ["Admin", "HR Manager", "Location Manager"],
      },
      {
        title: "Leave Policies",
        href: "/leave/policies",
        icon: Settings,
        roles: ["Admin", "HR Manager"],
      },
    ],
  },
  {
    title: "Payroll",
    icon: DollarSign,
    roles: ["Admin", "HR Manager", "Employee"],
    children: [
      {
        title: "My Payslips",
        href: "/payroll/payslips",
        icon: FileText,
        roles: ["Employee"],
      },
      {
        title: "Payroll Runs",
        href: "/payroll/runs",
        icon: DollarSign,
        roles: ["Admin", "HR Manager"],
      },
      {
        title: "Payroll Reports",
        href: "/payroll/reports",
        icon: BarChart3,
        roles: ["Admin", "HR Manager"],
      },
      {
        title: "Tax Settings",
        href: "/payroll/tax-settings",
        icon: Settings,
        roles: ["Admin"],
      },
    ],
  },
  {
    title: "Locations",
    href: "/locations",
    icon: MapPin,
    roles: ["Admin", "HR Manager"],
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
    roles: ["Admin", "HR Manager", "Location Manager"],
    children: [
      {
        title: "HR Dashboard",
        href: "/reports/hr-dashboard",
        icon: BarChart3,
        roles: ["Admin", "HR Manager"],
      },
      {
        title: "Location Dashboard",
        href: "/reports/location-dashboard",
        icon: MapPin,
        roles: ["Location Manager"],
      },
      {
        title: "Custom Reports",
        href: "/reports/custom",
        icon: FileText,
        roles: ["Admin", "HR Manager"],
      },
    ],
  },
  {
    title: "System Settings",
    icon: Settings,
    roles: ["Admin"],
    children: [
      {
        title: "User Management",
        href: "/settings/users",
        icon: UserCog,
        roles: ["Admin"],
      },
      {
        title: "Roles & Permissions",
        href: "/settings/roles",
        icon: UserCog,
        roles: ["Admin"],
      },
      {
        title: "Company Settings",
        href: "/settings",
        icon: Building2,
        roles: ["Admin"],
      },
      {
        title: "System Configuration",
        href: "/settings/system",
        icon: Settings,
        roles: ["Admin"],
      },
      {
        title: "Audit Logs",
        href: "/settings/audit-logs",
        icon: FileText,
        roles: ["Admin"],
      },
    ],
  },
];

interface SidebarProps {
  userRoles: string[];
  isCollapsed?: boolean;
}

export function Sidebar({ userRoles, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const hasAccess = (roles: string[]) => {
    return roles.some(role => userRoles.includes(role));
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    if (!hasAccess(item.roles)) {
      return null;
    }

    const isActive = item.href === pathname;
    const isOpen = openItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      const collapsibleButton = (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between h-10 px-3 text-left font-normal transition-all duration-200 hover:bg-hrms-slate-100",
            level > 0 && "ml-4 w-[calc(100%-1rem)]",
            isCollapsed && "px-2 justify-center"
          )}
        >
          <div className="flex items-center">
            <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>{item.title}</span>}
          </div>
          {!isCollapsed && (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      );

      return (
        <Collapsible key={item.title} open={isCollapsed ? false : isOpen} onOpenChange={() => !isCollapsed && toggleItem(item.title)}>
          <CollapsibleTrigger asChild>
            {isCollapsed ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {collapsibleButton}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    <p>{item.title}</p>
                    {item.children && (
                      <div className="text-xs text-hrms-slate-500 mt-1">
                        {item.children.filter(child => hasAccess(child.roles)).length} items
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              collapsibleButton
            )}
          </CollapsibleTrigger>
          {!isCollapsed && (
            <CollapsibleContent className="space-y-1">
              {item.children?.map(child => renderNavigationItem(child, level + 1))}
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    }

    const linkButton = (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start h-10 px-3 font-normal transition-all duration-200 hover:bg-hrms-slate-100",
          level > 0 && "ml-4 w-[calc(100%-1rem)]",
          isCollapsed && "px-2 justify-center",
          isActive && "bg-hrms-blue-50 text-hrms-blue-700 border-r-2 border-hrms-blue-600"
        )}
      >
        <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
        {!isCollapsed && <span>{item.title}</span>}
      </Button>
    );

    return (
      <Link key={item.title} href={item.href!}>
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {linkButton}
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          linkButton
        )}
      </Link>
    );
  };

  return (
    <div className={cn(
      "border-r bg-white h-full transition-all duration-300 shadow-sm",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header/Logo Section */}
      <div className={cn(
        "border-b border-hrms-slate-200 transition-all duration-300",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "flex items-center transition-all duration-300",
          isCollapsed ? "justify-center" : "space-x-3"
        )}>
          <div className={cn(
            "rounded-lg bg-gradient-to-br from-hrms-blue-600 to-hrms-blue-700 flex items-center justify-center shadow-sm transition-all duration-300",
            isCollapsed ? "w-10 h-10" : "w-10 h-10"
          )}>
            <Building2 className={cn("text-white transition-all duration-300", isCollapsed ? "h-5 w-5" : "h-6 w-6")} />
          </div>
          {!isCollapsed && (
            <div className="transition-all duration-300">
              <h1 className="font-bold text-xl text-hrms-slate-900">HRMS</h1>
              <p className="text-xs text-hrms-slate-500 font-medium">Enterprise Edition</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <ScrollArea className={cn(
        "h-[calc(100vh-80px)] transition-all duration-300",
        isCollapsed ? "p-1" : "p-3"
      )}>
        <nav className="space-y-1">
          {navigationItems.map(item => renderNavigationItem(item))}
        </nav>
      </ScrollArea>
    </div>
  );
}