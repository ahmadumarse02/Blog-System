import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download,
  Users,
  Plane,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function LeaveCalendarPage() {
  console.log("Leave calendar page loaded");

  const currentMonth = "March 2024";
  const selectedDate = new Date();
  
  // Generate calendar days for March 2024
  const calendarData = [
    // Week 1
    [null, null, null, null, 1, 2, 3],
    // Week 2  
    [4, 5, 6, 7, 8, 9, 10],
    // Week 3
    [11, 12, 13, 14, 15, 16, 17],
    // Week 4
    [18, 19, 20, 21, 22, 23, 24],
    // Week 5
    [25, 26, 27, 28, 29, 30, 31]
  ];

  const leaveEvents = {
    8: [{ name: "Sarah Johnson", type: "Annual", color: "bg-blue-100 text-blue-700" }],
    11: [
      { name: "Mike Chen", type: "Sick", color: "bg-red-100 text-red-700" },
      { name: "Emily Davis", type: "Personal", color: "bg-yellow-100 text-yellow-700" }
    ],
    15: [
      { name: "James Wilson", type: "Annual", color: "bg-blue-100 text-blue-700" },
      { name: "Lisa Anderson", type: "Annual", color: "bg-blue-100 text-blue-700" },
      { name: "David Kim", type: "Personal", color: "bg-yellow-100 text-yellow-700" }
    ],
    22: [{ name: "Jennifer Lee", type: "Maternity", color: "bg-purple-100 text-purple-700" }],
    28: [{ name: "Robert Taylor", type: "Annual", color: "bg-blue-100 text-blue-700" }]
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const upcomingLeave = [
    {
      name: "Sarah Johnson",
      avatar: "",
      type: "Annual Leave",
      startDate: "Mar 8",
      endDate: "Mar 12",
      days: 5,
      status: "approved"
    },
    {
      name: "Mike Chen", 
      avatar: "",
      type: "Sick Leave",
      startDate: "Mar 11",
      endDate: "Mar 11",
      days: 1,
      status: "pending"
    },
    {
      name: "Emily Davis",
      avatar: "",
      type: "Personal Leave", 
      startDate: "Mar 15",
      endDate: "Mar 15",
      days: 1,
      status: "approved"
    },
    {
      name: "James Wilson",
      avatar: "",
      type: "Annual Leave",
      startDate: "Mar 15",
      endDate: "Mar 22",
      days: 6,
      status: "pending"
    },
    {
      name: "Jennifer Lee",
      avatar: "",
      type: "Maternity Leave",
      startDate: "Mar 22",
      endDate: "Jun 22", 
      days: 90,
      status: "approved"
    }
  ];

  const calendarStats = [
    { label: "Total Leave Days", value: "147", icon: Calendar, color: "text-hrms-blue-600" },
    { label: "People on Leave", value: "18", icon: Users, color: "text-hrms-emerald-600" },
    { label: "Pending Requests", value: "5", icon: AlertCircle, color: "text-yellow-600" },
    { label: "Coverage Rate", value: "92%", icon: CheckCircle, color: "text-purple-600" }
  ];

  const departmentCoverage = [
    { name: "Engineering", present: 28, total: 32, percentage: 87.5 },
    { name: "Sales", present: 24, total: 26, percentage: 92.3 },
    { name: "Marketing", present: 15, total: 18, percentage: 83.3 },
    { name: "HR", present: 8, total: 10, percentage: 80.0 }
  ];

  return (
    <div className="min-h-screen bg-hrms-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
              Leave Calendar
            </h1>
            <p className="text-hrms-slate-600">
              View team leave schedules and track coverage across departments
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Team View
            </Button>
            <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {calendarStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-hrms-slate-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-hrms-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-hrms-blue-600" />
                    {currentMonth}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      Today
                    </Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>Team leave schedule for the month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-hrms-slate-600">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Body */}
                  {calendarData.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`min-h-20 p-1 border border-hrms-slate-200 rounded ${
                            day ? 'bg-white hover:bg-hrms-slate-50' : 'bg-hrms-slate-50'
                          } ${day === selectedDate.getDate() ? 'ring-2 ring-hrms-blue-500' : ''}`}
                        >
                          {day && (
                            <>
                              <div className="text-sm font-medium text-hrms-slate-900 mb-1">
                                {day}
                              </div>
                              {leaveEvents[day] && (
                                <div className="space-y-1">
                                  {leaveEvents[day].slice(0, 2).map((event, eventIndex) => (
                                    <div
                                      key={eventIndex}
                                      className={`text-xs px-1 py-0.5 rounded ${event.color} truncate`}
                                    >
                                      {event.name.split(' ')[0]}
                                    </div>
                                  ))}
                                  {leaveEvents[day].length > 2 && (
                                    <div className="text-xs text-hrms-slate-500">
                                      +{leaveEvents[day].length - 2} more
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-hrms-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-200"></div>
                    <span className="text-xs text-hrms-slate-600">Annual Leave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-200"></div>
                    <span className="text-xs text-hrms-slate-600">Sick Leave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-200"></div>
                    <span className="text-xs text-hrms-slate-600">Personal Leave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-200"></div>
                    <span className="text-xs text-hrms-slate-600">Maternity/Paternity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Leave */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plane className="h-5 w-5 text-hrms-blue-600" />
                  Upcoming Leave
                </CardTitle>
                <CardDescription>Next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingLeave.slice(0, 4).map((leave, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={leave.avatar} alt={leave.name} />
                        <AvatarFallback className="bg-hrms-blue-600 text-white text-xs">
                          {leave.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-hrms-slate-900 truncate">
                          {leave.name}
                        </p>
                        <p className="text-xs text-hrms-slate-600">
                          {leave.startDate} - {leave.endDate}
                        </p>
                      </div>
                      <Badge 
                        variant={leave.status === 'approved' ? 'default' : 'secondary'}
                        className={`text-xs ${leave.status === 'approved' ? 'bg-hrms-emerald-100 text-hrms-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {leave.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department Coverage</CardTitle>
                <CardDescription>Current staffing levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentCoverage.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-hrms-slate-900">{dept.name}</span>
                        <span className="text-xs text-hrms-slate-600">
                          {dept.present}/{dept.total} ({dept.percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-hrms-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            dept.percentage >= 90 ? 'bg-hrms-emerald-500' :
                            dept.percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${dept.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Calendar className="h-4 w-4" />
                    Add Company Holiday
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="h-4 w-4" />
                    Bulk Approve Leave
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Export Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}