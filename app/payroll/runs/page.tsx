import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  FileText,
  Calculator,
  RefreshCw,
  Eye,
  Download
} from "lucide-react";

export default function PayrollRunsPage() {
  console.log("Payroll runs page loaded");

  const currentRun = {
    id: "PR-2024-06",
    period: "Pay Period 6 - March 15-31, 2024",
    status: "in_progress",
    startedAt: "2024-03-29 09:00:00",
    estimatedCompletion: "2024-03-29 11:30:00",
    progress: 65,
    employeesProcessed: 102,
    totalEmployees: 156,
    grossPay: 487650.00,
    netPay: 354231.75,
    totalDeductions: 133418.25,
    errors: 2,
    warnings: 5
  };

  const payrollHistory = [
    {
      id: "PR-2024-05",
      period: "Pay Period 5 - March 1-15, 2024",
      status: "completed",
      completedAt: "2024-03-15 10:45:00",
      employees: 156,
      grossPay: 492180.00,
      netPay: 358642.50,
      totalDeductions: 133537.50,
      errors: 0,
      warnings: 2
    },
    {
      id: "PR-2024-04",
      period: "Pay Period 4 - February 15-29, 2024",
      status: "completed",
      completedAt: "2024-02-29 11:20:00",
      employees: 154,
      grossPay: 485320.00,
      netPay: 353485.20,
      totalDeductions: 131834.80,
      errors: 1,
      warnings: 3
    },
    {
      id: "PR-2024-03",
      period: "Pay Period 3 - February 1-15, 2024",
      status: "completed",
      completedAt: "2024-02-15 09:55:00",
      employees: 152,
      grossPay: 478965.00,
      netPay: 349123.45,
      totalDeductions: 129841.55,
      errors: 0,
      warnings: 1
    },
    {
      id: "PR-2024-02",
      period: "Pay Period 2 - January 15-31, 2024",
      status: "completed",
      completedAt: "2024-01-31 10:15:00",
      employees: 150,
      grossPay: 472500.00,
      netPay: 344250.00,
      totalDeductions: 128250.00,
      errors: 0,
      warnings: 4
    }
  ];

  const upcomingRuns = [
    {
      id: "PR-2024-07",
      period: "Pay Period 7 - April 1-15, 2024",
      scheduledDate: "2024-04-15",
      employees: 158,
      estimatedGross: 495000.00
    },
    {
      id: "PR-2024-08", 
      period: "Pay Period 8 - April 15-30, 2024",
      scheduledDate: "2024-04-30",
      employees: 158,
      estimatedGross: 498000.00
    }
  ];

  const runStats = [
    { label: "Current Run Progress", value: `${currentRun.progress}%`, icon: Clock, color: "text-hrms-blue-600" },
    { label: "Employees Processed", value: `${currentRun.employeesProcessed}/${currentRun.totalEmployees}`, icon: Users, color: "text-hrms-emerald-600" },
    { label: "Errors Found", value: currentRun.errors.toString(), icon: AlertCircle, color: "text-red-600" },
    { label: "Warnings", value: currentRun.warnings.toString(), icon: AlertCircle, color: "text-yellow-600" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-hrms-emerald-100 text-hrms-emerald-700';
      case 'in_progress':
        return 'bg-hrms-blue-100 text-hrms-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-hrms-slate-100 text-hrms-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in_progress':
        return Play;
      case 'failed':
        return AlertCircle;
      case 'pending':
        return Clock;
      default:
        return Clock;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-hrms-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
              Payroll Runs
            </h1>
            <p className="text-hrms-slate-600">
              Execute, monitor, and manage payroll processing runs
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
              <Play className="h-4 w-4" />
              Start New Run
            </Button>
          </div>
        </div>

        {/* Current Run Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {runStats.map((stat, index) => (
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

        {/* Current Payroll Run */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-hrms-blue-600" />
                  Current Payroll Run
                </CardTitle>
                <CardDescription>{currentRun.period}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-hrms-slate-700">Processing Progress</span>
                <span className="text-sm text-hrms-slate-600">{currentRun.progress}% Complete</span>
              </div>
              <div className="w-full bg-hrms-slate-200 rounded-full h-3">
                <div 
                  className="bg-hrms-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${currentRun.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-hrms-slate-600">
                <span>Started: {formatDateTime(currentRun.startedAt)}</span>
                <span>ETA: {formatDateTime(currentRun.estimatedCompletion)}</span>
              </div>
            </div>

            {/* Run Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-hrms-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-hrms-slate-600" />
                  <span className="text-sm font-medium text-hrms-slate-700">Employees</span>
                </div>
                <p className="text-lg font-bold text-hrms-slate-900">
                  {currentRun.employeesProcessed}/{currentRun.totalEmployees}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Gross Pay</span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  {formatCurrency(currentRun.grossPay)}
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Net Pay</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(currentRun.netPay)}
                </p>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Issues</span>
                </div>
                <p className="text-lg font-bold text-red-900">
                  {currentRun.errors + currentRun.warnings}
                </p>
              </div>
            </div>

            {/* Issues Summary */}
            {(currentRun.errors > 0 || currentRun.warnings > 0) && (
              <div className="space-y-2">
                {currentRun.errors > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-900">
                        {currentRun.errors} Error{currentRun.errors !== 1 ? 's' : ''} Found
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Critical issues that must be resolved before completion
                    </p>
                  </div>
                )}
                
                {currentRun.warnings > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-900">
                        {currentRun.warnings} Warning{currentRun.warnings !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Items that need attention but won't block processing
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payroll History and Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payroll History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-hrms-emerald-600" />
                  Recent Payroll Runs
                </CardTitle>
                <CardDescription>Historical payroll processing records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payrollHistory.map((run) => {
                    const StatusIcon = getStatusIcon(run.status);
                    return (
                      <div key={run.id} className="border border-hrms-slate-200 rounded-lg p-4 hover:bg-hrms-slate-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <StatusIcon className="h-4 w-4 text-hrms-emerald-600" />
                              <h3 className="font-medium text-hrms-slate-900">{run.id}</h3>
                              <Badge className={getStatusColor(run.status)}>
                                {run.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-hrms-slate-600">{run.period}</p>
                            <p className="text-xs text-hrms-slate-500">
                              Completed: {formatDateTime(run.completedAt)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-hrms-slate-500">Employees</p>
                            <p className="font-medium">{run.employees}</p>
                          </div>
                          <div>
                            <p className="text-hrms-slate-500">Gross Pay</p>
                            <p className="font-medium">{formatCurrency(run.grossPay)}</p>
                          </div>
                          <div>
                            <p className="text-hrms-slate-500">Net Pay</p>
                            <p className="font-medium">{formatCurrency(run.netPay)}</p>
                          </div>
                        </div>
                        
                        {(run.errors > 0 || run.warnings > 0) && (
                          <div className="flex gap-4 mt-3 pt-3 border-t border-hrms-slate-200 text-sm">
                            <span className="text-red-600">{run.errors} errors</span>
                            <span className="text-yellow-600">{run.warnings} warnings</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Runs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-hrms-blue-600" />
                Upcoming Runs
              </CardTitle>
              <CardDescription>Scheduled payroll processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingRuns.map((run) => (
                  <div key={run.id} className="border border-hrms-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-hrms-blue-600" />
                      <h3 className="font-medium text-hrms-slate-900">{run.id}</h3>
                    </div>
                    <p className="text-sm text-hrms-slate-600 mb-3">{run.period}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-hrms-slate-500">Scheduled</span>
                        <span className="font-medium">
                          {new Date(run.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-hrms-slate-500">Employees</span>
                        <span className="font-medium">{run.employees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-hrms-slate-500">Est. Gross</span>
                        <span className="font-medium">{formatCurrency(run.estimatedGross)}</span>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Edit Schedule
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}