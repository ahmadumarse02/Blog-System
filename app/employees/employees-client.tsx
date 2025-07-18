"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
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
  Calendar,
  Users,
  Building2,
  Edit,
  Trash2,
  Eye,
  FileText,
  X,
  SlidersHorizontal
} from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  phone: string;
  status: string;
  avatar?: string;
  joinDate: string;
  employeeId?: string;
  salary?: number;
  manager?: string;
  skills?: string[];
  notes?: string;
}

interface EmployeesClientProps {
  initialEmployees: Employee[];
  currentUser: any;
}

export default function EmployeesClient({ initialEmployees, currentUser }: EmployeesClientProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Employee>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  console.log("EmployeesClient initialized with employees:", employees.length);

  // Get unique values for filters
  const departments = useMemo(() => Array.from(new Set(employees.map(emp => emp.department))), [employees]);
  const statuses = useMemo(() => Array.from(new Set(employees.map(emp => emp.status))), [employees]);
  const locations = useMemo(() => Array.from(new Set(employees.map(emp => emp.location))), [employees]);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = searchTerm === "" || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(employee.department);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(employee.status);
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(employee.location);

      return matchesSearch && matchesDepartment && matchesStatus && matchesLocation;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, searchTerm, selectedDepartments, selectedStatuses, selectedLocations, sortField, sortDirection]);

  const handleSort = (field: keyof Employee) => {
    console.log("Sorting by field:", field);
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectEmployee = (id: number) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredAndSortedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredAndSortedEmployees.map(emp => emp.id));
    }
  };

  const handleExport = (format: "csv" | "xlsx" | "pdf") => {
    console.log("Exporting employees in format:", format);
    const exportData = selectedEmployees.length > 0 
      ? employees.filter(emp => selectedEmployees.includes(emp.id))
      : filteredAndSortedEmployees;

    if (format === "csv") {
      const csvContent = [
        ["Name", "Email", "Role", "Department", "Location", "Status", "Join Date", "Phone"].join(","),
        ...exportData.map(emp => [
          emp.name,
          emp.email,
          emp.role,
          emp.department,
          emp.location,
          emp.status,
          emp.joinDate,
          emp.phone
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast.success(`Exported ${exportData.length} employees as ${format.toUpperCase()}`);
    setExportDialogOpen(false);
  };

  const handleImport = () => {
    // Mock import functionality
    const mockNewEmployees = [
      {
        id: Date.now(),
        name: "Alice Brown",
        email: "alice.brown@company.com",
        role: "UX Designer",
        department: "Design",
        location: "Remote",
        phone: "+1 (555) 987-6543",
        status: "Active",
        joinDate: new Date().toISOString().split('T')[0]
      }
    ];

    setEmployees(prev => [...prev, ...mockNewEmployees]);
    toast.success(`Imported ${mockNewEmployees.length} new employees`);
    setImportDialogOpen(false);
  };

  const handleBulkAction = (action: string) => {
    console.log("Performing bulk action:", action, "on employees:", selectedEmployees);
    
    if (action === "activate") {
      setEmployees(prev => prev.map(emp => 
        selectedEmployees.includes(emp.id) ? { ...emp, status: "Active" } : emp
      ));
      toast.success(`Activated ${selectedEmployees.length} employees`);
    } else if (action === "deactivate") {
      setEmployees(prev => prev.map(emp => 
        selectedEmployees.includes(emp.id) ? { ...emp, status: "Inactive" } : emp
      ));
      toast.success(`Deactivated ${selectedEmployees.length} employees`);
    } else if (action === "delete") {
      setEmployees(prev => prev.filter(emp => !selectedEmployees.includes(emp.id)));
      toast.success(`Deleted ${selectedEmployees.length} employees`);
    }

    setSelectedEmployees([]);
    setBulkActionOpen(false);
  };

  const SortIcon = ({ field }: { field: keyof Employee }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />;
  };

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(emp => emp.status === "Active").length,
    inactive: employees.filter(emp => emp.status !== "Active").length,
    departments: departments.length,
    newThisMonth: employees.filter(emp => {
      const joinDate = new Date(emp.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length
  }), [employees, departments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-hrms-slate-900">Employee Management</h1>
          <p className="text-hrms-slate-600 mt-1">
            Comprehensive workforce management with advanced tools
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
            {viewMode === "list" ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>

          <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-hrms-blue-600 hover:bg-hrms-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Create a new employee record with comprehensive information
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Enter role" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAddEmployeeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success("Employee added successfully!");
                  setAddEmployeeOpen(false);
                }}>
                  Add Employee
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-blue-700">{stats.total}</CardTitle>
            <CardDescription className="text-blue-600">Total Employees</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-700">{stats.active}</CardTitle>
            <CardDescription className="text-green-600">Active</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-orange-700">{stats.inactive}</CardTitle>
            <CardDescription className="text-orange-600">Inactive</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-purple-700">{stats.departments}</CardTitle>
            <CardDescription className="text-purple-600">Departments</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-teal-700">{stats.newThisMonth}</CardTitle>
            <CardDescription className="text-teal-600">New This Month</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-hrms-slate-400" />
              <Input
                placeholder="Search employees by name, email, department, or role..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {showFilters && (
              <div className="flex flex-wrap gap-2">
                <Select value={selectedDepartments.join(",")} onValueChange={(value) => setSelectedDepartments(value ? value.split(",") : [])}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatuses.join(",")} onValueChange={(value) => setSelectedStatuses(value ? value.split(",") : [])}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocations.join(",")} onValueChange={(value) => setSelectedLocations(value ? value.split(",") : [])}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedDepartments([]);
                  setSelectedStatuses([]);
                  setSelectedLocations([]);
                  setSearchTerm("");
                }}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            )}
          </div>

          {selectedEmployees.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedEmployees.length} employees selected
              </span>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => setBulkActionOpen(true)}>
                  Bulk Actions
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedEmployees([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee List/Table */}
      {viewMode === "list" ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-hrms-slate-50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedEmployees.length === filteredAndSortedEmployees.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("name")}>
                        Employee
                        <SortIcon field="name" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("role")}>
                        Role
                        <SortIcon field="role" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("department")}>
                        Department
                        <SortIcon field="department" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("location")}>
                        Location
                        <SortIcon field="location" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("status")}>
                        Status
                        <SortIcon field="status" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="h-auto p-0 font-semibold" onClick={() => handleSort("joinDate")}>
                        Join Date
                        <SortIcon field="joinDate" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-hrms-slate-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() => handleSelectEmployee(employee.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback className="bg-hrms-blue-600 text-white text-sm">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-hrms-slate-900">{employee.name}</div>
                            <div className="text-sm text-hrms-slate-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{employee.role}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-hrms-slate-400" />
                          {employee.department}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-hrms-slate-400" />
                          {employee.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-hrms-slate-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(employee.joinDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Grid View (existing card layout)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-all duration-200 border-hrms-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback className="bg-hrms-blue-600 text-white">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <CardDescription>{employee.role}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                    {employee.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-hrms-slate-600">
                  <Mail className="h-4 w-4" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-hrms-slate-600">
                  <Phone className="h-4 w-4" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-hrms-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>{employee.location}</span>
                </div>
                
                <div className="pt-3 border-t border-hrms-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-hrms-slate-500">Department:</span>
                    <span className="font-medium">{employee.department}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-hrms-slate-500">Joined:</span>
                    <span className="font-medium">{new Date(employee.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Employee Data</DialogTitle>
            <DialogDescription>
              Choose the format and scope for your export
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Export Format</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button variant="outline" onClick={() => handleExport("csv")}>
                  CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport("xlsx")}>
                  Excel
                </Button>
                <Button variant="outline" onClick={() => handleExport("pdf")}>
                  PDF
                </Button>
              </div>
            </div>
            <div>
              <Label>Export Scope</Label>
              <p className="text-sm text-hrms-slate-600 mt-1">
                {selectedEmployees.length > 0 
                  ? `${selectedEmployees.length} selected employees`
                  : `${filteredAndSortedEmployees.length} filtered employees`
                }
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Employee Data</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file with employee data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-hrms-slate-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-hrms-slate-400 mb-4" />
              <p className="text-sm text-hrms-slate-600">
                Drag and drop your file here, or click to browse
              </p>
              <Button variant="outline" className="mt-2">
                Choose File
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport}>
                Import Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Perform actions on {selectedEmployees.length} selected employees
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => handleBulkAction("activate")}>
              Activate Selected
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handleBulkAction("deactivate")}>
              Deactivate Selected
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600" onClick={() => handleBulkAction("delete")}>
              Delete Selected
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredAndSortedEmployees.length === 0 && (
        <Card className="text-center p-8">
          <Users className="h-12 w-12 mx-auto text-hrms-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-hrms-slate-900 mb-2">
            No employees found
          </h3>
          <p className="text-hrms-slate-600">
            Try adjusting your search terms or filters
          </p>
        </Card>
      )}
    </div>
  );
}