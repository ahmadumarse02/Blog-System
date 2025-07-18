import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Settings, 
  Calendar,
  Clock,
  Users,
  Edit,
  Eye,
  Shield,
  AlertCircle
} from "lucide-react";

export default function LeavePoliciesPage() {
  console.log("Leave policies page loaded");

  const leaveTypes = [
    {
      id: 1,
      name: "Annual Leave",
      description: "Paid vacation time for rest and personal activities",
      allocation: 25,
      carryOver: 5,
      notice: 14,
      maxConsecutive: 15,
      color: "bg-hrms-blue-100 text-hrms-blue-800",
      active: true,
      accrual: "Monthly",
      employees: 156
    },
    {
      id: 2,
      name: "Sick Leave",
      description: "Time off for illness or medical appointments",
      allocation: 10,
      carryOver: 2,
      notice: 0,
      maxConsecutive: 30,
      color: "bg-red-100 text-red-800",
      active: true,
      accrual: "Monthly",
      employees: 156
    },
    {
      id: 3,
      name: "Personal Leave",
      description: "Unpaid leave for personal matters",
      allocation: 5,
      carryOver: 0,
      notice: 7,
      maxConsecutive: 5,
      color: "bg-yellow-100 text-yellow-800",
      active: true,
      accrual: "Quarterly",
      employees: 156
    },
    {
      id: 4,
      name: "Maternity Leave",
      description: "Leave for new mothers following childbirth",
      allocation: 90,
      carryOver: 0,
      notice: 30,
      maxConsecutive: 90,
      color: "bg-purple-100 text-purple-800",
      active: true,
      accrual: "On Demand",
      employees: 78
    },
    {
      id: 5,
      name: "Paternity Leave",
      description: "Leave for new fathers following childbirth",
      allocation: 14,
      carryOver: 0,
      notice: 30,
      maxConsecutive: 14,
      color: "bg-green-100 text-green-800",
      active: true,
      accrual: "On Demand",
      employees: 78
    },
    {
      id: 6,
      name: "Bereavement Leave",
      description: "Compassionate leave following loss of family member",
      allocation: 5,
      carryOver: 0,
      notice: 0,
      maxConsecutive: 5,
      color: "bg-gray-100 text-gray-800",
      active: true,
      accrual: "On Demand",
      employees: 156
    }
  ];

  const policyRules = [
    {
      title: "Minimum Notice Period",
      description: "Standard notice requirements before leave can be taken",
      rules: [
        "Annual Leave: 14 days advance notice",
        "Personal Leave: 7 days advance notice", 
        "Sick Leave: Same day notification acceptable",
        "Maternity/Paternity: 30 days advance notice"
      ]
    },
    {
      title: "Approval Workflow",
      description: "Leave request approval hierarchy",
      rules: [
        "Direct manager approval required for all leave",
        "HR approval needed for leave >10 consecutive days",
        "CEO approval required for leave >30 days",
        "Auto-approval for sick leave <3 days with medical certificate"
      ]
    },
    {
      title: "Carryover Rules",
      description: "Policy for unused leave at year end",
      rules: [
        "Maximum 5 days annual leave can be carried over",
        "Sick leave carryover limited to 2 days",
        "Personal leave expires at year end",
        "Use-it-or-lose-it policy for all other leave types"
      ]
    }
  ];

  const policyStats = [
    { label: "Active Policies", value: "6", icon: FileText, color: "text-hrms-blue-600" },
    { label: "Total Employees", value: "156", icon: Users, color: "text-hrms-emerald-600" },
    { label: "Avg Annual Days", value: "25", icon: Calendar, color: "text-purple-600" },
    { label: "Policy Updates", value: "3", icon: Settings, color: "text-yellow-600" }
  ];

  return (
    <div className="min-h-screen bg-hrms-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
              Leave Policies
            </h1>
            <p className="text-hrms-slate-600">
              Configure and manage leave types, allocations, and approval workflows
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
              <Plus className="h-4 w-4" />
              New Policy
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {policyStats.map((stat, index) => (
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

        {/* Leave Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-hrms-blue-600" />
              Leave Types & Allocations
            </CardTitle>
            <CardDescription>
              Configure different types of leave and their parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaveTypes.map((type) => (
                <div key={type.id} className="border border-hrms-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className={type.color}>
                        {type.name}
                      </Badge>
                      <Badge variant={type.active ? "default" : "secondary"} className={type.active ? "bg-hrms-emerald-100 text-hrms-emerald-700" : ""}>
                        {type.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-hrms-slate-600 mb-4">{type.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-hrms-slate-500">Annual Allocation</p>
                      <p className="font-medium">{type.allocation} days</p>
                    </div>
                    <div>
                      <p className="text-hrms-slate-500">Carryover</p>
                      <p className="font-medium">{type.carryOver} days</p>
                    </div>
                    <div>
                      <p className="text-hrms-slate-500">Notice Required</p>
                      <p className="font-medium">{type.notice === 0 ? "Same day" : `${type.notice} days`}</p>
                    </div>
                    <div>
                      <p className="text-hrms-slate-500">Max Consecutive</p>
                      <p className="font-medium">{type.maxConsecutive} days</p>
                    </div>
                    <div>
                      <p className="text-hrms-slate-500">Accrual Method</p>
                      <p className="font-medium">{type.accrual}</p>
                    </div>
                    <div>
                      <p className="text-hrms-slate-500">Applicable To</p>
                      <p className="font-medium">{type.employees} employees</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Policy Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {policyRules.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-hrms-blue-600" />
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-hrms-blue-600 mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-hrms-slate-700">{rule}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Management</CardTitle>
            <CardDescription>Common policy administration tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Create Policy</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Settings className="h-6 w-6" />
                <span>Bulk Update</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Export Policies</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <AlertCircle className="h-6 w-6" />
                <span>Audit Log</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Changes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Policy Changes</CardTitle>
            <CardDescription>Latest updates to leave policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-hrms-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-hrms-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-hrms-slate-900">Annual Leave Carryover Updated</p>
                    <p className="text-sm text-hrms-slate-600">Increased maximum carryover from 3 to 5 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-hrms-slate-500">2 days ago</p>
                  <Badge variant="outline">HR Policy</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-hrms-slate-900">Bereavement Leave Added</p>
                    <p className="text-sm text-hrms-slate-600">New policy for compassionate leave</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-hrms-slate-500">1 week ago</p>
                  <Badge variant="outline">New Policy</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-hrms-slate-900">Approval Workflow Modified</p>
                    <p className="text-sm text-hrms-slate-600">Auto-approval threshold changed to 3 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-hrms-slate-500">2 weeks ago</p>
                  <Badge variant="outline">Workflow</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}