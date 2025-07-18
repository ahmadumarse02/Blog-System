import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Download, 
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  Filter,
  Settings,
  PieChart
} from "lucide-react";

export default function ReportsPage() {
  console.log("Reports page loaded");

  const reportStats = [
    { label: "Total Reports", value: "24", icon: FileText, color: "text-hrms-blue-600" },
    { label: "Generated Today", value: "6", icon: TrendingUp, color: "text-hrms-emerald-600" },
    { label: "Scheduled Reports", value: "8", icon: Calendar, color: "text-hrms-slate-600" },
    { label: "Custom Dashboards", value: "12", icon: BarChart3, color: "text-purple-600" }
  ];

  const recentReports = [
    {
      id: 1,
      name: "Monthly Attendance Summary",
      type: "Attendance",
      generated: "2 hours ago",
      size: "2.4 MB",
      format: "PDF",
      status: "Ready"
    },
    {
      id: 2,
      name: "Payroll Cost Analysis Q1",
      type: "Payroll",
      generated: "5 hours ago",
      size: "1.8 MB",
      format: "Excel",
      status: "Ready"
    },
    {
      id: 3,
      name: "Department Performance Report",
      type: "Analytics",
      generated: "1 day ago",
      size: "3.2 MB",
      format: "PDF",
      status: "Ready"
    },
    {
      id: 4,
      name: "Leave Utilization Report",
      type: "Leave",
      generated: "2 days ago",
      size: "1.1 MB",
      format: "CSV",
      status: "Ready"
    }
  ];

  const quickReports = [
    {
      category: "HR Analytics",
      reports: [
        { name: "Employee Turnover Analysis", icon: TrendingUp, description: "Track retention and turnover trends" },
        { name: "Diversity & Inclusion Metrics", icon: Users, description: "Workforce diversity statistics" },
        { name: "Performance Review Summary", icon: BarChart3, description: "Performance ratings and feedback" }
      ]
    },
    {
      category: "Attendance & Time",
      reports: [
        { name: "Attendance Trends", icon: Clock, description: "Daily, weekly, and monthly attendance" },
        { name: "Overtime Analysis", icon: TrendingUp, description: "Overtime hours and costs by department" },
        { name: "Tardiness Report", icon: Clock, description: "Late arrivals and patterns" }
      ]
    },
    {
      category: "Financial Reports",
      reports: [
        { name: "Payroll Summary", icon: DollarSign, description: "Comprehensive payroll breakdown" },
        { name: "Benefits Cost Analysis", icon: BarChart3, description: "Employee benefits and costs" },
        { name: "Department Budget", icon: PieChart, description: "Budget allocation and spending" }
      ]
    }
  ];

  const dashboards = [
    {
      name: "Executive Dashboard",
      description: "High-level KPIs and metrics for leadership",
      lastUpdated: "5 minutes ago",
      widgets: 8,
      users: 12
    },
    {
      name: "HR Operations Dashboard",
      description: "Day-to-day HR metrics and operations",
      lastUpdated: "10 minutes ago",
      widgets: 12,
      users: 8
    },
    {
      name: "Manager's Dashboard",
      description: "Team performance and attendance overview",
      lastUpdated: "15 minutes ago",
      widgets: 6,
      users: 25
    },
    {
      name: "Employee Self-Service",
      description: "Personal metrics and information",
      lastUpdated: "1 hour ago",
      widgets: 4,
      users: 156
    }
  ];

  return (
    <div className="min-h-screen bg-hrms-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
              Reports & Analytics
            </h1>
            <p className="text-hrms-slate-600">
              Generate insights, track performance, and analyze workforce data
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Customize
            </Button>
            <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
              <BarChart3 className="h-4 w-4" />
              New Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportStats.map((stat, index) => (
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

        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="generate">Generate Reports</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-hrms-blue-600" />
                  Recent Reports
                </CardTitle>
                <CardDescription>
                  Recently generated reports available for download
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg hover:bg-hrms-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-hrms-blue-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-hrms-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-hrms-slate-900">{report.name}</h3>
                          <p className="text-sm text-hrms-slate-600">
                            {report.type} • Generated {report.generated}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-hrms-slate-900">{report.size}</p>
                          <p className="text-xs text-hrms-slate-600">{report.format}</p>
                        </div>
                        <Badge variant="default" className="bg-hrms-emerald-100 text-hrms-emerald-700">
                          {report.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <div className="space-y-6">
              {quickReports.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                    <CardDescription>
                      Generate detailed reports for {category.category.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.reports.map((report, reportIndex) => (
                        <div key={reportIndex} className="p-4 border border-hrms-slate-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-hrms-blue-100">
                              <report.icon className="h-5 w-5 text-hrms-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-hrms-slate-900 mb-1">{report.name}</h3>
                              <p className="text-sm text-hrms-slate-600">{report.description}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            Generate Report
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dashboards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-hrms-emerald-600" />
                  Analytics Dashboards
                </CardTitle>
                <CardDescription>
                  Interactive dashboards for real-time insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dashboards.map((dashboard, index) => (
                    <div key={index} className="p-6 border border-hrms-slate-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-hrms-slate-900 mb-2">{dashboard.name}</h3>
                          <p className="text-sm text-hrms-slate-600">{dashboard.description}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-hrms-slate-600">Last Updated:</span>
                          <span className="font-medium">{dashboard.lastUpdated}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-hrms-slate-600">Widgets:</span>
                          <span className="font-medium">{dashboard.widgets}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-hrms-slate-600">Active Users:</span>
                          <span className="font-medium">{dashboard.users}</span>
                        </div>
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
                    Key Metrics Overview
                  </CardTitle>
                  <CardDescription>
                    Real-time analytics and performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-hrms-slate-500 border-2 border-dashed border-hrms-slate-200 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Interactive analytics chart would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-hrms-emerald-600" />
                    Workforce Insights
                  </CardTitle>
                  <CardDescription>
                    Employee engagement and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hrms-slate-600">Employee Satisfaction</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-hrms-slate-200 rounded-full h-2">
                          <div className="bg-hrms-emerald-500 h-2 rounded-full w-[85%]"></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hrms-slate-600">Retention Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-hrms-slate-200 rounded-full h-2">
                          <div className="bg-hrms-blue-600 h-2 rounded-full w-[92%]"></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hrms-slate-600">Average Performance</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-hrms-slate-200 rounded-full h-2">
                          <div className="bg-hrms-emerald-500 h-2 rounded-full w-[78%]"></div>
                        </div>
                        <span className="text-sm font-medium">4.2/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-hrms-slate-600">Training Completion</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-hrms-slate-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full w-[67%]"></div>
                        </div>
                        <span className="text-sm font-medium">67%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Download raw data and create custom analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span>Employee Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Clock className="h-6 w-6" />
                    <span>Attendance Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <DollarSign className="h-6 w-6" />
                    <span>Payroll Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>Performance Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}