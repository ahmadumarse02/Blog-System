"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Save,
  RefreshCw,
  Users,
  Timer,
  MapPin
} from "lucide-react";

interface CompanySettings {
  companyName: string;
  payPeriodType: "weekly" | "fortnightly" | "monthly" | "4-weekly";
  payPeriodStartDay: number;
  timezone: string;
  workingDays: number[];
  standardHours: number;
  overtimeThreshold: number;
  currency: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
}

interface CompanySettingsClientProps {
  initialSettings: CompanySettings;
}

export default function CompanySettingsClient({ initialSettings }: CompanySettingsClientProps) {
  const [settings, setSettings] = useState<CompanySettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  console.log("Company settings loaded:", settings);

  const payPeriodOptions = [
    { value: "weekly", label: "Weekly (7 days)" },
    { value: "fortnightly", label: "Fortnightly (14 days)" },
    { value: "4-weekly", label: "4-Weekly (28 days)" },
    { value: "monthly", label: "Monthly" }
  ];

  const dayOptions = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" }
  ];

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" }
  ];

  const currencyOptions = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Saving company settings:", settings);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Company settings saved successfully!");
    setIsSaving(false);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    toast.info("Settings reset to defaults");
  };

  const toggleWorkingDay = (day: number) => {
    setSettings(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day].sort()
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-hrms-slate-900 flex items-center gap-3">
            <Settings className="h-8 w-8 text-hrms-blue-600" />
            Company Settings
          </h1>
          <p className="text-hrms-slate-600 mt-2">
            Configure your company's payroll and timesheet settings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Basic company details and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(curr => (
                    <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pay Period Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pay Period Settings
            </CardTitle>
            <CardDescription>
              Configure how pay periods are calculated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payPeriodType">Pay Period Type</Label>
              <Select 
                value={settings.payPeriodType} 
                onValueChange={(value: any) => setSettings(prev => ({ ...prev, payPeriodType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pay period" />
                </SelectTrigger>
                <SelectContent>
                  {payPeriodOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payPeriodStartDay">Pay Period Start Day</Label>
              <Select 
                value={settings.payPeriodStartDay.toString()} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, payPeriodStartDay: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select start day" />
                </SelectTrigger>
                <SelectContent>
                  {dayOptions.map(day => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Working Hours
            </CardTitle>
            <CardDescription>
              Set standard working hours and overtime rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="standardHours">Standard Hours/Week</Label>
                <Input
                  id="standardHours"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.standardHours}
                  onChange={(e) => setSettings(prev => ({ ...prev, standardHours: parseInt(e.target.value) || 40 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="overtimeThreshold">Overtime Threshold</Label>
                <Input
                  id="overtimeThreshold"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.overtimeThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, overtimeThreshold: parseInt(e.target.value) || 40 }))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Working Days</Label>
              <div className="grid grid-cols-7 gap-2">
                {dayOptions.map(day => (
                  <div key={day.value} className="flex flex-col items-center">
                    <Button
                      variant={settings.workingDays.includes(day.value) ? "default" : "outline"}
                      size="sm"
                      className="w-full h-8 text-xs"
                      onClick={() => toggleWorkingDay(day.value)}
                    >
                      {day.label.slice(0, 3)}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Format Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Format Settings
            </CardTitle>
            <CardDescription>
              Configure date and time display formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select value={settings.dateFormat} onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/dd/yyyy">MM/dd/yyyy (US)</SelectItem>
                  <SelectItem value="dd/MM/yyyy">dd/MM/yyyy (UK)</SelectItem>
                  <SelectItem value="yyyy-MM-dd">yyyy-MM-dd (ISO)</SelectItem>
                  <SelectItem value="dd.MM.yyyy">dd.MM.yyyy (DE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <Select 
                value={settings.timeFormat} 
                onValueChange={(value: any) => setSettings(prev => ({ ...prev, timeFormat: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Current Configuration Summary
          </CardTitle>
          <CardDescription>
            Preview of your current pay period and working time settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {settings.payPeriodType === "weekly" ? "7" : 
                 settings.payPeriodType === "fortnightly" ? "14" :
                 settings.payPeriodType === "4-weekly" ? "28" : "30"} days
              </div>
              <div className="text-sm text-blue-700 font-medium">Pay Period Length</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {settings.standardHours}h
              </div>
              <div className="text-sm text-green-700 font-medium">Standard Hours/Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {settings.workingDays.length}
              </div>
              <div className="text-sm text-purple-700 font-medium">Working Days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}