"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, 
  Plus, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  FileText,
  TrendingUp
} from "lucide-react";

export default function LeavePageClient() {
  console.log("Leave page loaded");

  const leaveStats = [
    { label: "Total Requests", value: "23", icon: FileText, color: "text-hrms-blue-600" },
    { label: "Pending Approval", value: "8", icon: AlertCircle, color: "text-yellow-600" },
    { label: "Approved", value: "12", icon: CheckCircle, color: "text-hrms-emerald-600" },
    { label: "Currently on Leave", value: "18", icon: Plane, color: "text-hrms-slate-600" }
  ];

  const pendingRequests = [
    { 
      id: 1, 
      employee: "Sarah Johnson", 
      type: "Annual Leave", 
      dates: "Mar 15 - Mar 22, 2024", 
      days: 6, 
      status: "Pending",
      submitted: "2 days ago"
    },
    { 
      id: 2, 
      employee: "Mike Chen", 
      type: "Sick Leave", 
      dates: "Mar 12 - Mar 14, 2024", 
      days: 3, 
      status: "Pending",
      submitted: "1 day ago"
    },
    { 
      id: 3, 
      employee: "Emily Davis", 
      type: "Personal Leave", 
      dates: "Mar 20, 2024", 
      days: 1, 
      status: "Pending",
      submitted: "3 hours ago"
    },
    { 
      id: 4, 
      employee: "James Wilson", 
      type: "Maternity Leave", 
      dates: "Apr 1 - Jun 30, 2024", 
      days: 90, 
      status: "Pending",
      submitted: "1 week ago"
    }
  ];

  const leaveTypes = [
    { name: "Annual Leave", available: 156, used: 89, color: "bg-hrms-blue-500" },
    { name: "Sick Leave", available: 78, used: 34, color: "bg-hrms-emerald-500" },
    { name: "Personal Leave", available: 45, used: 23, color: "bg-yellow-500" },
    { name: "Maternity/Paternity", available: 12, used: 8, color: "bg-purple-500" }
  ];

  const upcomingLeave = [
    { employee: "Lisa Anderson", type: "Annual", start: "Mar 18", end: "Mar 25", days: 6 },
    { employee: "David Kim", type: "Personal", start: "Mar 20", end: "Mar 20", days: 1 },
    { employee: "Jennifer Lee", type: "Annual", start: "Mar 22", end: "Apr 5", days: 10 },
    { employee: "Robert Taylor", type: "Sick", start: "Mar 19", end: "Mar 21", days: 3 }
  ];

  const departmentUsage = [
    { department: "Engineering", used: 145, allocated: 200, percentage: 72.5 },
    { department: "Sales", used: 89, allocated: 120, percentage: 74.2 },
    { department: "Marketing", used: 67, allocated: 90, percentage: 74.4 },
    { department: "HR", used: 34, allocated: 50, percentage: 68.0 },
    { department: "Finance", used: 56, allocated: 70, percentage: 80.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
            Leave Management
          </h1>
          <p className="text-hrms-slate-600">
            Manage leave requests, track balances, and approve time off
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Leave Calendar
          </Button>
          <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaveStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-hrms-slate-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-hrms-slate-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-hrms-slate-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Leave</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Pending Approval
              </CardTitle>
              <CardDescription>
                Leave requests awaiting your approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-4 border border-hrms-slate-200 rounded-lg hover:bg-hrms-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-hrms-slate-900">{request.employee}</h3>
                        <p className="text-sm text-hrms-slate-600">{request.type}</p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        {request.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-hrms-slate-500 uppercase tracking-wide">Duration</p>
                        <p className="text-sm font-medium">{request.dates}</p>
                      </div>
                      <div>
                        <p className="text-xs text-hrms-slate-500 uppercase tracking-wide">Days</p>
                        <p className="text-sm font-medium">{request.days} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-hrms-slate-500 uppercase tracking-wide">Submitted</p>
                        <p className="text-sm font-medium">{request.submitted}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-hrms-emerald-600 hover:bg-hrms-emerald-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-hrms-blue-600" />
                Upcoming Leave
              </CardTitle>
              <CardDescription>
                Approved leave scheduled for the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingLeave.map((leave, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-hrms-blue-100 flex items-center justify-center">
                        <Plane className="h-5 w-5 text-hrms-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-hrms-slate-900">{leave.employee}</p>
                        <p className="text-sm text-hrms-slate-600">{leave.type} Leave</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-hrms-slate-900">
                        {leave.start} - {leave.end}
                      </p>
                      <p className="text-sm text-hrms-slate-600">{leave.days} days</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-hrms-emerald-600" />
                Leave Type Overview
              </CardTitle>
              <CardDescription>
                Company-wide leave usage by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {leaveTypes.map((type, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-hrms-slate-900">{type.name}</span>
                      <span className="text-sm text-hrms-slate-600">
                        {type.used} used / {type.available} available
                      </span>
                    </div>
                    <div className="w-full bg-hrms-slate-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${type.color}`}
                        style={{ width: `${(type.used / type.available) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-hrms-slate-500">
                      {((type.used / type.available) * 100).toFixed(1)}% utilization
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Usage</CardTitle>
              <CardDescription>
                Leave utilization by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentUsage.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-hrms-slate-900">{dept.department}</span>
                      <span className="text-sm text-hrms-slate-600">
                        {dept.used}/{dept.allocated} days ({dept.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-hrms-slate-200 rounded-full h-2">
                      <div 
                        className="bg-hrms-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-hrms-blue-600" />
                  Leave Trends
                </CardTitle>
                <CardDescription>
                  Monthly leave usage over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-hrms-slate-500 border-2 border-dashed border-hrms-slate-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Trend chart would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-hrms-emerald-600" />
                  Peak Periods
                </CardTitle>
                <CardDescription>
                  Most popular leave periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-hrms-slate-600">December</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-hrms-slate-200 rounded-full h-2">
                        <div className="bg-hrms-blue-600 h-2 rounded-full w-[85%]"></div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-hrms-slate-600">August</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-hrms-slate-200 rounded-full h-2">
                        <div className="bg-hrms-blue-600 h-2 rounded-full w-[72%]"></div>
                      </div>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-hrms-slate-600">July</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-hrms-slate-200 rounded-full h-2">
                        <div className="bg-hrms-blue-600 h-2 rounded-full w-[68%]"></div>
                      </div>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-hrms-slate-600">June</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-hrms-slate-200 rounded-full h-2">
                        <div className="bg-hrms-blue-600 h-2 rounded-full w-[45%]"></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}