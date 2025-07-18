"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from "sonner";
import { calculatePayPeriod, getCurrentPayPeriod, PayPeriodSettings, PayPeriod } from "@/lib/pay-period-utils";
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Grid3X3,
  List,
  Mail,
  Phone,
  MapPin,
  Clock,
  Building2,
  Edit,
  Trash2,
  Eye,
  FileText,
  X,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Timer,
  User,
  Briefcase,
  CalendarDays,
  DollarSign,
  Coffee,
  Play,
  Settings,
  ChevronDown,
  RefreshCw,
  CalendarRange,
  Users2,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Camera,
  MapPin as LocationIcon,
  Image as ImageIcon,
  UserCheck,
  UserX,
  FileEdit,
  Archive
} from "lucide-react";

interface DailyHour {
  date: string;
  hours: number;
  breakHours: number;
  startTime?: string;
  endTime?: string;
  project: string;
  description: string;
}

interface Timesheet {
  id: number;
  employeeName: string;
  employeeEmail: string;
  employeeAvatar?: string;
  role: string;
  department: string;
  location: string;
  weekPeriod: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  breakHours: number;
  status: string;
  submittedDate: string | null;
  lastModified: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  project: string;
  notes: string;
  dailyHours: DailyHour[];
  currentShiftStart?: string | null;
  currentShiftEnd?: string | null;
}

interface TimesheetsClientProps {
  initialTimesheets: Timesheet[];
  currentUser: any;
  initialPayPeriod: PayPeriod;
  payPeriodSettings: PayPeriodSettings;
}

