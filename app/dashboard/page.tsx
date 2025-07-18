import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db, users } from "@/lib/db";
import { employees, attendanceRecords, leaveRequests, scheduledShifts } from "@/lib/db/schema";
import { eq, and, gte, lte, count, sql } from "drizzle-orm";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Clock, 
  Plane, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";

// Mock data function for demo
function getMockDashboardData(session: any) {
  console.log("Fetching mock dashboard data for user:", session.email);
  
  // Return mock data based on role
  if (session.roles?.includes("Location Manager")) {
    return {
      totalEmployees: 15, // Smaller team for location manager
      todayAttendance: 12,
      pendingLeaves: 2,
      todayShifts: 8,
    };
  }
  
  return {
    totalEmployees: 85,
    todayAttendance: 72,
    pendingLeaves: 8,
    todayShifts: 24,
  };
}

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  console.log("Dashboard accessed by:", session.email, "with roles:", session.roles);

  // Create user data from session (simplified for demo)
  const userData = {
    name: session.email === 'admin@company.com' ? 'System Administrator' :
          session.email === 'hr@company.com' ? 'Jane Smith' :
          session.email === 'manager@company.com' ? 'Sarah Johnson' :
          'John Doe',
    email: session.email,
    avatar: undefined,
    roles: Array.isArray(session.roles) ? session.roles : [],
    location: session.locationId ? `Location ${session.locationId}` : undefined,
  };

  const dashboardData = getMockDashboardData(session);

  const roles = Array.isArray(session.roles) ? session.roles : [];
  const isAdmin = roles.includes("Admin");
  const isHR = roles.includes("HR Manager");
  const isLocationManager = roles.includes("Location Manager");
  const isEmployee = roles.includes("Employee");

  return (
    <MainLayout user={userData}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-hrms-blue-600 via-hrms-blue-700 to-hrms-violet-600 rounded-2xl p-8 text-white animate-fade-in-up">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-3 animate-slide-in-right">
              Welcome back, {userData.name.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-hrms-blue-100 text-lg mb-6 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
              {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </p>
            <div className="flex items-center space-x-4 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30 transition-colors">
                {roles[0] || 'User'}
              </Badge>
              {userData.location && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30 transition-colors">
                  {userData.location}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(isAdmin || isHR || isLocationManager) && (
            <Card className="stat-card card-hover group animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-hrms-slate-600">
                  Total Employees
                </CardTitle>
                <div className="p-2 bg-hrms-blue-50 rounded-lg group-hover:bg-hrms-blue-100 transition-colors">
                  <Users className="h-4 w-4 text-hrms-blue-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-hrms-slate-900 mb-1">
                  <AnimatedCounter value={dashboardData.totalEmployees} delay={300} />
                </div>
                <p className="text-xs text-hrms-slate-500 flex items-center">
                  <span className="w-2 h-2 bg-hrms-blue-500 rounded-full mr-2 animate-pulse-glow"></span>
                  {isLocationManager ? "In your location" : "Active employees"}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="stat-card card-hover group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hrms-slate-600">
                Today's Attendance
              </CardTitle>
              <div className="p-2 bg-hrms-emerald-50 rounded-lg group-hover:bg-hrms-emerald-100 transition-colors">
                <Clock className="h-4 w-4 text-hrms-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-hrms-slate-900 mb-1">
                <AnimatedCounter value={dashboardData.todayAttendance} delay={400} />
              </div>
              <p className="text-xs text-hrms-slate-500 flex items-center">
                <span className="w-2 h-2 bg-hrms-emerald-500 rounded-full mr-2 animate-pulse-glow"></span>
                Employees clocked in
              </p>
            </CardContent>
          </Card>

          {(isAdmin || isHR || isLocationManager) && (
            <Card className="stat-card card-hover group animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-hrms-slate-600">
                  Pending Leaves
                </CardTitle>
                <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                  <Plane className="h-4 w-4 text-yellow-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-hrms-slate-900 mb-1">
                  <AnimatedCounter value={dashboardData.pendingLeaves} delay={500} />
                </div>
                <p className="text-xs text-hrms-slate-500 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse-glow"></span>
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="stat-card card-hover group animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hrms-slate-600">
                Today's Shifts
              </CardTitle>
              <div className="p-2 bg-hrms-violet-50 rounded-lg group-hover:bg-hrms-violet-100 transition-colors">
                <Calendar className="h-4 w-4 text-hrms-violet-600 group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-hrms-slate-900 mb-1">
                <AnimatedCounter value={dashboardData.todayShifts} delay={600} />
              </div>
              <p className="text-xs text-hrms-slate-500 flex items-center">
                <span className="w-2 h-2 bg-hrms-violet-500 rounded-full mr-2 animate-pulse-glow"></span>
                Scheduled shifts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Role-specific Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="floating-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-hrms-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-hrms-blue-600" />
                </div>
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest system activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-hrms-slate-50 transition-colors group">
                <div className="w-3 h-3 bg-hrms-emerald-500 rounded-full animate-pulse-glow group-hover:animate-bounce-gentle"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-hrms-slate-800">Timesheet submitted</p>
                  <p className="text-xs text-hrms-slate-500">Week ending June 15, 2025</p>
                </div>
                <span className="text-xs text-hrms-slate-400 bg-hrms-slate-100 px-2 py-1 rounded-full">2h ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-hrms-slate-50 transition-colors group">
                <div className="w-3 h-3 bg-hrms-blue-500 rounded-full animate-pulse-glow group-hover:animate-bounce-gentle"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-hrms-slate-800">Schedule updated</p>
                  <p className="text-xs text-hrms-slate-500">Next week's shifts available</p>
                </div>
                <span className="text-xs text-hrms-slate-400 bg-hrms-slate-100 px-2 py-1 rounded-full">4h ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-hrms-slate-50 transition-colors group">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse-glow group-hover:animate-bounce-gentle"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-hrms-slate-800">Leave request pending</p>
                  <p className="text-xs text-hrms-slate-500">Vacation request for July</p>
                </div>
                <span className="text-xs text-hrms-slate-400 bg-hrms-slate-100 px-2 py-1 rounded-full">1d ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="floating-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-hrms-violet-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-hrms-violet-600" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isEmployee && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-hrms-blue-50 to-hrms-blue-100 rounded-xl border border-hrms-blue-200 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-hrms-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-hrms-blue-900">Clock In/Out</span>
                    </div>
                    <CheckCircle className="h-5 w-5 text-hrms-emerald-600 animate-bounce-gentle" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-hrms-slate-50 to-hrms-slate-100 rounded-xl border border-hrms-slate-200 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-hrms-slate-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Plane className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-hrms-slate-800">Request Leave</span>
                    </div>
                  </div>
                </>
              )}
              
              {(isAdmin || isHR || isLocationManager) && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-600 rounded-lg group-hover:scale-110 transition-transform">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-yellow-900">Pending Approvals</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800 animate-pulse-glow">
                      <AnimatedCounter value={dashboardData.pendingLeaves} delay={800} />
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-hrms-violet-50 to-hrms-violet-100 rounded-xl border border-hrms-violet-200 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-hrms-violet-600 rounded-lg group-hover:scale-110 transition-transform">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-hrms-violet-900">Manage Schedules</span>
                    </div>
                  </div>
                </>
              )}
              
              {isAdmin && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-hrms-emerald-50 to-hrms-emerald-100 rounded-xl border border-hrms-emerald-200 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-hrms-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-hrms-emerald-900">System Settings</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}