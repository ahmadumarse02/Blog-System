"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Plus, 
  Building2,
  Users,
  Clock,
  Phone,
  Mail,
  Edit,
  Settings,
  Globe,
  Wifi,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Trash2,
  Copy,
  Calendar,
  DollarSign,
  Shield,
  Car,
  Coffee,
  Dumbbell,
  TreePine,
  Camera,
  X,
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  List,
  Grid3X3,
  SlidersHorizontal,
  MoreHorizontal
} from "lucide-react";

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  timezone: string;
  type: string;
  employees: number;
  capacity: number;
  status: string;
  manager: string;
  phone: string;
  email: string;
  facilities: string[];
  costCenter: string;
  established: string;
  area: number; // square feet
  floors: number;
  parkingSpaces: number;
  monthlyRent: number;
  securityLevel: string;
}

export default function LocationsPageClient() {
  console.log("Locations page loaded");

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [editLocationOpen, setEditLocationOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Enhanced location data
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 1,
      name: "Corporate Headquarters",
      address: "123 Business Plaza, Suite 500",
      city: "New York, NY 10001",
      country: "United States",
      timezone: "America/New_York",
      type: "Headquarters",
      employees: 45,
      capacity: 60,
      status: "Active",
      manager: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "hq@company.com",
      facilities: ["WiFi", "Parking", "Cafeteria", "Conference Rooms", "Security", "Gym"],
      costCenter: "CC-001",
      established: "2015-03-15",
      area: 12000,
      floors: 3,
      parkingSpaces: 25,
      monthlyRent: 25000,
      securityLevel: "High"
    },
    {
      id: 2,
      name: "West Coast Office",
      address: "456 Innovation Drive",
      city: "San Francisco, CA 94105",
      country: "United States",
      timezone: "America/Los_Angeles",
      type: "Branch Office",
      employees: 32,
      capacity: 40,
      status: "Active",
      manager: "Mike Chen",
      phone: "+1 (555) 987-6543",
      email: "westcoast@company.com",
      facilities: ["WiFi", "Parking", "Gym", "Conference Rooms", "Kitchen"],
      costCenter: "CC-002",
      established: "2018-07-22",
      area: 8500,
      floors: 2,
      parkingSpaces: 15,
      monthlyRent: 18000,
      securityLevel: "Medium"
    },
    {
      id: 3,
      name: "European Office",
      address: "789 Tech Street",
      city: "London, UK EC1A 1BB",
      country: "United Kingdom",
      timezone: "Europe/London",
      type: "International",
      employees: 28,
      capacity: 35,
      status: "Active",
      manager: "Emily Davis",
      phone: "+44 20 1234 5678",
      email: "europe@company.com",
      facilities: ["WiFi", "Public Transport", "Cafeteria", "Meeting Rooms"],
      costCenter: "CC-003",
      established: "2019-11-08",
      area: 6000,
      floors: 1,
      parkingSpaces: 8,
      monthlyRent: 12000,
      securityLevel: "Medium"
    },
    {
      id: 4,
      name: "Manufacturing Plant",
      address: "321 Industrial Way",
      city: "Detroit, MI 48201",
      country: "United States",
      timezone: "America/Detroit",
      type: "Manufacturing",
      employees: 67,
      capacity: 80,
      status: "Active",
      manager: "James Wilson",
      phone: "+1 (555) 456-7890",
      email: "manufacturing@company.com",
      facilities: ["WiFi", "Parking", "Security", "Warehouse", "Loading Dock", "Medical"],
      costCenter: "CC-004",
      established: "2012-01-15",
      area: 45000,
      floors: 1,
      parkingSpaces: 60,
      monthlyRent: 15000,
      securityLevel: "High"
    },
    {
      id: 5,
      name: "R&D Center",
      address: "654 Research Blvd",
      city: "Austin, TX 78701",
      country: "United States",
      timezone: "America/Chicago",
      type: "Research",
      employees: 18,
      capacity: 25,
      status: "Active",
      manager: "Lisa Anderson",
      phone: "+1 (555) 321-0987",
      email: "research@company.com",
      facilities: ["WiFi", "Labs", "Conference Rooms", "Parking", "Security", "Clean Room"],
      costCenter: "CC-005",
      established: "2020-05-10",
      area: 15000,
      floors: 2,
      parkingSpaces: 20,
      monthlyRent: 22000,
      securityLevel: "High"
    }
  ]);

  // Enhanced add location form state
  const [addLocationForm, setAddLocationForm] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    timezone: "",
    type: "Branch Office",
    capacity: "",
    manager: "",
    phone: "",
    email: "",
    facilities: [] as string[],
    costCenter: "",
    established: "",
    area: "",
    floors: "",
    parkingSpaces: "",
    monthlyRent: "",
    securityLevel: "Medium"
  });

  const locationStats = [
    { label: "Total Locations", value: locations.length.toString(), icon: MapPin, color: "text-blue-600" },
    { label: "Active Employees", value: locations.reduce((sum, loc) => sum + loc.employees, 0).toString(), icon: Users, color: "text-green-600" },
    { label: "Office Spaces", value: locations.filter(loc => loc.type.includes("Office")).length.toString(), icon: Building2, color: "text-slate-600" },
    { label: "Total Capacity", value: locations.reduce((sum, loc) => sum + loc.capacity, 0).toString(), icon: Globe, color: "text-purple-600" }
  ];

  const facilityOptions = [
    { value: "WiFi", label: "WiFi/Internet", icon: Wifi },
    { value: "Parking", label: "Parking", icon: Car },
    { value: "Cafeteria", label: "Cafeteria", icon: Coffee },
    { value: "Conference Rooms", label: "Conference Rooms", icon: Users },
    { value: "Gym", label: "Fitness Center", icon: Dumbbell },
    { value: "Security", label: "Security", icon: Shield },
    { value: "Kitchen", label: "Kitchen", icon: Coffee },
    { value: "Labs", label: "Laboratories", icon: Settings },
    { value: "Warehouse", label: "Warehouse", icon: Building2 },
    { value: "Loading Dock", label: "Loading Dock", icon: Building2 },
    { value: "Medical", label: "Medical Center", icon: Plus },
    { value: "Clean Room", label: "Clean Room", icon: Settings },
    { value: "Public Transport", label: "Public Transport", icon: Globe },
    { value: "Meeting Rooms", label: "Meeting Rooms", icon: Users },
    { value: "Garden", label: "Garden/Outdoor", icon: TreePine }
  ];

  const handleAddLocation = () => {
    console.log("Adding new location:", addLocationForm);
    
    const newLocation: Location = {
      id: Math.max(...locations.map(l => l.id)) + 1,
      name: addLocationForm.name,
      address: addLocationForm.address,
      city: addLocationForm.city,
      country: addLocationForm.country,
      timezone: addLocationForm.timezone,
      type: addLocationForm.type,
      employees: 0,
      capacity: parseInt(addLocationForm.capacity) || 0,
      status: "Active",
      manager: addLocationForm.manager,
      phone: addLocationForm.phone,
      email: addLocationForm.email,
      facilities: addLocationForm.facilities,
      costCenter: addLocationForm.costCenter,
      established: addLocationForm.established,
      area: parseInt(addLocationForm.area) || 0,
      floors: parseInt(addLocationForm.floors) || 1,
      parkingSpaces: parseInt(addLocationForm.parkingSpaces) || 0,
      monthlyRent: parseInt(addLocationForm.monthlyRent) || 0,
      securityLevel: addLocationForm.securityLevel
    };

    setLocations([...locations, newLocation]);
    setAddLocationOpen(false);
    
    // Reset form
    setAddLocationForm({
      name: "",
      address: "",
      city: "",
      country: "",
      timezone: "",
      type: "Branch Office",
      capacity: "",
      manager: "",
      phone: "",
      email: "",
      facilities: [],
      costCenter: "",
      established: "",
      area: "",
      floors: "",
      parkingSpaces: "",
      monthlyRent: "",
      securityLevel: "Medium"
    });

    toast({
      title: "Location Added",
      description: `${newLocation.name} has been successfully added.`,
    });
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setEditLocationOpen(true);
  };

  const handleDeleteLocation = (locationId: number) => {
    setLocations(locations.filter(l => l.id !== locationId));
    toast({
      title: "Location Deleted", 
      description: "Location has been successfully removed.",
    });
  };

  const toggleFacility = (facility: string) => {
    setAddLocationForm(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Inactive": return "bg-red-100 text-red-800 border-red-200";
      case "Maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Locations & Facilities
          </h1>
          <p className="text-slate-600">
            Manage office locations, facilities, and workplace resources
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setFilterOpen(true)} className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" onClick={() => setSettingsOpen(true)} className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button onClick={() => setAddLocationOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {locationStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-slate-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search locations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-slate-600">
          {filteredLocations.length} of {locations.length} locations
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">All Locations</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {viewMode === "list" ? (
            // Enhanced List View
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Manager</TableHead>
                        <TableHead className="font-semibold">Capacity</TableHead>
                        <TableHead className="font-semibold">Utilization</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Facilities</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLocations.map((location) => {
                        const utilization = (location.employees / location.capacity) * 100;
                        return (
                          <TableRow key={location.id} className="hover:bg-slate-50">
                            <TableCell>
                              <div>
                                <div className="font-medium text-slate-900 flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-blue-600" />
                                  {location.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {location.address}, {location.city}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {location.area.toLocaleString()} sq ft • {location.floors} floor{location.floors !== 1 ? 's' : ''}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {location.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium text-sm">{location.manager}</div>
                                <div className="text-xs text-slate-500">{location.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">{location.employees}/{location.capacity}</div>
                                <div className="text-xs text-slate-500">people</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                                  {utilization.toFixed(1)}%
                                </div>
                                <Progress value={utilization} className="h-1.5 w-16" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(location.status)} text-xs`}>
                                {location.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-32">
                                {location.facilities.slice(0, 3).map((facility, index) => (
                                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                    {facility}
                                  </Badge>
                                ))}
                                {location.facilities.length > 3 && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    +{location.facilities.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditLocation(location)}
                                  className="h-8 w-8 p-0 hover:bg-blue-50"
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-green-50"
                                >
                                  <Eye className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteLocation(location.id)}
                                  className="h-8 w-8 p-0 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Grid View (existing card layout)
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLocations.map((location) => (
                <Card key={location.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          {location.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {location.address}<br />
                          {location.city}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(location.status)}>
                        {location.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Location Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Type</p>
                          <p className="text-sm font-medium">{location.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Manager</p>
                          <p className="text-sm font-medium">{location.manager}</p>
                        </div>
                      </div>

                      {/* Capacity */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700">Capacity</span>
                          <span className="text-sm text-slate-600">
                            {location.employees}/{location.capacity} 
                            ({Math.round((location.employees / location.capacity) * 100)}%)
                          </span>
                        </div>
                        <Progress 
                          value={(location.employees / location.capacity) * 100} 
                          className="h-2"
                        />
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4" />
                        {location.phone}
                      </div>

                      {/* Facilities */}
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Facilities</p>
                        <div className="flex flex-wrap gap-2">
                          {location.facilities.map((facility, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleEditLocation(location)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Users className="h-4 w-4 mr-1" />
                          View Team
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="capacity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Capacity Overview
              </CardTitle>
              <CardDescription>
                Current and projected space utilization across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {locations.map((location) => {
                  const utilizationRate = (location.employees / location.capacity) * 100;
                  return (
                    <div key={location.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-slate-900">{location.name}</h3>
                          <p className="text-sm text-slate-600">{location.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">
                            {location.employees} / {location.capacity}
                          </p>
                          <p className={`text-sm font-medium ${getUtilizationColor(utilizationRate)}`}>
                            {utilizationRate.toFixed(1)}% utilized
                          </p>
                        </div>
                      </div>
                      <Progress value={utilizationRate} className="h-3" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Facility Management
              </CardTitle>
              <CardDescription>
                Overview of facilities and resources across all locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {facilityOptions.map((facility) => {
                  const count = locations.filter(loc => 
                    loc.facilities.includes(facility.value)
                  ).length;
                  return (
                    <div key={facility.value} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <facility.icon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{facility.label}</span>
                      </div>
                      <Badge variant="secondary">{count}/{locations.length}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Add Location Dialog */}
      <Dialog open={addLocationOpen} onOpenChange={setAddLocationOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Add New Location
            </DialogTitle>
            <DialogDescription>
              Create a comprehensive location profile with detailed information and facilities
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Downtown Office"
                    value={addLocationForm.name}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Location Type *</Label>
                  <Select value={addLocationForm.type} onValueChange={(value) => setAddLocationForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Headquarters">Headquarters</SelectItem>
                      <SelectItem value="Branch Office">Branch Office</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Research">Research & Development</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="International">International Office</SelectItem>
                      <SelectItem value="Remote Hub">Remote Work Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Address & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Business Street, Suite 100"
                    value={addLocationForm.address}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City, State/Province *</Label>
                  <Input
                    id="city"
                    placeholder="New York, NY 10001"
                    value={addLocationForm.city}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={addLocationForm.country} onValueChange={(value) => setAddLocationForm(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={addLocationForm.timezone} onValueChange={(value) => setAddLocationForm(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (UTC+1)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney (UTC+10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft)</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="5000"
                    value={addLocationForm.area}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, area: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floors">Number of Floors</Label>
                  <Input
                    id="floors"
                    type="number"
                    placeholder="2"
                    value={addLocationForm.floors}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, floors: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Employee Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="50"
                    value={addLocationForm.capacity}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, capacity: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                  <Input
                    id="parkingSpaces"
                    type="number"
                    placeholder="25"
                    value={addLocationForm.parkingSpaces}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, parkingSpaces: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Management & Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Management & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manager">Location Manager *</Label>
                  <Input
                    id="manager"
                    placeholder="John Doe"
                    value={addLocationForm.manager}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, manager: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={addLocationForm.phone}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="location@company.com"
                    value={addLocationForm.email}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityLevel">Security Level</Label>
                  <Select value={addLocationForm.securityLevel} onValueChange={(value) => setAddLocationForm(prev => ({ ...prev, securityLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Maximum">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    placeholder="15000"
                    value={addLocationForm.monthlyRent}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, monthlyRent: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costCenter">Cost Center</Label>
                  <Input
                    id="costCenter"
                    placeholder="CC-001"
                    value={addLocationForm.costCenter}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, costCenter: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established">Established Date</Label>
                  <Input
                    id="established"
                    type="date"
                    value={addLocationForm.established}
                    onChange={(e) => setAddLocationForm(prev => ({ ...prev, established: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Facilities & Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Facilities & Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {facilityOptions.map((facility) => (
                  <div key={facility.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={facility.value}
                      checked={addLocationForm.facilities.includes(facility.value)}
                      onCheckedChange={() => toggleFacility(facility.value)}
                    />
                    <Label
                      htmlFor={facility.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <facility.icon className="h-4 w-4" />
                      {facility.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setAddLocationOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddLocation}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!addLocationForm.name || !addLocationForm.address || !addLocationForm.capacity}
            >
              <Check className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Location Settings
            </DialogTitle>
            <DialogDescription>
              Configure advanced settings for location management
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Display Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Default View Mode</Label>
                    <p className="text-sm text-slate-600">Choose the default view for locations</p>
                  </div>
                  <Select defaultValue="list">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list">List View</SelectItem>
                      <SelectItem value="grid">Grid View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Utilization Warnings</Label>
                    <p className="text-sm text-slate-600">Alert when capacity exceeds 90%</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-sync Employee Data</Label>
                    <p className="text-sm text-slate-600">Automatically update employee counts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Location Analytics</Label>
                    <p className="text-sm text-slate-600">Track usage patterns and trends</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Export & Import</h3>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}