export default function TimesheetsClient({ 
  initialTimesheets, 
  currentUser, 
  initialPayPeriod,
  payPeriodSettings 
}: TimesheetsClientProps) {
  const [timesheets, setTimesheets] = useState<Timesheet[]>(initialTimesheets);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Timesheet>("employeeName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [hoursRangeMin, setHoursRangeMin] = useState<string>("");
  const [hoursRangeMax, setHoursRangeMax] = useState<string>("");
  const [currentPayPeriod, setCurrentPayPeriod] = useState<PayPeriod>(initialPayPeriod);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: initialPayPeriod.start,
    to: initialPayPeriod.end
  });
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedTimesheets, setSelectedTimesheets] = useState<number[]>([]);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [customDatePickerOpen, setCustomDatePickerOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedEmployeePhotos, setSelectedEmployeePhotos] = useState<{
    employeeName: string;
    photos: {
      clockIn: { image: string; timestamp: string; location?: string; }[];
      clockOut: { image: string; timestamp: string; location?: string; }[];
      breaks: { image: string; timestamp: string; type: string; location?: string; }[];
    };
  } | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    totalHours: 0,
    breaks: [] as { name: string; duration: number }[],
    project: "",
    description: "",
    notes: "",
    status: "",
    employeeName: "",
    employeeEmail: "",
    role: "",
    department: "",
    location: ""
  });
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "employeeName", "startDate", "currentShiftStart", "totalHours", "breakHours", "status"
  ]);
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [groupBy, setGroupBy] = useState<string>("none");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  
  // Organization and location settings with localStorage persistence
  const [organizationSettingsOpen, setOrganizationSettingsOpen] = useState(false);
  const [organizationSettings, setOrganizationSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('organizationSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved organization settings:', e);
        }
      }
    }
    return {
      companyName: "TechCorp Solutions",
      timeZone: "America/New_York",
      fiscalYearStart: "January",
      currency: "USD",
      defaultLocation: "New York Office"
    };
  });
  const [locationSettings, setLocationSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locationSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved location settings:', e);
        }
      }
    }
    return {
      locations: ["New York Office", "San Francisco Office", "Chicago Office", "Remote"],
      defaultWorkHours: 8,
      overtimeThreshold: 40,
      breakPolicyEnabled: true,
      minimumBreakDuration: 0.5
    };
  });
  
  // Pay period settings state with localStorage persistence
  const [payPeriodSettingsState, setPayPeriodSettings] = useState<PayPeriodSettings>(() => {
    // Try to load from localStorage first, fallback to props
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('payPeriodSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved pay period settings:', e);
        }
      }
    }
    return {
      type: payPeriodSettings?.type ?? "weekly",
      startDay: payPeriodSettings?.startDay ?? 1,
      customStartDate: payPeriodSettings?.customStartDate
    };
  });
  
  // Multi-select dropdown states
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  console.log("TimesheetsClient initialized with timesheets:", timesheets.length);
  console.log("First few timesheets:", timesheets.slice(0, 3).map(ts => ({
    id: ts.id,
    name: ts.employeeName,
    weekPeriod: ts.weekPeriod,
    startDate: ts.startDate,
    endDate: ts.endDate
  })));
  console.log("Current pay period state:", currentPayPeriod);
  console.log("Date range state:", dateRange);
  console.log("Pay period settings from localStorage:", payPeriodSettingsState);

  // Effect to update current period when settings change (e.g., after loading from localStorage)
  useEffect(() => {
    if (payPeriodSettingsState) {
      const newPeriod = getCurrentPayPeriod(payPeriodSettingsState);
      setCurrentPayPeriod(newPeriod);
      setDateRange({ from: newPeriod.start, to: newPeriod.end });
      console.log("Updated pay period based on localStorage settings:", newPeriod);
    }
  }, []); // Run only once on mount

  // Get unique values for filters
  const departments = useMemo(() => Array.from(new Set(timesheets.map(ts => ts.department))), [timesheets]);
  const statuses = useMemo(() => Array.from(new Set(timesheets.map(ts => ts.status))), [timesheets]);
  const locations = useMemo(() => Array.from(new Set(timesheets.map(ts => ts.location))), [timesheets]);
  const projects = useMemo(() => Array.from(new Set(timesheets.map(ts => ts.project))), [timesheets]);
  const roles = useMemo(() => Array.from(new Set(timesheets.map(ts => ts.role))), [timesheets]);

  // Filter and sort timesheets
  const filteredAndSortedTimesheets = useMemo(() => {
    console.log("Filtering timesheets. Selected employee:", selectedEmployee, "Selected employees count:", selectedEmployees.length);
    
    let filtered = timesheets.filter(timesheet => {
      const matchesSearch = searchTerm === "" || 
        timesheet.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timesheet.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timesheet.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timesheet.project.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSelectedEmployee = (selectedEmployee === "" && selectedEmployees.length === 0) || 
                                     timesheet.employeeName === selectedEmployee ||
                                     selectedEmployees.includes(timesheet.employeeName);

      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(timesheet.department);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(timesheet.status);
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(timesheet.location);
      const matchesProject = selectedProjects.length === 0 || selectedProjects.includes(timesheet.project);
      const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(timesheet.role);
      
      const matchesHoursRange = (hoursRangeMin === "" || timesheet.totalHours >= parseFloat(hoursRangeMin)) &&
                               (hoursRangeMax === "" || timesheet.totalHours <= parseFloat(hoursRangeMax));
      
      const matchesDateRange = (!dateRange.from || new Date(timesheet.startDate) >= dateRange.from) &&
                              (!dateRange.to || new Date(timesheet.startDate) <= dateRange.to);

      return matchesSearch && matchesSelectedEmployee && matchesDepartment && matchesStatus && matchesLocation && 
             matchesProject && matchesRole && matchesHoursRange && matchesDateRange;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || bValue === undefined || aValue === null || bValue === null) return 0;
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    console.log(`Filtered ${filtered.length} timesheets out of ${timesheets.length} total`);
    return filtered;
  }, [timesheets, searchTerm, selectedEmployee, selectedEmployees, selectedDepartments, selectedStatuses, selectedLocations, selectedProjects, selectedRoles, hoursRangeMin, hoursRangeMax, dateRange, sortField, sortDirection]);

  const getStatusPriority = (statuses: Set<string>) => {
    if (statuses.has("Open")) return 1;
    if (statuses.has("Pending") || statuses.has("Pending Approval")) return 2;
    if (statuses.has("Rejected")) return 3;
    if (statuses.has("Draft")) return 4;
    if (statuses.has("Approved")) return 5;
    return 6;
  };

  const getPrimaryStatus = (statuses: Set<string>) => {
    const statusArray = Array.from(statuses);
    if (statusArray.includes("Open")) return "Open";
    if (statusArray.includes("Pending")) return "Pending";
    if (statusArray.includes("Pending Approval")) return "Pending";
    if (statusArray.includes("Rejected")) return "Rejected";
    if (statusArray.includes("Draft")) return "Draft";
    if (statusArray.includes("Approved")) return "Approved";
    return statusArray[0] || "Unknown";
  };

  // Filter timesheets for sidebar (exclude search term to keep all employees visible)
  const sidebarFilteredTimesheets = useMemo(() => {
    return timesheets.filter(timesheet => {
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(timesheet.department);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(timesheet.status);
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(timesheet.location);
      const matchesProject = selectedProjects.length === 0 || selectedProjects.includes(timesheet.project);
      const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(timesheet.role);
      
      const matchesHoursRange = (hoursRangeMin === "" || timesheet.totalHours >= parseFloat(hoursRangeMin)) &&
                               (hoursRangeMax === "" || timesheet.totalHours <= parseFloat(hoursRangeMax));
      
      const matchesDateRange = (!dateRange.from || new Date(timesheet.startDate) >= dateRange.from) &&
                              (!dateRange.to || new Date(timesheet.startDate) <= dateRange.to);

      return matchesDepartment && matchesStatus && matchesLocation && 
             matchesProject && matchesRole && matchesHoursRange && matchesDateRange;
    });
  }, [timesheets, selectedDepartments, selectedStatuses, selectedLocations, selectedProjects, selectedRoles, hoursRangeMin, hoursRangeMax, dateRange]);

  // Get unique employees with timesheet data for sidebar (with search functionality)
  const employeesWithTimesheets = useMemo(() => {
    const employeeMap = new Map();
    sidebarFilteredTimesheets.forEach(ts => {
      const key = ts.employeeName;
      if (!employeeMap.has(key)) {
        employeeMap.set(key, {
          name: ts.employeeName,
          email: ts.employeeEmail,
          avatar: ts.employeeAvatar,
          role: ts.role,
          department: ts.department,
          location: ts.location,
          timesheets: [ts],
          totalHours: ts.totalHours,
          statuses: new Set([ts.status])
        });
      } else {
        const employee = employeeMap.get(key);
        employee.timesheets.push(ts);
        employee.totalHours += ts.totalHours;
        employee.statuses.add(ts.status);
      }
    });
    
    let employees = Array.from(employeeMap.values()).map(emp => ({
      ...emp,
      statusPriority: getStatusPriority(emp.statuses),
      primaryStatus: getPrimaryStatus(emp.statuses)
    }));
    
    // Filter by employee search term
    if (employeeSearchTerm) {
      employees = employees.filter(emp => 
        emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(employeeSearchTerm.toLowerCase())
      );
    }
    
    return employees.sort((a, b) => a.name.localeCompare(b.name));
  }, [sidebarFilteredTimesheets, employeeSearchTerm]);

  // Group timesheets functionality
  const groupedTimesheets = useMemo(() => {
    if (groupBy === "none") {
      return { "All Timesheets": filteredAndSortedTimesheets };
    }

    const groups: { [key: string]: Timesheet[] } = {};
    
    filteredAndSortedTimesheets.forEach(timesheet => {
      let groupKey = "";
      switch (groupBy) {
        case "employee":
          groupKey = timesheet.employeeName;
          break;
        case "department":
          groupKey = timesheet.department;
          break;
        case "location":
          groupKey = timesheet.location;
          break;
        case "role":
          groupKey = timesheet.role;
          break;
        case "status":
          groupKey = timesheet.status;
          break;
        case "project":
          groupKey = timesheet.project;
          break;
        default:
          groupKey = "All Timesheets";
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(timesheet);
    });

    return groups;
  }, [filteredAndSortedTimesheets, groupBy]);

  const handleSort = (field: keyof Timesheet) => {
    console.log("Sorting by field:", field);
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleApprove = (timesheetId: number) => {
    console.log("Approving timesheet:", timesheetId);
    setTimesheets(prev => prev.map(ts => 
      ts.id === timesheetId ? { 
        ...ts, 
        status: "Approved", 
        approvedBy: currentUser.name,
        approvedDate: new Date().toISOString().split('T')[0]
      } : ts
    ));
    toast.success("Timesheet approved successfully!");
    setApprovalDialogOpen(false);
    setSelectedTimesheet(null);
  };

  const handleReject = (timesheetId: number, reason: string) => {
    console.log("Rejecting timesheet:", timesheetId, "with reason:", reason);
    setTimesheets(prev => prev.map(ts => 
      ts.id === timesheetId ? { 
        ...ts, 
        status: "Rejected", 
        rejectedBy: currentUser.name,
        rejectedDate: new Date().toISOString().split('T')[0],
        rejectionReason: reason
      } : ts
    ));
    toast.success("Timesheet rejected with feedback!");
    setApprovalDialogOpen(false);
    setSelectedTimesheet(null);
    setRejectionReason("");
  };

  const handleAddTimesheet = () => {
    console.log("Adding new timesheet");
    
    // Create a new timesheet without assigning an employee yet
    const newTimesheet = {
      id: Math.max(...timesheets.map(ts => ts.id)) + 1,
      employeeName: "",  // Empty - to be selected in the dialog
      employeeEmail: "",
      employeeAvatar: "",
      role: "",
      department: "",
      location: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      totalHours: 8,
      regularHours: 8,
      overtimeHours: 0,
      breakHours: 1,
      project: "General Work",
      status: "Draft",
      submittedDate: null,
      currentShiftStart: "09:00 AM",
      currentShiftEnd: "05:00 PM",
      notes: "",
      weekPeriod: currentPayPeriod.label,
      lastModified: new Date().toISOString().split('T')[0],
      dailyHours: [{
        date: new Date().toISOString().split('T')[0],
        hours: 8,
        breakHours: 1,
        startTime: "09:00",
        endTime: "17:00",
        project: "General Work",
        description: "Daily work activities"
      }]
    };
    
    // Open the edit dialog for the new timesheet (don't add to list yet)
    setSelectedTimesheet(newTimesheet);
    
    // Pre-populate edit form for the new timesheet
    setEditForm({
      date: newTimesheet.startDate,
      startTime: "09:00",
      endTime: "17:00",
      totalHours: 8,
      breaks: [{ name: "Lunch Break", duration: 1 }],
      project: "General Work",
      description: "Daily work activities",
      notes: "",
      status: "Draft",
      employeeName: "",
      employeeEmail: "",
      role: "",
      department: "",
      location: ""
    });
    
    setEditDialogOpen(true);
    toast.success("Create new timesheet - Select employee and fill details.");
  };

  const handleEdit = (timesheetId: number) => {
    console.log("Opening edit dialog for timesheet:", timesheetId);
    const timesheet = timesheets.find(ts => ts.id === timesheetId);
    if (timesheet) {
      setSelectedTimesheet(timesheet);
      
      // Parse existing breaks from daily hours
      const existingBreaks = timesheet.dailyHours.length > 0 
        ? [{ name: "Break", duration: timesheet.breakHours }] 
        : [];
      
      // Pre-populate edit form with existing data
      setEditForm({
        date: timesheet.startDate,
        startTime: timesheet.currentShiftStart?.replace(" AM", "").replace(" PM", "") || "",
        endTime: timesheet.currentShiftEnd?.replace(" AM", "").replace(" PM", "") || "",
        totalHours: timesheet.totalHours,
        breaks: existingBreaks,
        project: timesheet.project,
        description: timesheet.notes,
        notes: timesheet.notes,
        status: timesheet.status,
        employeeName: timesheet.employeeName,
        employeeEmail: timesheet.employeeEmail,
        role: timesheet.role,
        department: timesheet.department,
        location: timesheet.location
      });
      
      setEditDialogOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedTimesheet) return;
    
    console.log("Saving timesheet edits:", editForm);
    
    // Validate required fields for new timesheets
    if (!selectedTimesheet.employeeName && !editForm.employeeName) {
      toast.error("Please select an employee!");
      return;
    }
    
    // Calculate total break hours
    const totalBreakHours = editForm.breaks.reduce((sum, br) => sum + br.duration, 0);
    
    // Prepare updated timesheet data
    const updatedTimesheet = {
      ...selectedTimesheet,
      employeeName: editForm.employeeName || selectedTimesheet.employeeName,
      employeeEmail: editForm.employeeEmail || selectedTimesheet.employeeEmail || `${editForm.employeeName?.toLowerCase().replace(" ", ".")}@company.com`,
      role: editForm.role || selectedTimesheet.role,
      department: editForm.department || selectedTimesheet.department,
      location: editForm.location || selectedTimesheet.location,
      startDate: editForm.date,
      endDate: editForm.date,
      currentShiftStart: editForm.startTime ? `${editForm.startTime}${editForm.startTime.includes(":") ? "" : ":00"}` : selectedTimesheet.currentShiftStart,
      currentShiftEnd: editForm.endTime ? `${editForm.endTime}${editForm.endTime.includes(":") ? "" : ":00"}` : selectedTimesheet.currentShiftEnd,
      totalHours: editForm.totalHours,
      regularHours: editForm.totalHours > 8 ? 8 : editForm.totalHours,
      overtimeHours: editForm.totalHours > 8 ? editForm.totalHours - 8 : 0,
      breakHours: totalBreakHours,
      project: editForm.project,
      notes: editForm.notes,
      status: editForm.status,
      lastModified: new Date().toISOString().split('T')[0],
      dailyHours: [{
        date: editForm.date,
        hours: editForm.totalHours,
        breakHours: totalBreakHours,
        startTime: editForm.startTime,
        endTime: editForm.endTime,
        project: editForm.project,
        description: editForm.description
      }]
    };
    
    // If this is a new timesheet (no existing employee name), add it to the list
    if (!selectedTimesheet.employeeName) {
      setTimesheets(prev => [updatedTimesheet, ...prev]);
      toast.success("New timesheet created successfully!");
    } else {
      // Update existing timesheet
      setTimesheets(prev => prev.map(ts => 
        ts.id === selectedTimesheet.id ? updatedTimesheet : ts
      ));
      toast.success("Timesheet updated successfully!");
    }
    
    setEditDialogOpen(false);
    setSelectedTimesheet(null);
  };

  const addBreak = () => {
    const breakNumber = editForm.breaks.length + 1;
    const defaultName = breakNumber === 1 ? "Lunch Break" : breakNumber === 2 ? "Coffee Break" : `Break ${breakNumber}`;
    
    setEditForm(prev => ({
      ...prev,
      breaks: [...prev.breaks, { name: defaultName, duration: 0.5 }]
    }));
  };

  const removeBreak = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      breaks: prev.breaks.filter((_, i) => i !== index)
    }));
  };

  const updateBreak = (index: number, field: "name" | "duration", value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      breaks: prev.breaks.map((br, i) => 
        i === index ? { ...br, [field]: value } : br
      )
    }));
  };

  const handleDiscard = (timesheetId: number) => {
    console.log("Discarding timesheet:", timesheetId);
    setTimesheets(prev => prev.filter(ts => ts.id !== timesheetId));
    toast.success("Timesheet discarded successfully!");
  };

  const handleViewDetails = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setDetailsDialogOpen(true);
  };

  const handleViewEmployeePhotos = (employeeName: string) => {
    console.log("Opening photo verification modal for:", employeeName);
    
    // Mock photo data - in a real app, this would come from API
    const mockPhotos = {
      employeeName,
      photos: {
        clockIn: [
          {
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
            timestamp: "8:30 AM",
            location: "Main Office Entrance"
          },
          {
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
            timestamp: "9:15 AM", 
            location: "Project Site A"
          }
        ],
        clockOut: [
          {
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
            timestamp: "5:30 PM",
            location: "Main Office Exit"
          }
        ],
        breaks: [
          {
            image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=300&h=300&fit=crop",
            timestamp: "12:00 PM",
            type: "Lunch Break",
            location: "Office Cafeteria"
          },
          {
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop", 
            timestamp: "3:15 PM",
            type: "Coffee Break",
            location: "Break Room"
          },
          {
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
            timestamp: "10:30 AM", 
            type: "Short Break",
            location: "Outdoor Seating"
          }
        ]
      }
    };
    
    setSelectedEmployeePhotos(mockPhotos);
    setPhotoModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending Approval": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected": return "bg-red-100 text-red-800 border-red-200";
      case "Draft": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Open": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <CheckCircle2 className="h-4 w-4" />;
      case "Pending Approval": return <Clock className="h-4 w-4" />;
      case "Rejected": return <UserX className="h-4 w-4" />;
      case "Draft": return <FileEdit className="h-4 w-4" />;
      case "Open": return <Play className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const SortIcon = ({ field }: { field: keyof Timesheet }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />;
  };

  // Enhanced dynamic stats with more detailed information
  const stats = useMemo(() => {
    // Current period data
    const currentPeriodStats = {
      total: filteredAndSortedTimesheets.length,
      pending: filteredAndSortedTimesheets.filter(ts => ts.status === "Pending" || ts.status === "Pending Approval").length,
      approved: filteredAndSortedTimesheets.filter(ts => ts.status === "Approved").length,
      rejected: filteredAndSortedTimesheets.filter(ts => ts.status === "Rejected").length,
      open: filteredAndSortedTimesheets.filter(ts => ts.status === "Open").length,
      draft: filteredAndSortedTimesheets.filter(ts => ts.status === "Draft").length,
      totalHours: filteredAndSortedTimesheets.reduce((sum, ts) => sum + ts.totalHours, 0),
      overtimeHours: filteredAndSortedTimesheets.reduce((sum, ts) => sum + ts.overtimeHours, 0),
      breakHours: filteredAndSortedTimesheets.reduce((sum, ts) => sum + ts.breakHours, 0)
    };

    // Today's data (for current date comparison)
    const today = new Date().toISOString().split('T')[0];
    const todayTimesheets = filteredAndSortedTimesheets.filter(ts => ts.startDate === today);
    const todayStats = {
      total: todayTimesheets.length,
      totalHours: todayTimesheets.reduce((sum, ts) => sum + ts.totalHours, 0),
      overtimeHours: todayTimesheets.reduce((sum, ts) => sum + ts.overtimeHours, 0),
      breakHours: todayTimesheets.reduce((sum, ts) => sum + ts.breakHours, 0)
    };

    // Calculate previous period for trend comparison
    const previousPeriodStart = new Date(currentPayPeriod.start);
    const previousPeriodEnd = new Date(currentPayPeriod.end);
    const daysDiff = Math.ceil((previousPeriodEnd.getTime() - previousPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    
    const prevStart = new Date(previousPeriodStart);
    prevStart.setDate(prevStart.getDate() - daysDiff);
    const prevEnd = new Date(previousPeriodEnd);
    prevEnd.setDate(prevEnd.getDate() - daysDiff);

    // Mock previous period data (in real app, this would come from API)
    const previousPeriodStats = {
      total: Math.floor(currentPeriodStats.total * 0.9), // 10% less than current
      pending: Math.floor(currentPeriodStats.pending * 1.2), // 20% more pending
      approved: Math.floor(currentPeriodStats.approved * 0.8), // 20% less approved
      rejected: Math.floor(currentPeriodStats.rejected * 1.1), // 10% more rejected
      open: Math.floor(currentPeriodStats.open * 0.95), // 5% less open
      totalHours: currentPeriodStats.totalHours * 0.85, // 15% less hours
      overtimeHours: currentPeriodStats.overtimeHours * 0.7, // 30% less overtime
      breakHours: currentPeriodStats.breakHours * 0.9 // 10% less break time
    };

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return { percentage: 0, direction: 'neutral' as const };
      const percentage = ((current - previous) / previous) * 100;
      return {
        percentage: Math.abs(percentage),
        direction: percentage > 0 ? 'up' as const : percentage < 0 ? 'down' as const : 'neutral' as const
      };
    };

    return {
      current: currentPeriodStats,
      today: todayStats,
      previous: previousPeriodStats,
      trends: {
        total: calculateTrend(currentPeriodStats.total, previousPeriodStats.total),
        pending: calculateTrend(currentPeriodStats.pending, previousPeriodStats.pending),
        approved: calculateTrend(currentPeriodStats.approved, previousPeriodStats.approved),
        rejected: calculateTrend(currentPeriodStats.rejected, previousPeriodStats.rejected),
        open: calculateTrend(currentPeriodStats.open, previousPeriodStats.open),
        totalHours: calculateTrend(currentPeriodStats.totalHours, previousPeriodStats.totalHours),
        overtimeHours: calculateTrend(currentPeriodStats.overtimeHours, previousPeriodStats.overtimeHours),
        breakHours: calculateTrend(currentPeriodStats.breakHours, previousPeriodStats.breakHours)
      }
    };
  }, [filteredAndSortedTimesheets, currentPayPeriod]);

  const handleExport = () => {
    console.log("Exporting timesheets with format:", exportFormat, "columns:", selectedColumns);
    
    // Add export metadata
    const exportMetadata = {
      exportDate: new Date().toISOString(),
      totalRecords: filteredAndSortedTimesheets.length,
      appliedFilters: {
        searchTerm: searchTerm || null,
        departments: selectedDepartments.length > 0 ? selectedDepartments : null,
        statuses: selectedStatuses.length > 0 ? selectedStatuses : null,
        locations: selectedLocations.length > 0 ? selectedLocations : null,
        projects: selectedProjects.length > 0 ? selectedProjects : null,
        roles: selectedRoles.length > 0 ? selectedRoles : null,
        hoursRange: (hoursRangeMin || hoursRangeMax) ? {
          min: hoursRangeMin || null,
          max: hoursRangeMax || null
        } : null,
        dateRange: (dateRange.from || dateRange.to) ? {
          from: dateRange.from?.toISOString() || null,
          to: dateRange.to?.toISOString() || null
        } : null
      }
    };

    const filteredData = filteredAndSortedTimesheets.map(ts => {
      const exportData: any = {};
      selectedColumns.forEach(col => {
        if (col === "employeeName") exportData["Employee Name"] = ts.employeeName;
        if (col === "employeeEmail") exportData["Email"] = ts.employeeEmail;
        if (col === "role") exportData["Role"] = ts.role;
        if (col === "department") exportData["Department"] = ts.department;
        if (col === "location") exportData["Location"] = ts.location;
        if (col === "startDate") exportData["Date"] = new Date(ts.startDate).toLocaleDateString();
        if (col === "currentShiftStart") {
          exportData["Shift Time"] = ts.currentShiftStart && ts.currentShiftEnd 
            ? `${ts.currentShiftStart} - ${ts.currentShiftEnd}`
            : ts.currentShiftStart 
              ? `${ts.currentShiftStart} - In Progress`
              : "Not started";
        }
        if (col === "totalHours") exportData["Total Hours"] = ts.totalHours;
        if (col === "regularHours") exportData["Regular Hours"] = ts.regularHours;
        if (col === "overtimeHours") exportData["Overtime Hours"] = ts.overtimeHours;
        if (col === "breakHours") exportData["Break Hours"] = ts.breakHours;
        if (col === "status") exportData["Status"] = ts.status;
        if (col === "submittedDate") exportData["Submitted Date"] = ts.submittedDate || "Not Submitted";
        if (col === "project") exportData["Project"] = ts.project;
      });
      return exportData;
    });
    
    // Log export details for demonstration
    console.log("Export Metadata:", exportMetadata);
    console.log("Export Data Sample:", filteredData.slice(0, 2));
    
    // In a real application, this would trigger actual file download with metadata
    let filterDescription = "";
    if (dateRange.from || dateRange.to) {
      const fromDate = dateRange.from?.toLocaleDateString() || "Start";
      const toDate = dateRange.to?.toLocaleDateString() || "End";
      filterDescription += ` (${fromDate} to ${toDate})`;
    }
    
    toast.success(`Exported ${filteredData.length} timesheets as ${exportFormat.toUpperCase()}${filterDescription}`);
    setExportDialogOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedDepartments([]);
    setSelectedStatuses([]);
    setSelectedLocations([]);
    setSelectedProjects([]);
    setSelectedRoles([]);
    setHoursRangeMin("");
    setHoursRangeMax("");
    const currentPeriod = getCurrentPayPeriod(payPeriodSettingsState);
    setCurrentPayPeriod(currentPeriod);
    setDateRange({ from: currentPeriod.start, to: currentPeriod.end });
    setSearchTerm("");
    setSelectedEmployee("");
    setSelectedEmployees([]);
    setEmployeeSearchTerm("");
  };

  const navigatePayPeriod = (direction: 'previous' | 'next') => {
    console.log(`Navigating to ${direction} pay period`);
    const newPeriod = calculatePayPeriod(
      currentPayPeriod.start,
      payPeriodSettingsState,
      direction === 'previous' ? -1 : 1
    );
    setCurrentPayPeriod(newPeriod);
    setDateRange({ from: newPeriod.start, to: newPeriod.end });
    // Clear selected employees when changing pay periods
    setSelectedEmployee("");
    setSelectedEmployees([]);
  };

  const resetToCurrentPayPeriod = () => {
    const currentPeriod = getCurrentPayPeriod(payPeriodSettingsState);
    setCurrentPayPeriod(currentPeriod);
    setDateRange({ from: currentPeriod.start, to: currentPeriod.end });
    // Clear selected employees when resetting to current pay period
    setSelectedEmployee("");
    setSelectedEmployees([]);
  };

  // Employee selection helpers
  const handleEmployeeClick = (employeeName: string) => {
    console.log("Employee clicked:", employeeName);
    
    if (selectedEmployees.includes(employeeName)) {
      // Remove from multi-selection
      setSelectedEmployees(prev => prev.filter(name => name !== employeeName));
      // If this was also the single selected employee, clear it
      if (selectedEmployee === employeeName) {
        setSelectedEmployee("");
      }
    } else {
      // Add to multi-selection
      setSelectedEmployees(prev => [...prev, employeeName]);
      // Also set as single selected for backward compatibility
      setSelectedEmployee(employeeName);
    }
  };

  const resetEmployeeSelection = () => {
    console.log("Resetting employee selection");
    setSelectedEmployee("");
    setSelectedEmployees([]);
    setEmployeeSearchTerm("");
  };

  // Multi-select helper functions
  const toggleSelection = (item: string, selectedItems: string[], setSelectedItems: (items: string[]) => void) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const MultiSelectDropdown = ({ 
    items, 
    selectedItems, 
    setSelectedItems, 
    placeholder, 
    isOpen, 
    setIsOpen,
    label 
  }: {
    items: string[];
    selectedItems: string[];
    setSelectedItems: (items: string[]) => void;
    placeholder: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    label: string;
  }) => {
    return (
      <div className="space-y-1">
        <Label className="text-xs font-medium">{label}</Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              className="w-full justify-between h-8 text-xs"
            >
              {selectedItems.length > 0 
                ? `${selectedItems.length} selected`
                : placeholder
              }
              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-8" />
              <CommandList>
                <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item}
                      onSelect={() => toggleSelection(item, selectedItems, setSelectedItems)}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedItems.includes(item)}
                          onChange={() => toggleSelection(item, selectedItems, setSelectedItems)}
                        />
                        <span className="text-xs">{item}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedItems.slice(0, 3).map(item => (
              <Badge key={item} variant="secondary" className="text-xs h-5">
                {item.length > 8 ? `${item.substring(0, 8)}...` : item}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
                  onClick={() => toggleSelection(item, selectedItems, setSelectedItems)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
            {selectedItems.length > 3 && (
              <Badge variant="secondary" className="text-xs h-5">
                +{selectedItems.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  };

  const availableColumns = [
    { key: "employeeName", label: "Employee Name" },
    { key: "employeeEmail", label: "Email" },
    { key: "role", label: "Role" },
    { key: "department", label: "Department" },
    { key: "location", label: "Location" },
    { key: "startDate", label: "Date" },
    { key: "currentShiftStart", label: "Shift Time" },
    { key: "totalHours", label: "Total Hours" },
    { key: "regularHours", label: "Regular Hours" },
    { key: "overtimeHours", label: "Overtime Hours" },
    { key: "breakHours", label: "Break Hours" },
    { key: "status", label: "Status" },
    { key: "submittedDate", label: "Submitted Date" },
    { key: "project", label: "Project" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Employee Sidebar - Enhanced with Search & Multi-Select */}
      <div className={`${sidebarCollapsed ? 'w-12' : 'w-72'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
        {/* Enhanced Sidebar Header */}
        <div className="p-2 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className={`${sidebarCollapsed ? 'hidden' : 'block'}`}>
              <h3 className="font-medium text-gray-900 flex items-center gap-2 text-sm">
                <Users2 className="h-4 w-4" />
                Employees ({employeesWithTimesheets.length})
                {(selectedEmployees.length > 0 || selectedEmployee) && (
                  <div className="flex items-center gap-1">
                    {selectedEmployees.length > 1 ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        {selectedEmployees.length} selected
                      </Badge>
                    ) : selectedEmployee && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        {selectedEmployee.split(' ')[0]}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetEmployeeSelection}
                      className="h-4 w-4 p-0 hover:bg-red-100"
                      title="Clear Selection"
                    >
                      <RefreshCw className="h-2 w-2 text-red-600" />
                    </Button>
                  </div>
                )}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-6 w-6 p-0"
            >
              {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>
          </div>
          
          {/* Employee Search */}
          {!sidebarCollapsed && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Search employees..."
                className="pl-7 h-7 text-xs"
                value={employeeSearchTerm}
                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
              />
              {employeeSearchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEmployeeSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Enhanced Employee List */}
        <div className="flex-1 overflow-y-auto p-1">
          <div className="space-y-1">
            {employeesWithTimesheets.map((employee) => {
              const isSelected = selectedEmployees.includes(employee.name) || selectedEmployee === employee.name;
              
              return (
                <div
                  key={employee.name}
                  className={`${sidebarCollapsed ? 'p-1' : 'p-2'} rounded-md border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                    isSelected
                      ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-200' 
                      : getStatusColor(employee.primaryStatus).includes('border') 
                        ? `bg-${employee.primaryStatus === 'Approved' ? 'green' : 
                             employee.primaryStatus === 'Pending' || employee.primaryStatus === 'Pending Approval' ? 'yellow' :
                             employee.primaryStatus === 'Rejected' ? 'red' :
                             employee.primaryStatus === 'Open' ? 'blue' : 'gray'}-50 border-${
                               employee.primaryStatus === 'Approved' ? 'green' : 
                               employee.primaryStatus === 'Pending' || employee.primaryStatus === 'Pending Approval' ? 'yellow' :
                               employee.primaryStatus === 'Rejected' ? 'red' :
                               employee.primaryStatus === 'Open' ? 'blue' : 'gray'}-200`
                        : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => handleEmployeeClick(employee.name)}
                  title={sidebarCollapsed ? `${employee.name} - ${employee.role}` : ''}
                >
                  {sidebarCollapsed ? (
                    // Ultra-compact collapsed view - Avatar only with status indicator
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback className="bg-hrms-blue-600 text-white text-xs">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                          employee.primaryStatus === 'Approved' ? 'bg-green-500' :
                          employee.primaryStatus === 'Pending' || employee.primaryStatus === 'Pending Approval' ? 'bg-yellow-500' :
                          employee.primaryStatus === 'Rejected' ? 'bg-red-500' :
                          employee.primaryStatus === 'Open' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`}></div>
                        {/* Selection indicator for collapsed view */}
                        {isSelected && (
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Enhanced expanded view with checkbox
                    <div className="flex items-center space-x-2">
                      {/* Multi-select checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleEmployeeClick(employee.name)}
                        className="h-4 w-4"
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback className="bg-hrms-blue-600 text-white text-xs">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white ${
                          employee.primaryStatus === 'Approved' ? 'bg-green-500' :
                          employee.primaryStatus === 'Pending' || employee.primaryStatus === 'Pending Approval' ? 'bg-yellow-500' :
                          employee.primaryStatus === 'Rejected' ? 'bg-red-500' :
                          employee.primaryStatus === 'Open' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{employee.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 truncate">{employee.role}</span>
                          <span className="text-xs font-medium text-gray-600">{employee.totalHours.toFixed(1)}h</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {employeesWithTimesheets.length === 0 && (
              <div className={`text-center ${sidebarCollapsed ? 'py-2' : 'py-4'}`}>
                <Users2 className={`${sidebarCollapsed ? 'h-6 w-6' : 'h-8 w-8'} mx-auto text-gray-400 mb-2`} />
                {!sidebarCollapsed && (
                  <>
                    <p className="text-gray-500 text-xs">
                      {employeeSearchTerm ? "No employees match your search" : "No employees found"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {employeeSearchTerm ? "Try different search terms" : "Adjust filters"}
                    </p>
                    {employeeSearchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEmployeeSearchTerm("")}
                        className="mt-2 text-xs h-6"
                      >
                        Clear search
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Compact Status Legend - Only show when expanded */}
        {!sidebarCollapsed && (
          <div className="p-2 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Approved</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Rejected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Open</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Enhanced Top Row: Stats Cards with Details */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {/* Total Timesheets */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-lg font-bold text-blue-700">{stats.current.total}</div>
                  <div className={`flex items-center text-xs ${
                    stats.trends.total.direction === 'up' ? 'text-green-600' : 
                    stats.trends.total.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stats.trends.total.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.trends.total.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.trends.total.percentage.toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-blue-600 font-medium">Total</div>
                <div className="text-xs text-blue-500 mt-1">
                  This Period • Today: {stats.today.total}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approval */}
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-lg font-bold text-yellow-700">{stats.current.pending}</div>
                  <div className={`flex items-center text-xs ${
                    stats.trends.pending.direction === 'up' ? 'text-red-600' : 
                    stats.trends.pending.direction === 'down' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {stats.trends.pending.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.trends.pending.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.trends.pending.percentage.toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-yellow-600 font-medium">Pending</div>
                <div className="text-xs text-yellow-500 mt-1">
                  Awaiting Review
                </div>
              </CardContent>
            </Card>

            {/* Approved */}
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-lg font-bold text-green-700">{stats.current.approved}</div>
                  <div className={`flex items-center text-xs ${
                    stats.trends.approved.direction === 'up' ? 'text-green-600' : 
                    stats.trends.approved.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stats.trends.approved.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.trends.approved.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.trends.approved.percentage.toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-green-600 font-medium">Approved</div>
                <div className="text-xs text-green-500 mt-1">
                  Complete ✓
                </div>
              </CardContent>
            </Card>

            {/* Rejected */}
            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-lg font-bold text-red-700">{stats.current.rejected}</div>
                  <div className={`flex items-center text-xs ${
                    stats.trends.rejected.direction === 'up' ? 'text-red-600' : 
                    stats.trends.rejected.direction === 'down' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {stats.trends.rejected.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.trends.rejected.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.trends.rejected.percentage.toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-red-600 font-medium">Rejected</div>
                <div className="text-xs text-red-500 mt-1">
                  Need Review
                </div>
              </CardContent>
            </Card>

            {/* Open */}
            <Card className="bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-lg font-bold text-cyan-700">{stats.current.open}</div>
                  <div className={`flex items-center text-xs ${
                    stats.trends.open.direction === 'up' ? 'text-green-600' : 
                    stats.trends.open.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stats.trends.open.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.trends.open.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.trends.open.percentage.toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-cyan-600 font-medium">Open</div>
                <div className="text-xs text-cyan-500 mt-1">
                  Active Now
                </div>
              </CardContent>
            </Card>

            {/* Total Hours */}
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-lg font-bold text-purple-700">{stats.current.totalHours.toFixed(1)}</div>
                  <div className={`flex items-center text-xs ${
                    stats.trends.totalHours.direction === 'up' ? 'text-green-600' : 
                    stats.trends.totalHours.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stats.trends.totalHours.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.trends.totalHours.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.trends.totalHours.percentage.toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-purple-600 font-medium">Total Hours</div>
                <div className="text-xs text-purple-500 mt-1">
                  Today: {stats.today.totalHours.toFixed(1)}h
                </div>
              </CardContent>
            </Card>

            {/* Overtime */}
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-lg font-bold text-orange-700">{stats.current.overtimeHours.toFixed(1)}</div>
                  <div className={`flex items-center text-xs ${
                    stats.trends.overtimeHours.direction === 'up' ? 'text-red-600' : 
                    stats.trends.overtimeHours.direction === 'down' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {stats.trends.overtimeHours.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.trends.overtimeHours.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.trends.overtimeHours.percentage.toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-orange-600 font-medium">Overtime</div>
                <div className="text-xs text-orange-500 mt-1">
                  Today: {stats.today.overtimeHours.toFixed(1)}h
                </div>
              </CardContent>
            </Card>

            {/* Break Minutes */}
            <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-lg font-bold text-emerald-700">{(stats.current.breakHours * 60).toFixed(0)}</div>
                  <div className={`flex items-center text-xs ${
                    stats.trends.breakHours.direction === 'up' ? 'text-green-600' : 
                    stats.trends.breakHours.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stats.trends.breakHours.direction === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stats.trends.breakHours.direction === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.trends.breakHours.percentage.toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-emerald-600 font-medium">Break Minutes</div>
                <div className="text-xs text-emerald-500 mt-1">
                  Today: {(stats.today.breakHours * 60).toFixed(0)} min
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Controls Row with Inline Filters */}
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Top Controls Row */}
              <div className="flex items-center justify-between gap-3">
                {/* Pay Period Navigation with Custom Date Range */}
                <div className="flex items-center gap-2">
                  <Popover open={customDatePickerOpen} onOpenChange={setCustomDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200 px-3 py-2 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-colors">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigatePayPeriod('previous');
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                        
                        <div className="text-center min-w-[120px]">
                          <div className="font-medium text-blue-900 text-xs">{currentPayPeriod.label}</div>
                          <div className="text-xs text-blue-700">
                            {currentPayPeriod.start.toLocaleDateString()} - {currentPayPeriod.end.toLocaleDateString()}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigatePayPeriod('next');
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3 space-y-3">
                        <div className="text-sm font-medium">Select Custom Date Range</div>
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={(range) => {
                            setDateRange({ 
                              from: range?.from, 
                              to: range?.to 
                            });
                            if (range?.from && range?.to) {
                              setCurrentPayPeriod({
                                start: range.from,
                                end: range.to,
                                label: `Custom Range`
                              });
                              setCustomDatePickerOpen(false);
                            }
                          }}
                          numberOfMonths={2}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Reset to Current Pay Period Icon */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToCurrentPayPeriod}
                    className="h-8 w-8 p-0"
                    title="Reset to Current Pay Period"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-hrms-slate-400" />
                  <Input
                    placeholder="Search timesheets..."
                    className="pl-8 h-9 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")} className="h-8 w-8 p-0">
                    {viewMode === "list" ? <Grid3X3 className="h-3 w-3" /> : <List className="h-3 w-3" />}
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={() => setOrganizationSettingsOpen(true)} className="h-8 w-8 p-0" title="Organization Settings">
                    <Settings className="h-3 w-3" />
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)} className="h-8">
                    <Download className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>

                  <Button size="sm" onClick={handleAddTimesheet} className="bg-hrms-blue-600 hover:bg-hrms-blue-700 h-8">
                    <Plus className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">New Timesheet</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </div>
              </div>

              {/* Compact Filters - No Labels */}
              <div className="space-y-3 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Filters</h4>
                  {(selectedDepartments.length > 0 || selectedStatuses.length > 0 || selectedLocations.length > 0 || 
                    selectedProjects.length > 0 || selectedRoles.length > 0 || hoursRangeMin || hoursRangeMax) && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* Department Filter - Compact */}
                  <Popover open={departmentDropdownOpen} onOpenChange={setDepartmentDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={departmentDropdownOpen}
                        className="w-full justify-between h-8 text-xs"
                      >
                        {selectedDepartments.length > 0 
                          ? `${selectedDepartments.length} dept${selectedDepartments.length > 1 ? 's' : ''}`
                          : "Department"
                        }
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search departments..." className="h-8" />
                        <CommandList>
                          <CommandEmpty>No departments found.</CommandEmpty>
                          <CommandGroup>
                            {departments.map((item) => (
                              <CommandItem
                                key={item}
                                onSelect={() => toggleSelection(item, selectedDepartments, setSelectedDepartments)}
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={selectedDepartments.includes(item)}
                                    onChange={() => toggleSelection(item, selectedDepartments, setSelectedDepartments)}
                                  />
                                  <span className="text-xs">{item}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Status Filter - Compact */}
                  <Popover open={statusDropdownOpen} onOpenChange={setStatusDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={statusDropdownOpen}
                        className="w-full justify-between h-8 text-xs"
                      >
                        {selectedStatuses.length > 0 
                          ? `${selectedStatuses.length} status${selectedStatuses.length > 1 ? 'es' : ''}`
                          : "Status"
                        }
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search status..." className="h-8" />
                        <CommandList>
                          <CommandEmpty>No status found.</CommandEmpty>
                          <CommandGroup>
                            {statuses.map((item) => (
                              <CommandItem
                                key={item}
                                onSelect={() => toggleSelection(item, selectedStatuses, setSelectedStatuses)}
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={selectedStatuses.includes(item)}
                                    onChange={() => toggleSelection(item, selectedStatuses, setSelectedStatuses)}
                                  />
                                  <span className="text-xs">{item}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Location Filter - Compact */}
                  <Popover open={locationDropdownOpen} onOpenChange={setLocationDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={locationDropdownOpen}
                        className="w-full justify-between h-8 text-xs"
                      >
                        {selectedLocations.length > 0 
                          ? `${selectedLocations.length} loc${selectedLocations.length > 1 ? 's' : ''}`
                          : "Location"
                        }
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search locations..." className="h-8" />
                        <CommandList>
                          <CommandEmpty>No locations found.</CommandEmpty>
                          <CommandGroup>
                            {locations.map((item) => (
                              <CommandItem
                                key={item}
                                onSelect={() => toggleSelection(item, selectedLocations, setSelectedLocations)}
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={selectedLocations.includes(item)}
                                    onChange={() => toggleSelection(item, selectedLocations, setSelectedLocations)}
                                  />
                                  <span className="text-xs">{item}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Project Filter - Compact */}
                  <Popover open={projectDropdownOpen} onOpenChange={setProjectDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={projectDropdownOpen}
                        className="w-full justify-between h-8 text-xs"
                      >
                        {selectedProjects.length > 0 
                          ? `${selectedProjects.length} proj${selectedProjects.length > 1 ? 's' : ''}`
                          : "Project"
                        }
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search projects..." className="h-8" />
                        <CommandList>
                          <CommandEmpty>No projects found.</CommandEmpty>
                          <CommandGroup>
                            {projects.map((item) => (
                              <CommandItem
                                key={item}
                                onSelect={() => toggleSelection(item, selectedProjects, setSelectedProjects)}
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={selectedProjects.includes(item)}
                                    onChange={() => toggleSelection(item, selectedProjects, setSelectedProjects)}
                                  />
                                  <span className="text-xs">{item}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Role Filter - Compact */}
                  <Popover open={roleDropdownOpen} onOpenChange={setRoleDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={roleDropdownOpen}
                        className="w-full justify-between h-8 text-xs"
                      >
                        {selectedRoles.length > 0 
                          ? `${selectedRoles.length} role${selectedRoles.length > 1 ? 's' : ''}`
                          : "Role"
                        }
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search roles..." className="h-8" />
                        <CommandList>
                          <CommandEmpty>No roles found.</CommandEmpty>
                          <CommandGroup>
                            {roles.map((item) => (
                              <CommandItem
                                key={item}
                                onSelect={() => toggleSelection(item, selectedRoles, setSelectedRoles)}
                              >
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={selectedRoles.includes(item)}
                                    onChange={() => toggleSelection(item, selectedRoles, setSelectedRoles)}
                                  />
                                  <span className="text-xs">{item}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Additional Filters Row - Compact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Hours Range - Compact */}
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Min hours"
                      type="number"
                      min="0"
                      max="168"
                      value={hoursRangeMin}
                      onChange={(e) => setHoursRangeMin(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <span className="text-xs">to</span>
                    <Input
                      placeholder="Max hours"
                      type="number"
                      min="0"
                      max="168"
                      value={hoursRangeMax}
                      onChange={(e) => setHoursRangeMax(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  {/* Group By - Compact */}
                  <Select value={groupBy} onValueChange={setGroupBy}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Group by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No grouping</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                      <SelectItem value="role">Role</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Results Count - Compact */}
                  <div className="h-8 flex items-center text-xs bg-white rounded border px-3">
                    {filteredAndSortedTimesheets.length} timesheets found
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timesheet List/Table with Grouping */}
          {viewMode === "list" ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  {Object.entries(groupedTimesheets).map(([groupName, groupTimesheets]) => (
                    <div key={groupName}>
                      {groupBy !== "none" && (
                        <div className="px-6 py-4 bg-hrms-slate-100 border-b">
                          <h3 className="text-lg font-semibold text-hrms-slate-900 flex items-center gap-2">
                            {groupBy === "employee" && <User className="h-5 w-5" />}
                            {groupBy === "department" && <Building2 className="h-5 w-5" />}
                            {groupBy === "location" && <MapPin className="h-5 w-5" />}
                            {groupBy === "role" && <Users2 className="h-5 w-5" />}
                            {groupBy === "status" && <Activity className="h-5 w-5" />}
                            {groupBy === "project" && <Briefcase className="h-5 w-5" />}
                            {groupName}
                            <Badge variant="secondary" className="ml-2">
                              {groupTimesheets.length} timesheet{groupTimesheets.length !== 1 ? 's' : ''}
                            </Badge>
                          </h3>
                        </div>
                      )}
                      <Table>
                        {groupBy === "none" || Object.keys(groupedTimesheets).indexOf(groupName) === 0 ? (
                          <TableHeader>
                            <TableRow className="bg-hrms-slate-50">
                              <TableHead>
                                <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("employeeName")}>
                                  Employee
                                  <SortIcon field="employeeName" />
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("startDate")}>
                                  Date & Shift
                                  <SortIcon field="startDate" />
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("totalHours")}>
                                  Hours
                                  <SortIcon field="totalHours" />
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("breakHours")}>
                                  Break
                                  <SortIcon field="breakHours" />
                                </Button>
                              </TableHead>
                              <TableHead>
                                <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("status")}>
                                  Status
                                  <SortIcon field="status" />
                                </Button>
                              </TableHead>
                              <TableHead className="w-40">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                        ) : null}
                        <TableBody>
                          {groupTimesheets.map((timesheet) => (
                            <TableRow key={timesheet.id} className="hover:bg-hrms-slate-50">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="relative group">
                                    <Avatar 
                                      className="h-10 w-10 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-400 hover:shadow-lg"
                                      onClick={() => handleViewEmployeePhotos(timesheet.employeeName)}
                                    >
                                      <AvatarImage src={timesheet.employeeAvatar} alt={timesheet.employeeName} />
                                      <AvatarFallback className="bg-hrms-blue-600 text-white text-sm">
                                        {timesheet.employeeName.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <Camera className="h-3 w-3 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-hrms-slate-900">{timesheet.employeeName}</div>
                                    <div className="text-sm text-hrms-slate-500">{timesheet.role}</div>
                                    <div className="text-sm text-hrms-slate-500 flex items-center">
                                      <Building2 className="h-3 w-3 mr-1" />
                                      {timesheet.department}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{new Date(timesheet.startDate).toLocaleDateString()}</div>
                                <div className="text-sm text-hrms-slate-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {timesheet.currentShiftStart && timesheet.currentShiftEnd 
                                    ? `${timesheet.currentShiftStart} - ${timesheet.currentShiftEnd}`
                                    : timesheet.currentShiftStart 
                                      ? `${timesheet.currentShiftStart} - In Progress`
                                      : "Not started"
                                  }
                                </div>
                                {timesheet.status === "Open" && timesheet.currentShiftStart && (
                                  <div className="text-xs text-green-600 mt-1">
                                    {timesheet.currentShiftEnd ? "Completed" : "Active"}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{timesheet.totalHours.toFixed(1)}h</div>
                                <div className="text-sm text-hrms-slate-500">
                                  Regular: {timesheet.regularHours.toFixed(1)}h
                                  {timesheet.overtimeHours > 0 && (
                                    <span className="text-orange-600 ml-2">
                                      OT: {timesheet.overtimeHours.toFixed(1)}h
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium flex items-center">
                                  <Coffee className="h-4 w-4 mr-1 text-hrms-slate-400" />
                                  {(timesheet.breakHours * 60).toFixed(0)} min
                                </div>
                                <div className="text-sm text-hrms-slate-500">
                                  {timesheet.dailyHours.length > 0 && timesheet.dailyHours[0].breakHours > 0 
                                    ? `${Math.ceil((timesheet.breakHours * 60) / 30)} breaks` 
                                    : timesheet.breakHours > 0 
                                      ? `${Math.ceil((timesheet.breakHours * 60) / 30)} breaks`
                                      : "No breaks"
                                  }
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={`border ${getStatusColor(timesheet.status)}`}>
                                  {getStatusIcon(timesheet.status)}
                                  <span className="ml-1">{timesheet.status === "Pending Approval" ? "Pending" : timesheet.status}</span>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-1">
                                  {timesheet.status === "Pending Approval" && (
                                    <>
                                      <Button variant="ghost" size="sm" onClick={() => {
                                        setSelectedTimesheet(timesheet);
                                        setApprovalDialogOpen(true);
                                      }} className="h-8 w-8 p-0 hover:bg-green-50 hover:scale-110 transition-all duration-200" title="Approve Timesheet">
                                        <UserCheck className="h-5 w-5 text-green-600" />
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={() => {
                                        setSelectedTimesheet(timesheet);
                                        setApprovalDialogOpen(true);
                                      }} className="h-8 w-8 p-0 hover:bg-red-50 hover:scale-110 transition-all duration-200" title="Reject Timesheet">
                                        <UserX className="h-5 w-5 text-red-600" />
                                      </Button>
                                    </>
                                  )}
                                  <Button variant="ghost" size="sm" onClick={() => handleEdit(timesheet.id)} className="h-8 w-8 p-0 hover:bg-blue-50 hover:scale-110 transition-all duration-200" title="Edit Timesheet">
                                    <FileEdit className="h-5 w-5 text-blue-600" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDiscard(timesheet.id)} className="h-8 w-8 p-0 hover:bg-red-50 hover:scale-110 transition-all duration-200" title="Archive Timesheet">
                                    <Archive className="h-5 w-5 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            // Grid View with Grouping
            <div className="space-y-6">
              {Object.entries(groupedTimesheets).map(([groupName, groupTimesheets]) => (
                <div key={groupName}>
                  {groupBy !== "none" && (
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-hrms-slate-900 flex items-center gap-2">
                        {groupBy === "employee" && <User className="h-5 w-5" />}
                        {groupBy === "department" && <Building2 className="h-5 w-5" />}
                        {groupBy === "location" && <MapPin className="h-5 w-5" />}
                        {groupBy === "role" && <Users2 className="h-5 w-5" />}
                        {groupBy === "status" && <Activity className="h-5 w-5" />}
                        {groupBy === "project" && <Briefcase className="h-5 w-5" />}
                        {groupName}
                        <Badge variant="secondary" className="ml-2">
                          {groupTimesheets.length} timesheet{groupTimesheets.length !== 1 ? 's' : ''}
                        </Badge>
                      </h3>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupTimesheets.map((timesheet) => (
                      <Card key={timesheet.id} className="hover:shadow-lg transition-all duration-200 border-hrms-slate-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="relative group">
                                <Avatar 
                                  className="h-12 w-12 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-400 hover:shadow-lg"
                                  onClick={() => handleViewEmployeePhotos(timesheet.employeeName)}
                                >
                                  <AvatarImage src={timesheet.employeeAvatar} alt={timesheet.employeeName} />
                                  <AvatarFallback className="bg-hrms-blue-600 text-white">
                                    {timesheet.employeeName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <Camera className="h-3 w-3 text-white" />
                                </div>
                              </div>
                              <div>
                                <CardTitle className="text-lg">{timesheet.employeeName}</CardTitle>
                                <CardDescription>{timesheet.role}</CardDescription>
                              </div>
                            </div>
                            <Badge className={`border ${getStatusColor(timesheet.status)}`}>
                              {getStatusIcon(timesheet.status)}
                              <span className="ml-1">{timesheet.status === "Pending Approval" ? "Pending" : timesheet.status}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-hrms-slate-600">
                            <CalendarDays className="h-4 w-4" />
                            <span>{new Date(timesheet.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-hrms-slate-600">
                            <Clock className="h-4 w-4" />
                            <span>
                              {timesheet.currentShiftStart && timesheet.currentShiftEnd 
                                ? `${timesheet.currentShiftStart} - ${timesheet.currentShiftEnd}`
                                : timesheet.currentShiftStart 
                                  ? `Started at ${timesheet.currentShiftStart}`
                                  : "No shift times"
                              }
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-hrms-slate-600">
                            <Timer className="h-4 w-4" />
                            <span>{timesheet.totalHours.toFixed(1)} hours</span>
                            {timesheet.overtimeHours > 0 && (
                              <span className="text-orange-600">({timesheet.overtimeHours.toFixed(1)}h OT)</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-hrms-slate-600">
                            <Briefcase className="h-4 w-4" />
                            <span>{timesheet.project}</span>
                          </div>
                          
                          <div className="pt-3 border-t border-hrms-slate-200">
                            <div className="flex justify-between text-sm">
                              <span className="text-hrms-slate-500">Department:</span>
                              <span className="font-medium">{timesheet.department}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-hrms-slate-500">Submitted:</span>
                              <span className="font-medium">
                                {timesheet.submittedDate ? new Date(timesheet.submittedDate).toLocaleDateString() : "Not submitted"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 pt-2">
                            {timesheet.status === "Pending Approval" ? (
                              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 transition-all duration-200" onClick={() => {
                                setSelectedTimesheet(timesheet);
                                setApprovalDialogOpen(true);
                              }}>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            ) : null}
                            <Button variant="outline" size="sm" className="flex-1 hover:bg-blue-50 transition-all duration-200" onClick={() => handleEdit(timesheet.id)}>
                              <FileEdit className="h-4 w-4 mr-1" />
                              Edit Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Timesheet Details</DialogTitle>
            <DialogDescription>
              Comprehensive timesheet information for {selectedTimesheet?.employeeName}
            </DialogDescription>
          </DialogHeader>
          {selectedTimesheet && (
            <div className="space-y-6">
              {/* Employee Info */}
              <div className="flex items-center space-x-4 p-4 bg-hrms-slate-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedTimesheet.employeeAvatar} alt={selectedTimesheet.employeeName} />
                  <AvatarFallback className="bg-hrms-blue-600 text-white text-lg">
                    {selectedTimesheet.employeeName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedTimesheet.employeeName}</h3>
                  <p className="text-hrms-slate-600">{selectedTimesheet.role} • {selectedTimesheet.department}</p>
                  <p className="text-sm text-hrms-slate-500">{selectedTimesheet.employeeEmail}</p>
                </div>
                <div className="ml-auto">
                  <Badge className={`border ${getStatusColor(selectedTimesheet.status)}`}>
                    {getStatusIcon(selectedTimesheet.status)}
                    <span className="ml-1">{selectedTimesheet.status}</span>
                  </Badge>
                </div>
              </div>

              {/* Summary Info */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{selectedTimesheet.totalHours.toFixed(1)}</p>
                  <p className="text-sm text-blue-600">Total Hours</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{selectedTimesheet.regularHours.toFixed(1)}</p>
                  <p className="text-sm text-green-600">Regular Hours</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-700">{selectedTimesheet.overtimeHours.toFixed(1)}</p>
                  <p className="text-sm text-orange-600">Overtime Hours</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700">{selectedTimesheet.dailyHours.length}</p>
                  <p className="text-sm text-purple-600">Work Days</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-700">{(selectedTimesheet.breakHours * 60).toFixed(0)} min</p>
                  <p className="text-sm text-emerald-600">Break Minutes</p>
                </div>
              </div>

              {/* Daily Hours Breakdown */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Daily Hours Breakdown</h4>
                <div className="space-y-2">
                  {selectedTimesheet.dailyHours.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-hrms-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                        <p className="text-sm text-hrms-slate-600">{day.project}</p>
                        <p className="text-sm text-hrms-slate-500">{day.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{day.hours.toFixed(1)}h</p>
                        <div className="text-sm text-hrms-slate-500 flex items-center justify-end">
                          <Coffee className="h-3 w-3 mr-1" />
                          {(day.breakHours * 60).toFixed(0)} min break
                        </div>
                        {day.startTime && day.endTime && (
                          <div className="text-xs text-hrms-slate-400">
                            {day.startTime} - {day.endTime}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {selectedTimesheet.dailyHours.length === 0 && (
                    <p className="text-center text-hrms-slate-500 py-8">No daily hours recorded</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedTimesheet.notes && (
                <div>
                  <h4 className="text-lg font-semibold mb-2">Notes</h4>
                  <p className="text-hrms-slate-700 p-3 bg-hrms-slate-50 rounded-lg">{selectedTimesheet.notes}</p>
                </div>
              )}

              {/* Approval/Rejection Info */}
              {(selectedTimesheet.approvedBy || selectedTimesheet.rejectedBy) && (
                <div className="p-4 border rounded-lg">
                  {selectedTimesheet.approvedBy && (
                    <div className="text-green-700">
                      <p className="font-medium">Approved by {selectedTimesheet.approvedBy}</p>
                      <p className="text-sm">on {selectedTimesheet.approvedDate && new Date(selectedTimesheet.approvedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedTimesheet.rejectedBy && (
                    <div className="text-red-700">
                      <p className="font-medium">Rejected by {selectedTimesheet.rejectedBy}</p>
                      <p className="text-sm">on {selectedTimesheet.rejectedDate && new Date(selectedTimesheet.rejectedDate).toLocaleDateString()}</p>
                      {selectedTimesheet.rejectionReason && (
                        <p className="text-sm mt-2 p-2 bg-red-50 rounded">
                          <strong>Reason:</strong> {selectedTimesheet.rejectionReason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timesheet Action</DialogTitle>
            <DialogDescription>
              Choose an action for {selectedTimesheet?.employeeName}'s timesheet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="h-16 flex flex-col gap-2 bg-green-600 hover:bg-green-700 transition-all duration-200"
                onClick={() => selectedTimesheet && handleApprove(selectedTimesheet.id)}
              >
                <UserCheck className="h-6 w-6" />
                <span>Approve</span>
              </Button>
              <Button 
                variant="outline"
                className="h-16 flex flex-col gap-2 border-red-200 text-red-700 hover:bg-red-50 transition-all duration-200"
                onClick={() => {
                  // Show rejection reason input
                }}
              >
                <UserX className="h-6 w-6" />
                <span>Reject</span>
              </Button>
            </div>
            
            {/* Rejection Reason */}
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason (optional)</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Provide feedback for the employee..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => selectedTimesheet && handleReject(selectedTimesheet.id, rejectionReason)}
                disabled={!rejectionReason.trim()}
              >
                Reject with Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advanced Filters Dialog */}
      <Dialog open={filtersDialogOpen} onOpenChange={setFiltersDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Advanced Filters
            </DialogTitle>
            <DialogDescription>
              Apply comprehensive filters to find specific timesheets
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Category Filters */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-hrms-slate-700">Filter by Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MultiSelectDropdown
                  items={departments}
                  selectedItems={selectedDepartments}
                  setSelectedItems={setSelectedDepartments}
                  placeholder="Select departments"
                  isOpen={departmentDropdownOpen}
                  setIsOpen={setDepartmentDropdownOpen}
                  label="Department"
                />

                <MultiSelectDropdown
                  items={statuses}
                  selectedItems={selectedStatuses}
                  setSelectedItems={setSelectedStatuses}
                  placeholder="Select statuses"
                  isOpen={statusDropdownOpen}
                  setIsOpen={setStatusDropdownOpen}
                  label="Status"
                />

                <MultiSelectDropdown
                  items={locations}
                  selectedItems={selectedLocations}
                  setSelectedItems={setSelectedLocations}
                  placeholder="Select locations"
                  isOpen={locationDropdownOpen}
                  setIsOpen={setLocationDropdownOpen}
                  label="Location"
                />

                <MultiSelectDropdown
                  items={projects}
                  selectedItems={selectedProjects}
                  setSelectedItems={setSelectedProjects}
                  placeholder="Select projects"
                  isOpen={projectDropdownOpen}
                  setIsOpen={setProjectDropdownOpen}
                  label="Project"
                />

                <MultiSelectDropdown
                  items={roles}
                  selectedItems={selectedRoles}
                  setSelectedItems={setSelectedRoles}
                  placeholder="Select roles"
                  isOpen={roleDropdownOpen}
                  setIsOpen={setRoleDropdownOpen}
                  label="Role"
                />
              </div>
            </div>

            {/* Range Filters */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-hrms-slate-700">Filter by Range</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hours Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Hours Range
                  </Label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Min hours"
                        type="number"
                        min="0"
                        max="168"
                        value={hoursRangeMin}
                        onChange={(e) => setHoursRangeMin(e.target.value)}
                      />
                    </div>
                    <span className="text-sm text-hrms-slate-500 font-medium">to</span>
                    <div className="flex-1">
                      <Input
                        placeholder="Max hours"
                        type="number"
                        min="0"
                        max="168"
                        value={hoursRangeMax}
                        onChange={(e) => setHoursRangeMax(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Date Range */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" />
                    Custom Date Range
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {dateRange.from && dateRange.to && 
                         (dateRange.from.getTime() !== currentPayPeriod.start.getTime() || 
                          dateRange.to.getTime() !== currentPayPeriod.end.getTime()) ? (
                          <>
                            {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                          </>
                        ) : (
                          <span className="text-hrms-slate-500">Select custom date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range) => setDateRange({ 
                          from: range?.from, 
                          to: range?.to 
                        })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Applied Filters Summary */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-hrms-slate-700">Active Filters Summary</h4>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex flex-wrap gap-2">
                  {selectedDepartments.length > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Building2 className="h-3 w-3 mr-1" />
                      Departments: {selectedDepartments.length}
                    </Badge>
                  )}
                  {selectedStatuses.length > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Activity className="h-3 w-3 mr-1" />
                      Status: {selectedStatuses.length}
                    </Badge>
                  )}
                  {selectedLocations.length > 0 && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <MapPin className="h-3 w-3 mr-1" />
                      Locations: {selectedLocations.length}
                    </Badge>
                  )}
                  {selectedProjects.length > 0 && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      <Briefcase className="h-3 w-3 mr-1" />
                      Projects: {selectedProjects.length}
                    </Badge>
                  )}
                  {selectedRoles.length > 0 && (
                    <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                      <Users2 className="h-3 w-3 mr-1" />
                      Roles: {selectedRoles.length}
                    </Badge>
                  )}
                  {(hoursRangeMin || hoursRangeMax) && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Timer className="h-3 w-3 mr-1" />
                      Hours: {hoursRangeMin || "0"}-{hoursRangeMax || "∞"}
                    </Badge>
                  )}
                  {(dateRange.from || dateRange.to) && (
                    <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                      <CalendarRange className="h-3 w-3 mr-1" />
                      Date Range
                    </Badge>
                  )}
                  {selectedDepartments.length === 0 && selectedStatuses.length === 0 && selectedLocations.length === 0 && 
                   selectedProjects.length === 0 && selectedRoles.length === 0 && !hoursRangeMin && !hoursRangeMax && 
                   !dateRange.from && !dateRange.to && (
                    <span className="text-sm text-hrms-slate-500 italic">No filters applied</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={() => setFiltersDialogOpen(false)} className="flex-1 bg-hrms-blue-600 hover:bg-hrms-blue-700">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Apply Filters ({filteredAndSortedTimesheets.length} results)
              </Button>
              <Button variant="outline" onClick={clearAllFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advanced Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Advanced Export Options</DialogTitle>
            <DialogDescription>
              Customize your timesheet export with filters and column selection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Export Format Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                  <SelectItem value="xlsx">Excel Spreadsheet (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Column Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Columns to Export</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {availableColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.key}
                      checked={selectedColumns.includes(column.key)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedColumns(prev => [...prev, column.key]);
                        } else {
                          setSelectedColumns(prev => prev.filter(col => col !== column.key));
                        }
                      }}
                    />
                    <Label htmlFor={column.key} className="text-sm cursor-pointer">
                      {column.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedColumns(availableColumns.map(col => col.key))}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedColumns([])}
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Applied Filters Summary */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Applied Filters (will be included in export)</Label>
              <div className="bg-hrms-slate-50 rounded-lg p-3 space-y-2">
                {searchTerm && (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Search: "{searchTerm}"</span>
                  </div>
                )}
                {selectedDepartments.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">Departments: {selectedDepartments.join(", ")}</span>
                  </div>
                )}
                {selectedStatuses.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">Status: {selectedStatuses.join(", ")}</span>
                  </div>
                )}
                {selectedProjects.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">Projects: {selectedProjects.join(", ")}</span>
                  </div>
                )}
                {(hoursRangeMin || hoursRangeMax) && (
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    <span className="text-sm">
                      Hours: {hoursRangeMin || "0"} - {hoursRangeMax || "∞"}
                    </span>
                  </div>
                )}
                {(dateRange.from || dateRange.to) && (
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" />
                    <span className="text-sm">
                      Date: {dateRange.from?.toLocaleDateString() || "Start"} to {dateRange.to?.toLocaleDateString() || "End"}
                    </span>
                  </div>
                )}
                {!searchTerm && selectedDepartments.length === 0 && selectedStatuses.length === 0 && 
                 selectedProjects.length === 0 && !hoursRangeMin && !hoursRangeMax && 
                 !dateRange.from && !dateRange.to && (
                  <div className="text-sm text-hrms-slate-500">No filters applied - exporting all data</div>
                )}
              </div>
            </div>

            {/* Export Summary */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Export Summary</span>
              </div>
              <div className="text-sm text-blue-700">
                Exporting {filteredAndSortedTimesheets.length} timesheet records with {selectedColumns.length} columns as {exportFormat.toUpperCase()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleExport}
                disabled={selectedColumns.length === 0}
                className="flex-1 bg-hrms-blue-600 hover:bg-hrms-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export {filteredAndSortedTimesheets.length} Records
              </Button>
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comprehensive Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTimesheet?.employeeName ? (
                <>
                  <Edit className="h-5 w-5" />
                  Edit Timesheet Details
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add Timesheet
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedTimesheet?.employeeName ? 
                `Comprehensive editing for ${selectedTimesheet.employeeName}'s timesheet` :
                `Create new timesheet - Select employee and fill details`
              }
            </DialogDescription>
          </DialogHeader>

          {selectedTimesheet && (
            <div className="space-y-6">
              {/* Employee Info Banner / Selector */}
              {selectedTimesheet.employeeName ? (
                // Existing employee - show info banner
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedTimesheet.employeeAvatar} alt={selectedTimesheet.employeeName} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {selectedTimesheet.employeeName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">{selectedTimesheet.employeeName}</h3>
                    <p className="text-blue-700">{selectedTimesheet.role} • {selectedTimesheet.department}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge className={`border ${getStatusColor(selectedTimesheet.status)}`}>
                      {getStatusIcon(selectedTimesheet.status)}
                      <span className="ml-1">{selectedTimesheet.status}</span>
                    </Badge>
                  </div>
                </div>
              ) : (
                // New timesheet - show employee selector
                <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                      <User className="h-5 w-5" />
                      Select Employee for New Timesheet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Enhanced Employee Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-blue-900">Employee Selection *</Label>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={`w-full justify-between h-12 text-left ${
                                editForm.employeeName ? 'bg-green-50 border-green-200' : 'border-dashed border-blue-300'
                              }`}
                            >
                              {editForm.employeeName ? (
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-green-600 text-white text-xs">
                                      {editForm.employeeName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-green-900">{editForm.employeeName}</div>
                                    <div className="text-xs text-green-700">{editForm.role} • {editForm.department}</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-blue-600">
                                  <User className="h-5 w-5" />
                                  <span>Select an employee...</span>
                                </div>
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search employees..." className="h-10" />
                              <CommandList className="max-h-64">
                                <CommandEmpty>No employees found.</CommandEmpty>
                                <CommandGroup>
                                  {employeesWithTimesheets.map((employee) => (
                                    <CommandItem
                                      key={employee.name}
                                      onSelect={() => {
                                        setEditForm(prev => ({
                                          ...prev,
                                          employeeName: employee.name,
                                          employeeEmail: employee.email,
                                          role: employee.role,
                                          department: employee.department,
                                          location: employee.location
                                        }));
                                      }}
                                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50"
                                    >
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src={employee.avatar} />
                                        <AvatarFallback className="bg-blue-600 text-white">
                                          {employee.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="font-medium">{employee.name}</div>
                                        <div className="text-sm text-gray-500">{employee.role} • {employee.department}</div>
                                        <div className="text-xs text-gray-400">{employee.email}</div>
                                      </div>
                                      <div className="text-xs text-blue-600 font-medium">
                                        {employee.totalHours.toFixed(1)}h
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Employee Details Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                      
                      <div className="space-y-2">
                        <Label htmlFor="employee-email">Email Address</Label>
                        <Input
                          id="employee-email"
                          value={editForm.employeeEmail}
                          onChange={(e) => setEditForm(prev => ({ ...prev, employeeEmail: e.target.value }))}
                          placeholder="employee@company.com"
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="employee-name-manual">Full Name (Manual Entry)</Label>
                        <Input
                          id="employee-name-manual"
                          value={editForm.employeeName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, employeeName: e.target.value }))}
                          placeholder="Enter employee name manually"
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employee-role">Role</Label>
                        <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger className="bg-gray-50">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center gap-2">
                                  {role === "HR Specialist" && <User className="h-4 w-4" />}
                                  {role === "UX Designer" && <Briefcase className="h-4 w-4" />}
                                  {role === "Sales Manager" && <TrendingUp className="h-4 w-4" />}
                                  {role === "Marketing Director" && <Users2 className="h-4 w-4" />}
                                  {role === "Data Scientist" && <Activity className="h-4 w-4" />}
                                  {role === "Senior Developer" && <Building2 className="h-4 w-4" />}
                                  {role === "DevOps Engineer" && <Settings className="h-4 w-4" />}
                                  {role === "Operations Manager" && <MapPin className="h-4 w-4" />}
                                  {!["HR Specialist", "UX Designer", "Sales Manager", "Marketing Director", "Data Scientist", "Senior Developer", "DevOps Engineer", "Operations Manager"].includes(role) && <User className="h-4 w-4" />}
                                  {role}
                                </div>
                              </SelectItem>
                            ))}
                            {/* Additional common roles */}
                            <SelectItem value="Manager">
                              <div className="flex items-center gap-2">
                                <Users2 className="h-4 w-4" />
                                Manager
                              </div>
                            </SelectItem>
                            <SelectItem value="Developer">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Developer
                              </div>
                            </SelectItem>
                            <SelectItem value="Analyst">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Analyst
                              </div>
                            </SelectItem>
                            <SelectItem value="Coordinator">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Coordinator
                              </div>
                            </SelectItem>
                            <SelectItem value="Specialist">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Specialist
                              </div>
                            </SelectItem>
                            <SelectItem value="Intern">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Intern
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="employee-department">Department</Label>
                        <Select value={editForm.department} onValueChange={(value) => setEditForm(prev => ({ ...prev, department: value }))}>
                          <SelectTrigger className="bg-gray-50">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  {dept}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="employee-location">Location</Label>
                        <Select value={editForm.location} onValueChange={(value) => setEditForm(prev => ({ ...prev, location: value }))}>
                          <SelectTrigger className="bg-gray-50">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {loc}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {editForm.employeeName && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-800 font-medium">
                            Selected: {editForm.employeeName} ({editForm.role})
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Basic Timesheet Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date and Time Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-date">Work Date</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="edit-start-time">Start Time</Label>
                        <Input
                          id="edit-start-time"
                          type="time"
                          value={editForm.startTime}
                          onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-end-time">End Time</Label>
                        <Input
                          id="edit-end-time"
                          type="time"
                          value={editForm.endTime}
                          onChange={(e) => setEditForm(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-total-hours">Total Hours</Label>
                      <Input
                        id="edit-total-hours"
                        type="number"
                        step="0.25"
                        min="0"
                        max="24"
                        value={editForm.totalHours}
                        onChange={(e) => setEditForm(prev => ({ ...prev, totalHours: parseFloat(e.target.value) || 0 }))}
                      />
                      <p className="text-xs text-gray-500">
                        Regular: {editForm.totalHours > 8 ? 8 : editForm.totalHours}h
                        {editForm.totalHours > 8 && (
                          <span className="text-orange-600 ml-2">
                            Overtime: {(editForm.totalHours - 8).toFixed(2)}h
                          </span>
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Project & Description Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Project & Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-project">Project</Label>
                      <Input
                        id="edit-project"
                        value={editForm.project}
                        onChange={(e) => setEditForm(prev => ({ ...prev, project: e.target.value }))}
                        placeholder="Enter project name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Work Description</Label>
                      <Textarea
                        id="edit-description"
                        rows={3}
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the work performed..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Status Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Status & Approval
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Timesheet Status</Label>
                      <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Draft
                            </div>
                          </SelectItem>
                          <SelectItem value="Open">
                            <div className="flex items-center gap-2">
                              <Play className="h-4 w-4" />
                              Open
                            </div>
                          </SelectItem>
                          <SelectItem value="Pending Approval">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Pending Approval
                            </div>
                          </SelectItem>
                          <SelectItem value="Approved">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Approved
                            </div>
                          </SelectItem>
                          <SelectItem value="Rejected">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              Rejected
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Current Status:</p>
                      <Badge className={`border ${getStatusColor(selectedTimesheet.status)}`}>
                        {getStatusIcon(selectedTimesheet.status)}
                        <span className="ml-1">{selectedTimesheet.status}</span>
                      </Badge>
                    </div>

                    {editForm.status !== selectedTimesheet.status && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700">
                          Status will change from <strong>{selectedTimesheet.status}</strong> to <strong>{editForm.status}</strong>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Individual Break Management Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Individual Break Management
                    <Badge variant="secondary" className="ml-2">
                      {editForm.breaks.length} {editForm.breaks.length === 1 ? 'break' : 'breaks'}
                    </Badge>
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Total: {(editForm.breaks.reduce((sum, br) => sum + br.duration, 0)).toFixed(0)} min)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editForm.breaks.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <Coffee className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm">No breaks added yet</p>
                      <p className="text-gray-400 text-xs">Click "Add Break" to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editForm.breaks.map((breakItem, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Coffee className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Break #{index + 1}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBreak(index)}
                              className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Break Name</Label>
                              <Input
                                placeholder="e.g., Lunch, Coffee Break"
                                value={breakItem.name}
                                onChange={(e) => updateBreak(index, "name", e.target.value)}
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Duration (minutes)</Label>
                              <Input
                                type="number"
                                step="5"
                                min="0"
                                max="480"
                                placeholder="30"
                                value={breakItem.duration}
                                onChange={(e) => updateBreak(index, "duration", parseFloat(e.target.value) || 0)}
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addBreak}
                    className="w-full border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Break
                  </Button>

                  {editForm.breaks.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700 font-medium">Break Summary:</span>
                        <div className="text-right">
                          <div className="text-blue-900 font-semibold">
                            {editForm.breaks.length} breaks • {(editForm.breaks.reduce((sum, br) => sum + br.duration, 0)).toFixed(0)} minutes total
                          </div>
                          <div className="text-blue-600 text-xs">
                            {editForm.breaks.map(br => br.name || 'Unnamed').join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Notes Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="edit-notes">Notes & Comments</Label>
                    <Textarea
                      id="edit-notes"
                      rows={4}
                      value={editForm.notes}
                      onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any additional notes, comments, or explanations..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Summary Information */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg border">
                  <p className="text-xl font-bold text-blue-700">{editForm.totalHours.toFixed(2)}h</p>
                  <p className="text-xs text-blue-600">Total Hours</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border">
                  <p className="text-xl font-bold text-green-700">
                    {(editForm.totalHours > 8 ? 8 : editForm.totalHours).toFixed(2)}h
                  </p>
                  <p className="text-xs text-green-600">Regular Hours</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg border">
                  <p className="text-xl font-bold text-orange-700">
                    {(editForm.totalHours > 8 ? editForm.totalHours - 8 : 0).toFixed(2)}h
                  </p>
                  <p className="text-xs text-orange-600">Overtime Hours</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border">
                  <p className="text-xl font-bold text-purple-700">
                    {editForm.breaks.length}
                  </p>
                  <p className="text-xs text-purple-600">Total Breaks</p>
                </div>
                <div className="text-center p-3 bg-teal-50 rounded-lg border">
                  <p className="text-xl font-bold text-teal-700">
                    {(editForm.breaks.reduce((sum, br) => sum + br.duration, 0)).toFixed(0)} min
                  </p>
                  <p className="text-xs text-teal-600">Break Minutes</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Organization Settings Dialog */}
      <Dialog open={organizationSettingsOpen} onOpenChange={setOrganizationSettingsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Organization & Location Settings
            </DialogTitle>
            <DialogDescription>
              Configure your organization's pay period settings, locations, and timesheet policies
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Organization Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={organizationSettings.companyName}
                      onChange={(e) => setOrganizationSettings(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <Select 
                      value={organizationSettings.timeZone} 
                      onValueChange={(value) => setOrganizationSettings(prev => ({ ...prev, timeZone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
                    <Select 
                      value={organizationSettings.fiscalYearStart} 
                      onValueChange={(value) => setOrganizationSettings(prev => ({ ...prev, fiscalYearStart: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fiscal year start" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="February">February</SelectItem>
                        <SelectItem value="March">March</SelectItem>
                        <SelectItem value="April">April</SelectItem>
                        <SelectItem value="May">May</SelectItem>
                        <SelectItem value="June">June</SelectItem>
                        <SelectItem value="July">July</SelectItem>
                        <SelectItem value="August">August</SelectItem>
                        <SelectItem value="September">September</SelectItem>
                        <SelectItem value="October">October</SelectItem>
                        <SelectItem value="November">November</SelectItem>
                        <SelectItem value="December">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={organizationSettings.currency} 
                      onValueChange={(value) => setOrganizationSettings(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pay Period Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarRange className="h-5 w-5" />
                  Pay Period Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Pay Period Type</Label>
                    <Select 
                      value={payPeriodSettingsState.type} 
                      onValueChange={(value: any) => {
                        console.log("Pay period type changed to:", value);
                        const newSettings = { ...payPeriodSettingsState, type: value };
                        setPayPeriodSettings(newSettings);
                        // Save to localStorage
                        localStorage.setItem('payPeriodSettings', JSON.stringify(newSettings));
                        // Recalculate current period when type changes
                        const newPeriod = getCurrentPayPeriod(newSettings);
                        setCurrentPayPeriod(newPeriod);
                        setDateRange({ from: newPeriod.start, to: newPeriod.end });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="semimonthly">Semi-monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pay Period Start Date</Label>
                    <Input
                      type="date"
                      value={payPeriodSettingsState.customStartDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        console.log("Custom start date selected:", selectedDate);
                        
                        const newSettings = { ...payPeriodSettingsState, customStartDate: e.target.value };
                        setPayPeriodSettings(newSettings);
                        // Save to localStorage
                        localStorage.setItem('payPeriodSettings', JSON.stringify(newSettings));
                        
                        // Calculate new period based on selected start date
                        const newPeriod = calculatePayPeriod(selectedDate, newSettings, 0);
                        setCurrentPayPeriod(newPeriod);
                        setDateRange({ from: newPeriod.start, to: newPeriod.end });
                        
                        toast.success(`Pay period updated to start from ${selectedDate.toLocaleDateString()}`);
                      }}
                      className="bg-white"
                    />
                    <p className="text-xs text-gray-500">Select the date to start the pay period calculation</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Period</Label>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-900">{currentPayPeriod.label}</div>
                      <div className="text-xs text-blue-700 mt-1">
                        {currentPayPeriod.start.toLocaleDateString()} - {currentPayPeriod.end.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {Math.ceil((currentPayPeriod.end.getTime() - currentPayPeriod.start.getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pay Period Preview */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Pay Period Preview (Next 3 Periods)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[0, 1, 2].map((offset) => {
                      const period = calculatePayPeriod(
                        payPeriodSettingsState.customStartDate 
                          ? new Date(payPeriodSettingsState.customStartDate) 
                          : currentPayPeriod.start, 
                        payPeriodSettingsState, 
                        offset
                      );
                      return (
                        <div key={offset} className={`p-3 rounded-lg border ${
                          offset === 0 
                            ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className={`text-sm font-medium ${
                            offset === 0 ? 'text-blue-900' : 'text-gray-700'
                          }`}>
                            {offset === 0 ? 'Current' : `Period ${offset + 1}`}
                          </div>
                          <div className={`text-xs ${
                            offset === 0 ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            {period.start.toLocaleDateString()} - {period.end.toLocaleDateString()}
                          </div>
                          <div className={`text-xs mt-1 ${
                            offset === 0 ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {period.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Location</Label>
                    <Select 
                      value={organizationSettings.defaultLocation} 
                      onValueChange={(value) => setOrganizationSettings(prev => ({ ...prev, defaultLocation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locationSettings.locations.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Locations Available</Label>
                    <div className="p-2 border rounded-md bg-gray-50 max-h-24 overflow-y-auto">
                      <div className="flex flex-wrap gap-1">
                        {locationSettings.locations.map((location, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Location settings affect timesheet filtering and reporting. 
                    Changes will apply to new timesheets immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Work Rules & Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Work Rules & Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Default Work Hours</Label>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={locationSettings.defaultWorkHours}
                      onChange={(e) => setLocationSettings(prev => ({ ...prev, defaultWorkHours: parseInt(e.target.value) || 8 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Overtime Threshold (hours)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={locationSettings.overtimeThreshold}
                      onChange={(e) => setLocationSettings(prev => ({ ...prev, overtimeThreshold: parseInt(e.target.value) || 40 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Break Duration (minutes)</Label>
                    <Input
                      type="number"
                      step="5"
                      min="0"
                      max="120"
                      value={locationSettings.minimumBreakDuration}
                      onChange={(e) => setLocationSettings(prev => ({ ...prev, minimumBreakDuration: parseFloat(e.target.value) || 30 }))}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breakPolicy"
                    checked={locationSettings.breakPolicyEnabled}
                    onCheckedChange={(checked) => setLocationSettings(prev => ({ ...prev, breakPolicyEnabled: !!checked }))}
                  />
                  <Label htmlFor="breakPolicy" className="text-sm">
                    Enforce break policy compliance
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Current Statistics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Current Period Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{stats.current.total}</div>
                    <div className="text-sm text-blue-600">Total Timesheets</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">{stats.current.totalHours.toFixed(0)}</div>
                    <div className="text-sm text-purple-600">Total Hours</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">{stats.current.overtimeHours.toFixed(0)}</div>
                    <div className="text-sm text-orange-600">Overtime Hours</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{employeesWithTimesheets.length}</div>
                    <div className="text-sm text-green-600">Active Employees</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOrganizationSettingsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                console.log("Organization settings saved:", { organizationSettings, locationSettings, payPeriodSettings: payPeriodSettingsState });
                // Save to localStorage
                localStorage.setItem('payPeriodSettings', JSON.stringify(payPeriodSettingsState));
                localStorage.setItem('organizationSettings', JSON.stringify(organizationSettings));
                localStorage.setItem('locationSettings', JSON.stringify(locationSettings));
                // Recalculate current period with saved settings to ensure UI reflects changes
                const newPeriod = getCurrentPayPeriod(payPeriodSettingsState);
                setCurrentPayPeriod(newPeriod);
                setDateRange({ from: newPeriod.start, to: newPeriod.end });
                toast.success("Organization settings saved successfully!");
                setOrganizationSettingsOpen(false);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Verification Modal */}
      <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photo Verification - {selectedEmployeePhotos?.employeeName}
            </DialogTitle>
            <DialogDescription>
              Clock in/out and break verification photos for timesheet validation
            </DialogDescription>
          </DialogHeader>

          {selectedEmployeePhotos && (
            <div className="space-y-6">
              {/* Employee Header */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={selectedEmployeePhotos.employeeName} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {selectedEmployeePhotos.employeeName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <Camera className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">{selectedEmployeePhotos.employeeName}</h3>
                  <p className="text-sm text-blue-700">Photo verification records</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>

              {/* Photo Categories */}
              <div className="space-y-6">
                {/* Clock In Photos */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Clock In Photos</h4>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      {selectedEmployeePhotos.photos.clockIn.length} photos
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedEmployeePhotos.photos.clockIn.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-green-400 transition-all duration-200">
                          <img
                            src={photo.image}
                            alt={`Clock in ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                        </div>
                        <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-green-700 font-medium">
                              <Clock className="h-4 w-4" />
                              {photo.timestamp}
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              Clock In
                            </Badge>
                          </div>
                          {photo.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <LocationIcon className="h-3 w-3" />
                              {photo.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Break Photos */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Coffee className="h-5 w-5 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Break Photos</h4>
                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                      {selectedEmployeePhotos.photos.breaks.length} photos
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedEmployeePhotos.photos.breaks.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-orange-400 transition-all duration-200">
                          <img
                            src={photo.image}
                            alt={`Break ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                        </div>
                        <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center gap-2 text-orange-700 font-medium">
                              <Coffee className="h-4 w-4" />
                              {photo.timestamp}
                            </div>
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                              {photo.type}
                            </Badge>
                          </div>
                          {photo.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <LocationIcon className="h-3 w-3" />
                              {photo.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clock Out Photos */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-red-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Clock Out Photos</h4>
                    <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                      {selectedEmployeePhotos.photos.clockOut.length} photos
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedEmployeePhotos.photos.clockOut.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-red-400 transition-all duration-200">
                          <img
                            src={photo.image}
                            alt={`Clock out ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                        </div>
                        <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-red-700 font-medium">
                              <Clock className="h-4 w-4" />
                              {photo.timestamp}
                            </div>
                            <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                              Clock Out
                            </Badge>
                          </div>
                          {photo.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <LocationIcon className="h-3 w-3" />
                              {photo.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Photo Summary</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Total: {selectedEmployeePhotos.photos.clockIn.length + selectedEmployeePhotos.photos.clockOut.length + selectedEmployeePhotos.photos.breaks.length} photos
                    </div>
                    <div className="text-xs text-gray-500">
                      Clock In: {selectedEmployeePhotos.photos.clockIn.length} • 
                      Breaks: {selectedEmployeePhotos.photos.breaks.length} • 
                      Clock Out: {selectedEmployeePhotos.photos.clockOut.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => setPhotoModalOpen(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Photos Verified
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log("Flagging photos for review");
                    setPhotoModalOpen(false);
                  }}
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Flag for Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

          {Object.keys(groupedTimesheets).length === 0 || (Object.keys(groupedTimesheets).length === 1 && groupedTimesheets["All Timesheets"]?.length === 0) ? (
            <Card className="text-center p-8">
              <Clock className="h-12 w-12 mx-auto text-hrms-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-hrms-slate-900 mb-2">
                No timesheets found
              </h3>
              <p className="text-hrms-slate-600">
                Try adjusting your search terms or filters
              </p>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}