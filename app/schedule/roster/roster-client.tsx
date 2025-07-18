"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Users, 
  Clock,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Copy,
  Clipboard,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";

// TypeScript interfaces
interface Shift {
  time: string;
  location: string;
  status: string;
}

interface Schedule {
  Monday: Shift | null;
  Tuesday: Shift | null;
  Wednesday: Shift | null;
  Thursday: Shift | null;
  Friday: Shift | null;
  Saturday: Shift | null;
  Sunday: Shift | null;
}

interface Employee {
  id: number;
  name: string;
  role: string;
  avatar: string;
  schedule: Schedule;
}

interface CopiedShift extends Shift {
  sourceName?: string;
  sourceDay?: string;
  weekTemplate?: Schedule;
  isWeekTemplate?: boolean;
}

interface EditingCell {
  employeeId: number;
  day: string;
  shift: Shift;
}

interface DraggedShift {
  employeeId: number;
  day: string;
  shift: Shift;
}

interface DragOver {
  employeeId: number;
  day: string;
}

export default function RosterPageClient() {
  console.log("Interactive schedule roster page loaded");

  const [currentWeek, setCurrentWeek] = useState("March 11 - March 17, 2024");
  const [copiedShift, setCopiedShift] = useState<CopiedShift | null>(null);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [draggedShift, setDraggedShift] = useState<DraggedShift | null>(null);
  const [dragOver, setDragOver] = useState<DragOver | null>(null);

  const weekDays = [
    { day: "Mon", date: "11", full: "Monday" },
    { day: "Tue", date: "12", full: "Tuesday" },
    { day: "Wed", date: "13", full: "Wednesday" },
    { day: "Thu", date: "14", full: "Thursday" },
    { day: "Fri", date: "15", full: "Friday" },
    { day: "Sat", date: "16", full: "Saturday" },
    { day: "Sun", date: "17", full: "Sunday" }
  ];

  const [roster, setRoster] = useState<Employee[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Manager",
      avatar: "",
      schedule: {
        Monday: { time: "09:00-17:00", location: "Main Office", status: "confirmed" },
        Tuesday: { time: "09:00-17:00", location: "Main Office", status: "confirmed" },
        Wednesday: { time: "09:00-17:00", location: "Remote", status: "confirmed" },
        Thursday: { time: "09:00-17:00", location: "Main Office", status: "confirmed" },
        Friday: { time: "09:00-17:00", location: "Main Office", status: "confirmed" },
        Saturday: null,
        Sunday: null
      }
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Developer",
      avatar: "",
      schedule: {
        Monday: { time: "10:00-18:00", location: "Remote", status: "confirmed" },
        Tuesday: { time: "10:00-18:00", location: "Remote", status: "confirmed" },
        Wednesday: { time: "10:00-18:00", location: "Main Office", status: "confirmed" },
        Thursday: { time: "10:00-18:00", location: "Remote", status: "pending" },
        Friday: { time: "10:00-18:00", location: "Remote", status: "confirmed" },
        Saturday: null,
        Sunday: null
      }
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Sales Rep",
      avatar: "",
      schedule: {
        Monday: { time: "08:00-16:00", location: "Branch Office", status: "confirmed" },
        Tuesday: { time: "08:00-16:00", location: "Branch Office", status: "confirmed" },
        Wednesday: { time: "08:00-16:00", location: "Branch Office", status: "confirmed" },
        Thursday: { time: "08:00-16:00", location: "Client Site", status: "confirmed" },
        Friday: { time: "08:00-16:00", location: "Branch Office", status: "confirmed" },
        Saturday: null,
        Sunday: null
      }
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Support",
      avatar: "",
      schedule: {
        Monday: { time: "14:00-22:00", location: "Main Office", status: "confirmed" },
        Tuesday: { time: "14:00-22:00", location: "Main Office", status: "confirmed" },
        Wednesday: { time: "14:00-22:00", location: "Main Office", status: "confirmed" },
        Thursday: { time: "14:00-22:00", location: "Main Office", status: "confirmed" },
        Friday: { time: "14:00-22:00", location: "Main Office", status: "confirmed" },
        Saturday: { time: "10:00-18:00", location: "Main Office", status: "confirmed" },
        Sunday: null
      }
    },
    {
      id: 5,
      name: "Lisa Anderson",
      role: "Designer",
      avatar: "",
      schedule: {
        Monday: { time: "09:30-17:30", location: "Remote", status: "confirmed" },
        Tuesday: { time: "09:30-17:30", location: "Remote", status: "confirmed" },
        Wednesday: null,
        Thursday: { time: "09:30-17:30", location: "Main Office", status: "pending" },
        Friday: { time: "09:30-17:30", location: "Remote", status: "confirmed" },
        Saturday: null,
        Sunday: null
      }
    },
    {
      id: 6,
      name: "David Kim",
      role: "Security",
      avatar: "",
      schedule: {
        Monday: { time: "00:00-08:00", location: "Main Office", status: "confirmed" },
        Tuesday: { time: "00:00-08:00", location: "Main Office", status: "confirmed" },
        Wednesday: { time: "00:00-08:00", location: "Main Office", status: "confirmed" },
        Thursday: { time: "00:00-08:00", location: "Main Office", status: "confirmed" },
        Friday: { time: "00:00-08:00", location: "Main Office", status: "confirmed" },
        Saturday: { time: "00:00-08:00", location: "Main Office", status: "confirmed" },
        Sunday: { time: "00:00-08:00", location: "Main Office", status: "confirmed" }
      }
    }
  ]);

  const rosterStats = [
    { label: "Total Shifts", value: "32", icon: Calendar, color: "text-hrms-blue-600" },
    { label: "Coverage Rate", value: "94%", icon: Users, color: "text-hrms-emerald-600" },
    { label: "Pending", value: "2", icon: Clock, color: "text-yellow-600" },
    { label: "Copied Shift", value: copiedShift ? "1" : "0", icon: Copy, color: "text-purple-600" }
  ];

  const locations = ["Main Office", "Remote", "Branch Office", "Client Site"];
  const statusOptions = ["confirmed", "pending", "tentative"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-hrms-emerald-100 text-hrms-emerald-700 border-hrms-emerald-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'tentative':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-hrms-slate-100 text-hrms-slate-600 border-hrms-slate-200';
    }
  };

  const getLocationIcon = (location: string) => {
    if (location === 'Remote') return '🏠';
    if (location === 'Main Office') return '🏢';
    if (location === 'Branch Office') return '🏬';
    if (location === 'Client Site') return '👥';
    return '📍';
  };

  // Copy shift functionality
  const copyShift = (shift: Shift, employeeName: string, day: string) => {
    setCopiedShift({ ...shift, sourceName: employeeName, sourceDay: day });
    toast.success(`Copied shift from ${employeeName} (${day})`);
  };

  // Paste shift functionality
  const pasteShift = (employeeId: number, day: string) => {
    if (!copiedShift || copiedShift.isWeekTemplate) {
      toast.error("No shift copied to paste");
      return;
    }

    setRoster(prev => prev.map(employee => {
      if (employee.id === employeeId) {
        const { sourceName, sourceDay, weekTemplate, isWeekTemplate, ...shiftData } = copiedShift;
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [day]: { ...shiftData, status: "pending" } as Shift
          }
        };
      }
      return employee;
    }));

    toast.success(`Pasted shift to ${roster.find(e => e.id === employeeId)?.name} (${day})`);
  };

  // Delete shift
  const deleteShift = (employeeId: number, day: string) => {
    setRoster(prev => prev.map(employee => {
      if (employee.id === employeeId) {
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [day]: null
          }
        };
      }
      return employee;
    }));

    toast.success("Shift deleted");
  };

  // Quick templates
  const applyTemplate = (employeeId: number, day: string, template: string) => {
    const templates: Record<string, Shift> = {
      morning: { time: "09:00-17:00", location: "Main Office", status: "pending" },
      evening: { time: "13:00-21:00", location: "Main Office", status: "pending" },
      night: { time: "22:00-06:00", location: "Main Office", status: "pending" },
      remote: { time: "09:00-17:00", location: "Remote", status: "pending" },
      partTime: { time: "09:00-13:00", location: "Main Office", status: "pending" }
    };

    const shift = templates[template];
    if (shift) {
      setRoster(prev => prev.map(employee => {
        if (employee.id === employeeId) {
          return {
            ...employee,
            schedule: {
              ...employee.schedule,
              [day]: shift
            }
          };
        }
        return employee;
      }));
      
      toast.success(`Applied ${template} template`);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, employeeId: number, day: string, shift: Shift) => {
    setDraggedShift({ employeeId, day, shift });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, employeeId: number, day: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver({ employeeId, day });
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, targetEmployeeId: number, targetDay: string) => {
    e.preventDefault();
    
    if (!draggedShift) return;

    // Move shift from source to target
    setRoster(prev => prev.map(employee => {
      // Remove from source
      if (employee.id === draggedShift.employeeId) {
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [draggedShift.day]: null
          }
        };
      }
      // Add to target
      if (employee.id === targetEmployeeId) {
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [targetDay]: { ...draggedShift.shift, status: "pending" }
          }
        };
      }
      return employee;
    }));

    setDraggedShift(null);
    setDragOver(null);
    toast.success("Shift moved successfully");
  };

  // Edit shift inline
  const startEdit = (employeeId: number, day: string, shift: Shift) => {
    setEditingCell({ employeeId, day, shift: { ...shift } });
  };

  const saveEdit = () => {
    if (!editingCell) return;

    setRoster(prev => prev.map(employee => {
      if (employee.id === editingCell.employeeId) {
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [editingCell.day]: editingCell.shift
          }
        };
      }
      return employee;
    }));

    setEditingCell(null);
    toast.success("Shift updated");
  };

  const cancelEdit = () => {
    setEditingCell(null);
  };

  const updateEditField = (field: keyof Shift, value: string) => {
    if (!editingCell) return;
    setEditingCell(prev => prev ? ({
      ...prev,
      shift: {
        ...prev.shift,
        [field]: value
      }
    }) : null);
  };

  // Bulk operations
  const copyWeekTemplate = (sourceEmployeeId: number) => {
    const sourceEmployee = roster.find(e => e.id === sourceEmployeeId);
    if (!sourceEmployee) return;

    const confirmed = window.confirm(`Copy ${sourceEmployee.name}'s entire week schedule as template?`);
    if (confirmed) {
      setCopiedShift({ 
        time: "",
        location: "",
        status: "",
        weekTemplate: sourceEmployee.schedule, 
        sourceName: sourceEmployee.name,
        isWeekTemplate: true 
      });
      toast.success(`Copied week template from ${sourceEmployee.name}`);
    }
  };

  const pasteWeekTemplate = (targetEmployeeId: number) => {
    if (!copiedShift?.isWeekTemplate || !copiedShift.weekTemplate) {
      toast.error("No week template copied");
      return;
    }

    const targetEmployee = roster.find(e => e.id === targetEmployeeId);
    if (!targetEmployee) return;

    const confirmed = window.confirm(`Apply week template to ${targetEmployee.name}?`);
    if (confirmed) {
      setRoster(prev => prev.map(employee => {
        if (employee.id === targetEmployeeId) {
          const newSchedule: Schedule = { ...copiedShift.weekTemplate! };
          
          // Set all non-null shifts to pending status
          Object.keys(newSchedule).forEach(day => {
            const dayKey = day as keyof Schedule;
            if (newSchedule[dayKey]) {
              newSchedule[dayKey] = { ...newSchedule[dayKey]!, status: "pending" };
            }
          });

          return {
            ...employee,
            schedule: newSchedule
          };
        }
        return employee;
      }));

      toast.success(`Applied week template to ${targetEmployee.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-hrms-slate-900 mb-2">
            Interactive Roster Builder
          </h1>
          <p className="text-hrms-slate-600">
            Drag, drop, copy & paste to build schedules easily
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-hrms-blue-600 hover:bg-hrms-blue-700">
            <Save className="h-4 w-4" />
            Save Schedule
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {rosterStats.map((stat, index) => (
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

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Templates</CardTitle>
          <CardDescription>
            Apply common shift patterns instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Morning (9-5)
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Evening (1-9)
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Night (10-6)
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              🏠 Remote (9-5)
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Part-time (9-1)
            </Button>
            {copiedShift?.isWeekTemplate && (
              <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
                <Clipboard className="h-4 w-4" />
                Week Template Ready
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Roster Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-hrms-blue-600" />
                Weekly Schedule Builder
              </CardTitle>
              <CardDescription>{currentWeek}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="outline" size="sm">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-hrms-slate-200">
                  <th className="text-left p-4 w-48 bg-hrms-slate-50">
                    <div className="font-semibold text-hrms-slate-900">Employee</div>
                  </th>
                  {weekDays.map((day) => (
                    <th key={day.day} className="text-center p-4 min-w-40 bg-hrms-slate-50">
                      <div className="font-semibold text-hrms-slate-900">{day.day}</div>
                      <div className="text-sm text-hrms-slate-500">{day.date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roster.map((employee) => (
                  <tr key={employee.id} className="border-b border-hrms-slate-100 hover:bg-hrms-slate-25">
                    <td className="p-4 bg-hrms-slate-50/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback className="bg-hrms-blue-600 text-white font-semibold">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-hrms-slate-900">{employee.name}</p>
                          <p className="text-sm text-hrms-slate-600">{employee.role}</p>
                          <div className="flex gap-1 mt-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 px-2 text-xs"
                              onClick={() => copyWeekTemplate(employee.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 px-2 text-xs"
                              onClick={() => pasteWeekTemplate(employee.id)}
                            >
                              <Clipboard className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day) => {
                      const shift = employee.schedule[day.full as keyof Schedule];
                      const isEditing = editingCell?.employeeId === employee.id && editingCell?.day === day.full;
                      const isDragOver = dragOver?.employeeId === employee.id && dragOver?.day === day.full;
                      
                      return (
                        <td 
                          key={day.day} 
                          className={`p-2 text-center min-h-20 relative ${
                            isDragOver ? 'bg-hrms-blue-100 ring-2 ring-hrms-blue-300' : ''
                          }`}
                          onDragOver={(e) => handleDragOver(e, employee.id, day.full)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, employee.id, day.full)}
                        >
                          {isEditing ? (
                            <div className="space-y-2 p-2 bg-white border-2 border-hrms-blue-300 rounded-lg shadow-lg">
                              <Input
                                value={editingCell.shift.time}
                                onChange={(e) => updateEditField('time', e.target.value)}
                                placeholder="09:00-17:00"
                                className="text-xs"
                              />
                              <Select 
                                value={editingCell.shift.location}
                                onValueChange={(value) => updateEditField('location', value)}
                              >
                                <SelectTrigger className="text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {locations.map(loc => (
                                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select 
                                value={editingCell.shift.status}
                                onValueChange={(value) => updateEditField('status', value)}
                              >
                                <SelectTrigger className="text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex gap-1">
                                <Button size="sm" onClick={saveEdit} className="flex-1">
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1">
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : shift ? (
                            <div 
                              className="group p-3 bg-white border-2 border-hrms-slate-200 rounded-lg hover:shadow-md transition-all cursor-move"
                              draggable
                              onDragStart={(e) => handleDragStart(e, employee.id, day.full, shift)}
                            >
                              <div className="text-sm font-semibold text-hrms-slate-900 mb-1">
                                {shift.time}
                              </div>
                              <div className="flex items-center justify-center gap-1 text-xs text-hrms-slate-600 mb-2">
                                <span>{getLocationIcon(shift.location)}</span>
                                <span>{shift.location}</span>
                              </div>
                              <Badge className={`text-xs border ${getStatusColor(shift.status)}`}>
                                {shift.status}
                              </Badge>
                              
                              {/* Hover actions */}
                              <div className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 flex gap-1 transition-opacity">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0 bg-white shadow"
                                  onClick={() => copyShift(shift, employee.name, day.full)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0 bg-white shadow"
                                  onClick={() => startEdit(employee.id, day.full, shift)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0 bg-white shadow text-red-600"
                                  onClick={() => deleteShift(employee.id, day.full)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="group p-3 border-2 border-dashed border-hrms-slate-300 rounded-lg hover:border-hrms-blue-400 transition-colors min-h-20 flex flex-col items-center justify-center">
                              <div className="text-hrms-slate-400 text-sm mb-2">Off</div>
                              
                              {/* Quick add buttons */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex flex-col gap-1">
                                  {copiedShift && !copiedShift.isWeekTemplate && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="h-6 text-xs gap-1"
                                      onClick={() => pasteShift(employee.id, day.full)}
                                    >
                                      <Clipboard className="h-3 w-3" />
                                      Paste
                                    </Button>
                                  )}
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      className="h-6 px-1 text-xs"
                                      onClick={() => applyTemplate(employee.id, day.full, 'morning')}
                                      title="Morning shift"
                                    >
                                      🌅
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      className="h-6 px-1 text-xs"
                                      onClick={() => applyTemplate(employee.id, day.full, 'evening')}
                                      title="Evening shift"
                                    >
                                      🌆
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      className="h-6 px-1 text-xs"
                                      onClick={() => applyTemplate(employee.id, day.full, 'remote')}
                                      title="Remote work"
                                    >
                                      🏠
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Copy className="h-4 w-4 text-hrms-blue-600" />
                Copy & Paste
              </h4>
              <ul className="space-y-1 text-hrms-slate-600">
                <li>• Click copy icon on any shift</li>
                <li>• Paste to empty cells</li>
                <li>• Copy entire week templates</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                🖱️ Drag & Drop
              </h4>
              <ul className="space-y-1 text-hrms-slate-600">
                <li>• Drag shifts between cells</li>
                <li>• Drop on empty or occupied cells</li>
                <li>• Visual feedback during drag</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Edit className="h-4 w-4 text-hrms-emerald-600" />
                Quick Edit
              </h4>
              <ul className="space-y-1 text-hrms-slate-600">
                <li>• Click edit icon to modify</li>
                <li>• Use emoji templates for quick add</li>
                <li>• Hover for action buttons</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}