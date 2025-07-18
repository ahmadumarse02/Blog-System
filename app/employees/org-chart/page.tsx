import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Expand, 
  Download, 
  Search,
  ChevronDown,
  ChevronRight,
  Building2,
  UserCheck
} from "lucide-react";

export default function OrgChartPage() {
  console.log("Organization chart page loaded");

  const orgStructure = {
    ceo: {
      name: "Robert Mitchell",
      title: "Chief Executive Officer",
      email: "r.mitchell@company.com",
      avatar: "",
      reports: 4,
      level: 0
    },
    departments: [
      {
        head: {
          name: "Sarah Johnson",
          title: "VP of Human Resources",
          email: "s.johnson@company.com",
          avatar: "",
          reports: 8,
          level: 1
        },
        team: [
          { name: "Emily Davis", title: "HR Specialist", email: "e.davis@company.com", reports: 0, level: 2 },
          { name: "James Wilson", title: "Recruiter", email: "j.wilson@company.com", reports: 0, level: 2 },
          { name: "Lisa Anderson", title: "HR Coordinator", email: "l.anderson@company.com", reports: 0, level: 2 }
        ]
      },
      {
        head: {
          name: "Michael Chen",
          title: "VP of Engineering",
          email: "m.chen@company.com",
          avatar: "",
          reports: 15,
          level: 1
        },
        team: [
          { name: "John Doe", title: "Senior Developer", email: "j.doe@company.com", reports: 3, level: 2 },
          { name: "Alex Thompson", title: "DevOps Engineer", email: "a.thompson@company.com", reports: 2, level: 2 },
          { name: "Maria Garcia", title: "QA Lead", email: "m.garcia@company.com", reports: 4, level: 2 }
        ]
      },
      {
        head: {
          name: "Jennifer Lee",
          title: "VP of Sales",
          email: "j.lee@company.com",
          avatar: "",
          reports: 12,
          level: 1
        },
        team: [
          { name: "David Kim", title: "Sales Manager", email: "d.kim@company.com", reports: 5, level: 2 },
          { name: "Rachel Brown", title: "Account Executive", email: "r.brown@company.com", reports: 0, level: 2 },
          { name: "Tom Rodriguez", title: "Sales Representative", email: "t.rodriguez@company.com", reports: 0, level: 2 }
        ]
      },
      {
        head: {
          name: "Kevin Park",
          title: "VP of Finance",
          email: "k.park@company.com",
          avatar: "",
          reports: 6,
          level: 1
        },
        team: [
          { name: "Nancy White", title: "Finance Manager", email: "n.white@company.com", reports: 2, level: 2 },
          { name: "Peter Jones", title: "Accountant", email: "p.jones@company.com", reports: 0, level: 2 },
          { name: "Amanda Taylor", title: "Financial Analyst", email: "a.taylor@company.com", reports: 0, level: 2 }
        ]
      }
    ]
  };

  const orgStats = [
    { label: "Total Employees", value: "156", icon: Users, color: "text-hrms-blue-600" },
    { label: "Departments", value: "4", icon: Building2, color: "text-hrms-emerald-600" },
    { label: "Management", value: "12", icon: UserCheck, color: "text-purple-600" },
    { label: "New Hires", value: "8", icon: Users, color: "text-yellow-600" }
  ];

  const EmployeeCard = ({ employee, showReports = true }) => (
    <div className="bg-white border border-hrms-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={employee.avatar} alt={employee.name} />
          <AvatarFallback className="bg-hrms-blue-600 text-white">
            {employee.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium text-hrms-slate-900">{employee.name}</h3>
          <p className="text-sm text-hrms-slate-600">{employee.title}</p>
          <p className="text-xs text-hrms-slate-500">{employee.email}</p>
        </div>
        {showReports && employee.reports > 0 && (
          <Badge variant="outline" className="text-xs">
            {employee.reports} reports
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-hrms-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
              Organization Chart
            </h1>
            <p className="text-hrms-slate-600">
              Visual representation of company hierarchy and reporting structure
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" className="gap-2">
              <Expand className="h-4 w-4" />
              Expand All
            </Button>
            <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
              <Download className="h-4 w-4" />
              Export Chart
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {orgStats.map((stat, index) => (
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

        {/* Organization Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-hrms-blue-600" />
              Company Hierarchy
            </CardTitle>
            <CardDescription>
              Interactive organization chart showing reporting relationships
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* CEO Level */}
              <div className="flex justify-center">
                <div className="max-w-sm">
                  <EmployeeCard employee={orgStructure.ceo} />
                </div>
              </div>

              {/* Department Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {orgStructure.departments.map((dept, deptIndex) => (
                  <div key={deptIndex} className="space-y-4">
                    {/* Department Head */}
                    <div className="relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-8 bg-hrms-slate-300"></div>
                      <EmployeeCard employee={dept.head} />
                    </div>

                    {/* Team Members */}
                    {dept.team.length > 0 && (
                      <div className="space-y-3 ml-4 pl-4 border-l-2 border-hrms-slate-200">
                        <div className="flex items-center gap-2 text-sm text-hrms-slate-600">
                          <ChevronDown className="h-4 w-4" />
                          <span>Team Members ({dept.team.length})</span>
                        </div>
                        {dept.team.map((member, memberIndex) => (
                          <div key={memberIndex} className="relative">
                            <div className="absolute -left-4 top-6 w-4 h-px bg-hrms-slate-300"></div>
                            <EmployeeCard employee={member} showReports={member.reports > 0} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>Team size and structure by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orgStructure.departments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-hrms-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium text-hrms-slate-900">{dept.head.title.replace('VP of ', '')}</p>
                      <p className="text-sm text-hrms-slate-600">{dept.head.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{dept.head.reports + 1} people</p>
                      <p className="text-sm text-hrms-slate-600">{dept.team.length} direct reports</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Management Structure</CardTitle>
              <CardDescription>Leadership hierarchy and span of control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-hrms-blue-50 border border-hrms-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-hrms-blue-900">Executive Level</p>
                      <p className="text-sm text-hrms-blue-700">C-Suite Leadership</p>
                    </div>
                    <Badge className="bg-hrms-blue-600">1 person</Badge>
                  </div>
                </div>
                <div className="p-3 bg-hrms-emerald-50 border border-hrms-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-hrms-emerald-900">Vice President Level</p>
                      <p className="text-sm text-hrms-emerald-700">Department Heads</p>
                    </div>
                    <Badge className="bg-hrms-emerald-600">4 people</Badge>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-purple-900">Management Level</p>
                      <p className="text-sm text-purple-700">Team Leads & Managers</p>
                    </div>
                    <Badge className="bg-purple-600">7 people</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}