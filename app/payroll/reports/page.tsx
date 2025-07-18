import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Download, 
  FileText, 
  TrendingUp,
  Calendar,
  Users,
  PieChart,
  BarChart3,
  Calculator,
  Shield
} from "lucide-react";

export default function PayrollReportsPage() {
  console.log("Payroll reports page loaded");

  const reportTypes = [
    {
      id: 1,
      title: "Monthly Payroll Summary",
      description: "Comprehensive monthly payroll breakdown by department",
      icon: DollarSign,
      color: "bg-hrms-blue-100 text-hrms-blue-600",
      frequency: "Monthly",
      lastGenerated: "March 1st, 2024",
      size: "2.8 MB",
      category: "Summary"
    },
    {
      id: 2,
      title: "Tax Liability Report",
      description: "Federal, state, and local tax obligations summary",
      icon: Calculator,
      color: "bg-red-100 text-red-600",
      frequency: "Monthly",
      lastGenerated: "March 1st, 2024",
      size: "1.2 MB",
      category: "Tax"
    },
    {
      id: 3,
      title: "Employee Earnings Statement",
      description: "Individual employee pay stubs and earnings history",
      icon: Users,
      color: "bg-green-100 text-green-600",
      frequency: "Bi-weekly",
      lastGenerated: "March 15th, 2024",
      size: "4.1 MB",
      category: "Earnings"
    },
    {
      id: 4,
      title: "Department Cost Analysis",
      description: "Labor costs breakdown by department and project",
      icon: PieChart,
      color: "bg-purple-100 text-purple-600",
      frequency: "Monthly",
      lastGenerated: "March 1st, 2024",
      size: "1.8 MB",
      category: "Analysis"
    },
    {
      id: 5,
      title: "Overtime Analysis Report",
      description: "Overtime hours and costs across all employees",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
      frequency: "Monthly",
      lastGenerated: "March 1st, 2024",
      size: "957 KB",
      category: "Analysis"
    },
    {
      id: 6,
      title: "Benefits Contribution Report",
      description: "Employee and employer benefit contributions",
      icon: Shield,
      color: "bg-cyan-100 text-cyan-600",
      frequency: "Monthly",
      lastGenerated: "March 1st, 2024",
      size: "1.5 MB",
      category: "Benefits"
    },
    {
      id: 7,
      title: "Year-to-Date Summary",
      description: "Cumulative payroll data from start of fiscal year",
      icon: BarChart3,
      color: "bg-yellow-100 text-yellow-600",
      frequency: "Quarterly",
      lastGenerated: "January 1st, 2024",
      size: "3.2 MB",
      category: "Summary"
    },
    {
      id: 8,
      title: "Compliance Audit Report",
      description: "Regulatory compliance and audit trail documentation",
      icon: FileText,
      color: "bg-pink-100 text-pink-600",
      frequency: "Quarterly",
      lastGenerated: "January 1st, 2024",
      size: "2.1 MB",
      category: "Compliance"
    }
  ];

  const recentReports = [
    {
      name: "March 2024 Payroll Summary",
      type: "Monthly Summary",
      generated: "2 hours ago",
      size: "2.8 MB",
      downloads: 12
    },
    {
      name: "Employee Earnings - Pay Period 6",
      type: "Earnings Statement",
      generated: "1 day ago",
      size: "4.1 MB",
      downloads: 156
    },
    {
      name: "Q1 2024 Tax Liability",
      type: "Tax Report",
      generated: "3 days ago",
      size: "1.2 MB",
      downloads: 5
    },
    {
      name: "February Overtime Analysis",
      type: "Analysis",
      generated: "1 week ago",
      size: "957 KB",
      downloads: 8
    }
  ];

  const payrollStats = [
    { label: "Reports Generated", value: "247", icon: FileText, color: "text-hrms-blue-600" },
    { label: "This Month", value: "18", icon: Calendar, color: "text-hrms-emerald-600" },
    { label: "Total Downloads", value: "1,523", icon: Download, color: "text-purple-600" },
    { label: "Scheduled Reports", value: "12", icon: TrendingUp, color: "text-yellow-600" }
  ];

  const categories = ["All", "Summary", "Tax", "Earnings", "Analysis", "Benefits", "Compliance"];

  return (
    <div className="min-h-screen bg-hrms-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
              Payroll Reports
            </h1>
            <p className="text-hrms-slate-600">
              Generate, download, and analyze comprehensive payroll reports
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {payrollStats.map((stat, index) => (
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

        {/* Filter Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Report Categories</CardTitle>
            <CardDescription>Filter reports by type and category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className={category === "All" ? "bg-hrms-blue-600 hover:bg-hrms-blue-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reportTypes.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${report.color.replace('text-', 'bg-').replace('-600', '-200')}`}>
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {report.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{report.title}</CardTitle>
                <CardDescription className="text-sm">{report.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-hrms-slate-500">Frequency</p>
                    <p className="font-medium">{report.frequency}</p>
                  </div>
                  <div>
                    <p className="text-hrms-slate-500">File Size</p>
                    <p className="font-medium">{report.size}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-hrms-slate-500 mb-2">
                    Last generated: {report.lastGenerated}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Generate Now
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
                    <div className="w-12 h-12 rounded-lg bg-hrms-blue-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-hrms-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-hrms-slate-900">{report.name}</p>
                      <div className="flex items-center gap-4 text-sm text-hrms-slate-600">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.generated}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                        <span>•</span>
                        <span>{report.downloads} downloads</span>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-hrms-blue-50 border border-hrms-blue-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-hrms-blue-900">Monthly Payroll Summary</p>
                    <p className="text-xs text-hrms-blue-700">Next: April 1st, 2024</p>
                  </div>
                  <Badge className="bg-hrms-blue-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-900">Employee Earnings</p>
                    <p className="text-xs text-green-700">Next: March 29th, 2024</p>
                  </div>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Tax Liability</p>
                    <p className="text-xs text-yellow-700">Next: April 1st, 2024</p>
                  </div>
                  <Badge className="bg-yellow-600">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Actions</CardTitle>
              <CardDescription>Common report management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <FileText className="h-5 w-5" />
                  <span>Custom Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Report</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <Download className="h-5 w-5" />
                  <span>Bulk Download</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}