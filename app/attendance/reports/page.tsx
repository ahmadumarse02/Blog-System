import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock,
  FileText,
  BarChart3,
  PieChart
} from "lucide-react";

export default function AttendanceReportsPage() {
  console.log("Attendance reports page loaded");

  const reportTypes = [
    {
      title: "Daily Attendance Report",
      description: "Detailed daily attendance records with clock-in/out times",
      icon: Calendar,
      color: "bg-hrms-blue-100 text-hrms-blue-600",
      frequency: "Daily",
      lastGenerated: "Today 9:00 AM"
    },
    {
      title: "Weekly Summary Report",
      description: "Weekly attendance patterns and trend analysis",
      icon: TrendingUp,
      color: "bg-hrms-emerald-100 text-hrms-emerald-600",
      frequency: "Weekly",
      lastGenerated: "Monday 8:00 AM"
    },
    {
      title: "Department Attendance",
      description: "Attendance rates by department and team",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      frequency: "Monthly",
      lastGenerated: "March 1st"
    },
    {
      title: "Late Arrivals Report",
      description: "Track patterns of late arrivals and tardiness",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
      frequency: "Weekly",
      lastGenerated: "Monday 8:00 AM"
    },
    {
      title: "Overtime Analysis",
      description: "Comprehensive overtime hours and cost analysis",
      icon: BarChart3,
      color: "bg-red-100 text-red-600",
      frequency: "Monthly",
      lastGenerated: "March 1st"
    },
    {
      title: "Absence Patterns",
      description: "Identify patterns in employee absences",
      icon: PieChart,
      color: "bg-orange-100 text-orange-600",
      frequency: "Monthly",
      lastGenerated: "March 1st"
    }
  ];

  const recentReports = [
    { name: "March 2024 Attendance Summary", type: "Monthly", generated: "2 hours ago", size: "2.4 MB" },
    { name: "Weekly Overtime Report - Week 11", type: "Weekly", generated: "1 day ago", size: "1.8 MB" },
    { name: "Department Attendance - Engineering", type: "Department", generated: "2 days ago", size: "3.1 MB" },
    { name: "Late Arrivals - February", type: "Analysis", generated: "1 week ago", size: "1.2 MB" }
  ];

  return (
    <div className="min-h-screen bg-hrms-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
              Attendance Reports
            </h1>
            <p className="text-hrms-slate-600">
              Generate, download, and analyze comprehensive attendance reports
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Report
            </Button>
            <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
              <FileText className="h-4 w-4" />
              Custom Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-hrms-slate-600">Reports Generated</p>
                  <p className="text-2xl font-bold text-hrms-slate-900 mt-1">247</p>
                </div>
                <FileText className="h-8 w-8 text-hrms-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-hrms-slate-600">This Month</p>
                  <p className="text-2xl font-bold text-hrms-slate-900 mt-1">18</p>
                </div>
                <Calendar className="h-8 w-8 text-hrms-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-hrms-slate-600">Scheduled</p>
                  <p className="text-2xl font-bold text-hrms-slate-900 mt-1">12</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-hrms-slate-600">Total Downloads</p>
                  <p className="text-2xl font-bold text-hrms-slate-900 mt-1">1,234</p>
                </div>
                <Download className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Types */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>
              Choose from our pre-built report templates or create custom reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTypes.map((report, index) => (
                <div key={index} className="p-6 border border-hrms-slate-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${report.color}`}>
                      <report.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline">{report.frequency}</Badge>
                  </div>
                  <h3 className="font-semibold text-hrms-slate-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-hrms-slate-600 mb-4">{report.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs text-hrms-slate-500">
                      Last generated: {report.lastGenerated}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Generate Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Your recently generated reports available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg hover:bg-hrms-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-hrms-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-hrms-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-hrms-slate-900">{report.name}</p>
                      <div className="flex items-center gap-4 text-sm text-hrms-slate-600">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.generated}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}