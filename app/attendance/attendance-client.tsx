"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Users, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity
} from "lucide-react";

export default function AttendancePageClient() {
  console.log("Attendance page loaded");

  const attendanceStats = [
    { label: "Present Today", value: "142", icon: CheckCircle, color: "text-emerald-600" },
    { label: "Absent", value: "8", icon: XCircle, color: "text-red-500" },
    { label: "Late Arrivals", value: "12", icon: AlertCircle, color: "text-yellow-500" },
    { label: "On Leave", value: "18", icon: Calendar, color: "text-blue-500" }
  ];

  const recentAttendance = [
    { name: "Sarah Johnson", time: "09:15 AM", status: "Late", location: "Main Office" },
    { name: "Mike Chen", time: "08:45 AM", status: "On Time", location: "Remote" },
    { name: "Emily Davis", time: "10:30 AM", status: "Late", location: "Branch Office" },
    { name: "James Wilson", time: "08:30 AM", status: "On Time", location: "Main Office" },
    { name: "Lisa Anderson", time: "09:00 AM", status: "On Time", location: "Remote" }
  ];

  const departmentAttendance = [
    { department: "Engineering", present: 28, total: 32, percentage: 87.5 },
    { department: "Sales", present: 24, total: 26, percentage: 92.3 },
    { department: "Marketing", present: 15, total: 18, percentage: 83.3 },
    { department: "HR", present: 8, total: 10, percentage: 80.0 },
    { department: "Finance", present: 12, total: 14, percentage: 85.7 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
            Time & Attendance
          </h1>
          <p className="text-hrms-slate-600">
            Monitor attendance, track working hours, and manage time records
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Activity className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
            <Clock className="h-4 w-4" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {attendanceStats.map((stat, index) => (
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-hrms-blue-600" />
                  Weekly Attendance Trend
                </CardTitle>
                <CardDescription>
                  Attendance percentage over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-hrms-slate-500">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-hrms-emerald-600" />
                  Working Hours Summary
                </CardTitle>
                <CardDescription>
                  Average working hours this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-hrms-slate-600">Regular Hours</span>
                    <span className="font-semibold">7.8 hrs/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-hrms-slate-600">Overtime</span>
                    <span className="font-semibold">1.2 hrs/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-hrms-slate-600">Break Time</span>
                    <span className="font-semibold">0.8 hrs/day</span>
                  </div>
                  <div className="pt-4 border-t border-hrms-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Productive Hours</span>
                      <span className="font-bold text-hrms-blue-600">9.0 hrs/day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Clock-ins</CardTitle>
              <CardDescription>
                Latest attendance records from today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAttendance.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg hover:bg-hrms-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-hrms-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-hrms-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-hrms-slate-900">{record.name}</p>
                        <p className="text-sm text-hrms-slate-600">{record.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-hrms-slate-900">{record.time}</p>
                      <Badge variant={record.status === "On Time" ? "default" : "secondary"} 
                             className={record.status === "On Time" ? "bg-hrms-emerald-100 text-hrms-emerald-700" : "bg-yellow-100 text-yellow-700"}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Attendance</CardTitle>
              <CardDescription>
                Attendance rates by department for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentAttendance.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-hrms-slate-900">{dept.department}</span>
                      <span className="text-sm text-hrms-slate-600">
                        {dept.present}/{dept.total} ({dept.percentage.toFixed(1)}%)
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

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>
                Generate and download detailed attendance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Activity className="h-6 w-6" />
                  <span>Daily Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Weekly Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Monthly Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Department Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}