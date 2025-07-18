import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  User,
  MessageSquare,
  Filter,
  Search
} from "lucide-react";

export default function LeaveApprovalsPage() {
  console.log("Leave approvals page loaded");

  const pendingRequests = [
    {
      id: 1,
      employee: "Sarah Johnson",
      avatar: "",
      department: "Human Resources",
      type: "Annual Leave",
      startDate: "2024-03-15",
      endDate: "2024-03-22",
      days: 6,
      reason: "Family vacation to celebrate wedding anniversary",
      submittedDate: "2024-03-01",
      priority: "normal",
      coverageArranged: true,
      previousRequests: 2,
      remainingDays: 19
    },
    {
      id: 2,
      employee: "Mike Chen",
      avatar: "",
      department: "Engineering",
      type: "Sick Leave",
      startDate: "2024-03-12",
      endDate: "2024-03-14", 
      days: 3,
      reason: "Doctor recommended rest due to flu symptoms",
      submittedDate: "2024-03-11",
      priority: "urgent",
      coverageArranged: true,
      previousRequests: 1,
      remainingDays: 7
    },
    {
      id: 3,
      employee: "Emily Davis",
      avatar: "",
      department: "Sales",
      type: "Personal Leave",
      startDate: "2024-03-20",
      endDate: "2024-03-20",
      days: 1,
      reason: "Attending child's school graduation ceremony",
      submittedDate: "2024-03-08",
      priority: "normal",
      coverageArranged: false,
      previousRequests: 0,
      remainingDays: 5
    },
    {
      id: 4,
      employee: "James Wilson",
      avatar: "",
      department: "Support",
      type: "Annual Leave",
      startDate: "2024-04-01",
      endDate: "2024-04-15",
      days: 11,
      reason: "Extended family trip to Europe - already booked flights",
      submittedDate: "2024-02-28",
      priority: "high",
      coverageArranged: true,
      previousRequests: 3,
      remainingDays: 14
    }
  ];

  const recentlyApproved = [
    {
      id: 5,
      employee: "Lisa Anderson",
      type: "Personal Leave",
      days: 2,
      approvedDate: "2024-03-10",
      approvedBy: "Sarah Johnson"
    },
    {
      id: 6,
      employee: "David Kim",
      type: "Annual Leave", 
      days: 5,
      approvedDate: "2024-03-09",
      approvedBy: "Sarah Johnson"
    },
    {
      id: 7,
      employee: "Jennifer Lee",
      type: "Maternity Leave",
      days: 90,
      approvedDate: "2024-03-08",
      approvedBy: "HR Team"
    }
  ];

  const rejectedRequests = [
    {
      id: 8,
      employee: "Robert Taylor",
      type: "Annual Leave",
      days: 7,
      rejectedDate: "2024-03-07",
      rejectedBy: "Sarah Johnson",
      reason: "Insufficient coverage during busy period"
    },
    {
      id: 9,
      employee: "Amanda White",
      type: "Personal Leave",
      days: 3,
      rejectedDate: "2024-03-05",
      rejectedBy: "Mike Chen",
      reason: "Too short notice period"
    }
  ];

  const approvalStats = [
    { label: "Pending", value: "4", icon: Clock, color: "text-yellow-600" },
    { label: "Approved Today", value: "2", icon: CheckCircle, color: "text-hrms-emerald-600" },
    { label: "Rejected", value: "1", icon: XCircle, color: "text-red-600" },
    { label: "Urgent", value: "1", icon: AlertCircle, color: "text-orange-600" }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'normal':
        return 'bg-hrms-slate-100 text-hrms-slate-700';
      default:
        return 'bg-hrms-slate-100 text-hrms-slate-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-hrms-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
              Leave Approvals
            </h1>
            <p className="text-hrms-slate-600">
              Review and manage leave requests requiring your approval
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
              <CheckCircle className="h-4 w-4" />
              Bulk Approve
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {approvalStats.map((stat, index) => (
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

        {/* Approval Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="approved">Recently Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Pending Requests ({pendingRequests.length})
                </CardTitle>
                <CardDescription>
                  Leave requests awaiting your decision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border border-hrms-slate-200 rounded-lg p-6 hover:bg-hrms-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.avatar} alt={request.employee} />
                            <AvatarFallback className="bg-hrms-blue-600 text-white">
                              {request.employee.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-hrms-slate-900">{request.employee}</h3>
                            <p className="text-sm text-hrms-slate-600">{request.department}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{request.type}</Badge>
                              <Badge className={getPriorityColor(request.priority)}>
                                {request.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-hrms-slate-600">
                          <p>Submitted: {formatDate(request.submittedDate)}</p>
                          <p>{request.days} days requested</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-hrms-slate-500">Leave Dates</p>
                          <p className="font-medium">{formatDate(request.startDate)} - {formatDate(request.endDate)}</p>
                        </div>
                        <div>
                          <p className="text-hrms-slate-500">Coverage</p>
                          <p className={`font-medium ${request.coverageArranged ? 'text-hrms-emerald-600' : 'text-red-600'}`}>
                            {request.coverageArranged ? 'Arranged' : 'Not Arranged'}
                          </p>
                        </div>
                        <div>
                          <p className="text-hrms-slate-500">Remaining Days</p>
                          <p className="font-medium">{request.remainingDays} days</p>
                        </div>
                        <div>
                          <p className="text-hrms-slate-500">Previous Requests</p>
                          <p className="font-medium">{request.previousRequests} this year</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-hrms-slate-500 text-sm mb-2">Reason</p>
                        <p className="text-sm text-hrms-slate-700 bg-hrms-slate-50 p-3 rounded-lg">
                          {request.reason}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-hrms-slate-200">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Comment
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-hrms-emerald-600 hover:bg-hrms-emerald-700 gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-hrms-emerald-600" />
                  Recently Approved
                </CardTitle>
                <CardDescription>Leave requests approved in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentlyApproved.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-hrms-slate-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-hrms-emerald-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-hrms-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-hrms-slate-900">{request.employee}</p>
                          <p className="text-sm text-hrms-slate-600">
                            {request.type} • {request.days} days
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-hrms-slate-900">
                          Approved {formatDate(request.approvedDate)}
                        </p>
                        <p className="text-sm text-hrms-slate-600">by {request.approvedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Rejected Requests
                </CardTitle>
                <CardDescription>Leave requests that were not approved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rejectedRequests.map((request) => (
                    <div key={request.id} className="p-4 border border-hrms-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-hrms-slate-900">{request.employee}</p>
                            <p className="text-sm text-hrms-slate-600">
                              {request.type} • {request.days} days
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-hrms-slate-900">
                            Rejected {formatDate(request.rejectedDate)}
                          </p>
                          <p className="text-sm text-hrms-slate-600">by {request.rejectedBy}</p>
                        </div>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">
                          <strong>Reason:</strong> {request.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}