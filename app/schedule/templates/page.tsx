import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Plus, 
  Users, 
  Edit,
  Copy,
  Trash2,
  Calendar,
  Sun,
  Moon,
  Sunrise,
  Settings
} from "lucide-react";

export default function ScheduleTemplatesPage() {
  console.log("Schedule templates page loaded");

  const shiftTemplates = [
    {
      id: 1,
      name: "Morning Shift",
      description: "Standard morning hours for office workers",
      startTime: "08:00",
      endTime: "16:00",
      duration: "8 hours",
      breakTime: "1 hour",
      color: "bg-yellow-100 text-yellow-800",
      icon: Sunrise,
      employees: 45,
      locations: ["Main Office", "Branch Office"],
      active: true,
      category: "Standard",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    {
      id: 2,
      name: "Evening Shift",
      description: "Evening hours for extended coverage",
      startTime: "16:00",
      endTime: "00:00",
      duration: "8 hours",
      breakTime: "1 hour",
      color: "bg-orange-100 text-orange-800",
      icon: Sun,
      employees: 28,
      locations: ["Main Office", "Remote"],
      active: true,
      category: "Standard",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    {
      id: 3,
      name: "Night Shift",
      description: "Overnight security and maintenance",
      startTime: "00:00",
      endTime: "08:00",
      duration: "8 hours",
      breakTime: "1 hour",
      color: "bg-blue-100 text-blue-800",
      icon: Moon,
      employees: 12,
      locations: ["Main Office"],
      active: true,
      category: "Security",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    {
      id: 4,
      name: "Flexible Hours",
      description: "Variable schedule for remote workers",
      startTime: "Variable",
      endTime: "Variable",
      duration: "8 hours",
      breakTime: "Flexible",
      color: "bg-green-100 text-green-800",
      icon: Clock,
      employees: 67,
      locations: ["Remote", "Main Office"],
      active: true,
      category: "Flexible",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    {
      id: 5,
      name: "Weekend Coverage",
      description: "Weekend support and maintenance",
      startTime: "09:00",
      endTime: "17:00",
      duration: "8 hours",
      breakTime: "1 hour",
      color: "bg-purple-100 text-purple-800",
      icon: Calendar,
      employees: 18,
      locations: ["Main Office"],
      active: true,
      category: "Weekend",
      days: ["Saturday", "Sunday"]
    },
    {
      id: 6,
      name: "Split Shift",
      description: "Divided work periods with extended break",
      startTime: "06:00",
      endTime: "20:00",
      duration: "8 hours",
      breakTime: "4 hours",
      color: "bg-red-100 text-red-800",
      icon: Clock,
      employees: 8,
      locations: ["Branch Office"],
      active: false,
      category: "Custom",
      days: ["Monday", "Wednesday", "Friday"]
    }
  ];

  const templateStats = [
    { label: "Active Templates", value: "5", icon: Clock, color: "text-hrms-blue-600" },
    { label: "Total Templates", value: "6", icon: Settings, color: "text-hrms-emerald-600" },
    { label: "Employees Assigned", value: "178", icon: Users, color: "text-purple-600" },
    { label: "Usage This Week", value: "89%", icon: Calendar, color: "text-yellow-600" }
  ];

  const categories = ["All", "Standard", "Flexible", "Weekend", "Security", "Custom"];

  return (
    <div className="min-h-screen bg-hrms-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
              Shift Templates
            </h1>
            <p className="text-hrms-slate-600">
              Create and manage reusable shift patterns for efficient scheduling
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {templateStats.map((stat, index) => (
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
            <CardTitle>Template Categories</CardTitle>
            <CardDescription>Filter templates by category type</CardDescription>
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

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shiftTemplates.map((template) => (
            <Card key={template.id} className={`hover:shadow-lg transition-shadow ${!template.active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${template.color.replace('text-', 'bg-').replace('-800', '-200')}`}>
                      <template.icon className={`h-5 w-5 ${template.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-hrms-slate-600">{template.description}</p>
                
                {/* Time Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-hrms-slate-500">Start Time</p>
                    <p className="font-medium">{template.startTime}</p>
                  </div>
                  <div>
                    <p className="text-hrms-slate-500">End Time</p>
                    <p className="font-medium">{template.endTime}</p>
                  </div>
                  <div>
                    <p className="text-hrms-slate-500">Duration</p>
                    <p className="font-medium">{template.duration}</p>
                  </div>
                  <div>
                    <p className="text-hrms-slate-500">Break Time</p>
                    <p className="font-medium">{template.breakTime}</p>
                  </div>
                </div>

                {/* Working Days */}
                <div>
                  <p className="text-sm text-hrms-slate-500 mb-2">Working Days</p>
                  <div className="flex flex-wrap gap-1">
                    {template.days.map((day) => (
                      <Badge key={day} variant="secondary" className="text-xs">
                        {day.substring(0, 3)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <p className="text-sm text-hrms-slate-500 mb-2">Locations</p>
                  <div className="flex flex-wrap gap-1">
                    {template.locations.map((location) => (
                      <Badge key={location} variant="outline" className="text-xs">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Assignment Info */}
                <div className="flex items-center justify-between pt-2 border-t border-hrms-slate-200">
                  <div className="flex items-center gap-2 text-sm text-hrms-slate-600">
                    <Users className="h-4 w-4" />
                    <span>{template.employees} employees</span>
                  </div>
                  <Badge variant={template.active ? "default" : "secondary"} className={template.active ? "bg-hrms-emerald-100 text-hrms-emerald-700" : ""}>
                    {template.active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common template management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Plus className="h-5 w-5" />
                Create from Scratch
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Copy className="h-5 w-5" />
                Duplicate Existing
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Settings className="h-5 w-5" />
                Bulk Edit Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}