"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Plus, 
  Users, 
  Clock,
  Filter,
  Download,
  RefreshCw,
  MapPin,
  User
} from "lucide-react";

export default function SchedulePageClient() {
  console.log("Schedule page loaded");

  const upcomingShifts = [
    { id: 1, employee: "Sarah Johnson", role: "Manager", time: "09:00 AM - 05:00 PM", location: "Main Office", status: "Confirmed" },
    { id: 2, employee: "Mike Chen", role: "Developer", time: "10:00 AM - 06:00 PM", location: "Remote", status: "Pending" },
    { id: 3, employee: "Emily Davis", role: "Sales Rep", time: "08:00 AM - 04:00 PM", location: "Branch Office", status: "Confirmed" },
    { id: 4, employee: "James Wilson", role: "Support", time: "02:00 PM - 10:00 PM", location: "Main Office", status: "Confirmed" },
    { id: 5, employee: "Lisa Anderson", role: "Designer", time: "09:30 AM - 05:30 PM", location: "Remote", status: "Pending" }
  ];

  const weeklySchedule = [
    { day: "Monday", shifts: 28, coverage: 95 },
    { day: "Tuesday", shifts: 32, coverage: 100 },
    { day: "Wednesday", shifts: 30, coverage: 98 },
    { day: "Thursday", shifts: 29, coverage: 96 },
    { day: "Friday", shifts: 26, coverage: 88 },
    { day: "Saturday", shifts: 18, coverage: 75 },
    { day: "Sunday", shifts: 15, coverage: 65 }
  ];

  const shiftTemplates = [
    { name: "Morning Shift", time: "08:00 AM - 04:00 PM", employees: 12 },
    { name: "Evening Shift", time: "04:00 PM - 12:00 AM", employees: 8 },
    { name: "Night Shift", time: "12:00 AM - 08:00 AM", employees: 6 },
    { name: "Flexible Hours", time: "Variable", employees: 25 }
  ];

  const scheduleStats = [
    { label: "Total Shifts", value: "178", icon: Calendar, color: "text-hrms-blue-600" },
    { label: "Open Positions", value: "12", icon: Plus, color: "text-hrms-emerald-600" },
    { label: "Coverage Rate", value: "94%", icon: Users, color: "text-hrms-slate-600" },
    { label: "Overtime Hours", value: "45", icon: Clock, color: "text-yellow-600" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
            Scheduling & Roster
          </h1>
          <p className="text-hrms-slate-600">
            Manage work schedules, assign shifts, and optimize workforce coverage
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
            <Plus className="h-4 w-4" />
            Create Shift
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scheduleStats.map((stat, index) => (
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

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="shifts">Upcoming Shifts</TabsTrigger>
          <TabsTrigger value="templates">Shift Templates</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-hrms-blue-600" />
                Weekly Schedule Overview
              </CardTitle>
              <CardDescription>
                Visual representation of the current week's schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-hrms-slate-500 border-2 border-dashed border-hrms-slate-200 rounded-lg">
                <div className="text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Interactive Calendar</p>
                  <p className="text-sm">Drag and drop scheduling interface would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Shifts</CardTitle>
              <CardDescription>
                Next scheduled shifts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingShifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg hover:bg-hrms-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-hrms-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-hrms-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-hrms-slate-900">{shift.employee}</p>
                        <p className="text-sm text-hrms-slate-600">{shift.role}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-hrms-slate-900">{shift.time}</p>
                      <div className="flex items-center gap-1 text-sm text-hrms-slate-600">
                        <MapPin className="h-3 w-3" />
                        {shift.location}
                      </div>
                    </div>
                    <Badge variant={shift.status === "Confirmed" ? "default" : "secondary"}
                           className={shift.status === "Confirmed" ? "bg-hrms-emerald-100 text-hrms-emerald-700" : "bg-yellow-100 text-yellow-700"}>
                      {shift.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shift Templates</CardTitle>
              <CardDescription>
                Pre-configured shift patterns for quick scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shiftTemplates.map((template, index) => (
                  <div key={index} className="p-4 border border-hrms-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-hrms-slate-900">{template.name}</h3>
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-hrms-slate-600">
                        <Clock className="h-4 w-4" />
                        {template.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-hrms-slate-600">
                        <Users className="h-4 w-4" />
                        {template.employees} assigned employees
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Coverage Analysis</CardTitle>
              <CardDescription>
                Staffing levels and coverage rates by day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklySchedule.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-hrms-slate-900">{day.day}</span>
                      <div className="text-right">
                        <span className="text-sm text-hrms-slate-600">
                          {day.shifts} shifts • {day.coverage}% coverage
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-hrms-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          day.coverage >= 95 ? 'bg-hrms-emerald-500' :
                          day.coverage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${day.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Optimization</CardTitle>
              <CardDescription>
                AI-powered suggestions to improve schedule efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Optimize Weekend Coverage</h4>
                      <p className="text-sm text-blue-700">
                        Consider adding 2 more shifts on Saturday and Sunday to improve coverage from 70% to 85%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-1">Reduce Overtime</h4>
                      <p className="text-sm text-yellow-700">
                        Redistribute 15 hours of overtime by adjusting shift patterns in the Engineering department
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}