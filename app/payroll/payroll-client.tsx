"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Play, 
  FileText, 
  Download,
  Calculator,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function PayrollPageClient() {
  console.log("Payroll page loaded");

  const payrollStats = [
    { label: "Total Payroll", value: "$324,568", icon: DollarSign, color: "text-hrms-blue-600" },
    { label: "Employees Paid", value: "156", icon: Users, color: "text-hrms-emerald-600" },
    { label: "Pending Reviews", value: "8", icon: AlertTriangle, color: "text-yellow-600" },
    { label: "Tax Withheld", value: "$89,234", icon: Calculator, color: "text-hrms-slate-600" }
  ];

  const payrollRuns = [
    { 
      id: "PR-2024-03", 
      period: "March 2024", 
      employees: 156, 
      grossPay: "$324,568", 
      netPay: "$235,234", 
      status: "Completed",
      processedDate: "Mar 31, 2024"
    },
    { 
      id: "PR-2024-02", 
      period: "February 2024", 
      employees: 154, 
      grossPay: "$318,456", 
      netPay: "$230,123", 
      status: "Completed",
      processedDate: "Feb 29, 2024"
    },
    { 
      id: "PR-2024-01", 
      period: "January 2024", 
      employees: 152, 
      grossPay: "$312,890", 
      netPay: "$226,789", 
      status: "Completed",
      processedDate: "Jan 31, 2024"
    },
    { 
      id: "PR-2024-04", 
      period: "April 2024", 
      employees: 158, 
      grossPay: "$0", 
      netPay: "$0", 
      status: "Draft",
      processedDate: "Not processed"
    }
  ];

  const pendingAdjustments = [
    { employee: "Sarah Johnson", type: "Overtime", amount: "+$245", reason: "Additional weekend hours" },
    { employee: "Mike Chen", type: "Bonus", amount: "+$500", reason: "Performance bonus Q1" },
    { employee: "Emily Davis", type: "Deduction", amount: "-$125", reason: "Unpaid leave adjustment" },
    { employee: "James Wilson", type: "Commission", amount: "+$1,200", reason: "Sales commission March" }
  ];

  const taxSummary = [
    { type: "Federal Income Tax", amount: "$45,678", rate: "14.1%" },
    { type: "State Income Tax", amount: "$18,234", rate: "5.6%" },
    { type: "Social Security", amount: "$15,890", rate: "4.9%" },
    { type: "Medicare", amount: "$9,432", rate: "2.9%" }
  ];

  const departmentCosts = [
    { department: "Engineering", employees: 45, cost: "$125,640", avgSalary: "$92,400" },
    { department: "Sales", employees: 32, cost: "$89,760", avgSalary: "$78,500" },
    { department: "Marketing", employees: 28, cost: "$71,400", avgSalary: "$65,200" },
    { department: "HR", employees: 15, cost: "$42,750", avgSalary: "$68,400" },
    { department: "Finance", employees: 18, cost: "$54,720", avgSalary: "$72,800" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
            Payroll Management
          </h1>
          <p className="text-hrms-slate-600">
            Process payroll, manage payments, and track compensation
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
          <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
            <Play className="h-4 w-4" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {payrollStats.map((stat, index) => (
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

      <Tabs defaultValue="runs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          <TabsTrigger value="taxes">Tax Summary</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-hrms-blue-600" />
                Recent Payroll Runs
              </CardTitle>
              <CardDescription>
                History of payroll processing and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollRuns.map((run) => (
                  <div key={run.id} className="p-4 border border-hrms-slate-200 rounded-lg hover:bg-hrms-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-hrms-slate-900">{run.id}</h3>
                        <p className="text-sm text-hrms-slate-600">{run.period}</p>
                      </div>
                      <Badge variant={run.status === "Completed" ? "default" : "secondary"}
                             className={run.status === "Completed" ? "bg-hrms-emerald-100 text-hrms-emerald-700" : "bg-hrms-slate-100 text-hrms-slate-700"}>
                        {run.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-hrms-slate-500 uppercase tracking-wide">Employees</p>
                        <p className="text-sm font-medium">{run.employees}</p>
                      </div>
                      <div>
                        <p className="text-xs text-hrms-slate-500 uppercase tracking-wide">Gross Pay</p>
                        <p className="text-sm font-medium">{run.grossPay}</p>
                      </div>
                      <div>
                        <p className="text-xs text-hrms-slate-500 uppercase tracking-wide">Net Pay</p>
                        <p className="text-sm font-medium">{run.netPay}</p>
                      </div>
                      <div>
                        <p className="text-xs text-hrms-slate-500 uppercase tracking-wide">Processed</p>
                        <p className="text-sm font-medium">{run.processedDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {run.status === "Draft" ? (
                        <Button size="sm" className="bg-hrms-blue-600 hover:bg-hrms-blue-700">
                          <Play className="h-4 w-4 mr-1" />
                          Process Payroll
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download Report
                        </Button>
                      )}
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

        <TabsContent value="adjustments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-yellow-600" />
                Pending Adjustments
              </CardTitle>
              <CardDescription>
                Manual adjustments requiring approval before next payroll
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAdjustments.map((adjustment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-hrms-blue-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-hrms-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-hrms-slate-900">{adjustment.employee}</p>
                        <p className="text-sm text-hrms-slate-600">{adjustment.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-hrms-slate-900">{adjustment.type}</p>
                      <p className={`text-sm font-semibold ${
                        adjustment.amount.startsWith('+') ? 'text-hrms-emerald-600' : 'text-red-600'
                      }`}>
                        {adjustment.amount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-hrms-emerald-600 hover:bg-hrms-emerald-700">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Payroll Costs</CardTitle>
              <CardDescription>
                Monthly payroll expenses by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentCosts.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-hrms-slate-900">{dept.department}</h3>
                      <p className="text-sm text-hrms-slate-600">{dept.employees} employees</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-hrms-slate-900">{dept.cost}</p>
                      <p className="text-sm text-hrms-slate-600">Avg: {dept.avgSalary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-hrms-emerald-600" />
                Tax Withholdings Summary
              </CardTitle>
              <CardDescription>
                Current month tax calculations and withholdings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxSummary.map((tax, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-hrms-slate-900">{tax.type}</h3>
                      <p className="text-sm text-hrms-slate-600">Effective rate: {tax.rate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-hrms-slate-900">{tax.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-hrms-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-hrms-slate-900">Total Tax Withheld</span>
                  <span className="text-2xl font-bold text-hrms-blue-600">$89,234</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-hrms-blue-600" />
                Tax Filing Schedule
              </CardTitle>
              <CardDescription>
                Upcoming tax filing deadlines and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Quarterly Filing Due</h4>
                      <p className="text-sm text-yellow-700">Q1 2024 tax filing due April 30th, 2024</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">Last Filing Completed</h4>
                      <p className="text-sm text-green-700">Q4 2023 tax filing submitted January 31st, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-hrms-blue-600" />
                  Payroll Trends
                </CardTitle>
                <CardDescription>
                  Monthly payroll costs over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-hrms-slate-500 border-2 border-dashed border-hrms-slate-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Payroll trend chart would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>
                  Download detailed payroll and tax reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Button variant="outline" className="h-16 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Payroll Summary</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-2">
                    <Calculator className="h-6 w-6" />
                    <span>Tax Report</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span>Employee Earnings</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-2">
                    <DollarSign className="h-6 w-6" />
                    <span>Department Costs</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}