import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { MainLayout } from "@/components/layout/main-layout";
import TimesheetsClient from "./timesheets-client";
import { getCurrentPayPeriod } from "@/lib/pay-period-utils";

export default async function TimesheetsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  console.log("Timesheets page accessed by:", session.email, "with roles:", session.roles);

  // Calculate the current pay period for consistent data
  const payPeriodSettings = { type: "weekly" as const, startDay: 1 }; // Monday start
  const currentPeriod = getCurrentPayPeriod(payPeriodSettings);
  
  console.log("Current pay period:", currentPeriod);
  console.log("Current pay period dates:", {
    start: currentPeriod.start.toISOString().split('T')[0],
    end: currentPeriod.end.toISOString().split('T')[0]
  });
  
  // Also log the number of timesheets we're creating
  console.log("Creating timesheets for period:", currentPeriod.label);

  // Helper function to get date offsets
  const getDateOffset = (days: number) => new Date(currentPeriod.start.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Helper function to create individual shift records from employee data
  const createShiftRecords = (employeeData: any) => {
    return employeeData.dailyHours.map((shift: any, index: number) => ({
      id: employeeData.id * 10 + index + 1, // Create unique IDs for each shift
      employeeName: employeeData.employeeName,
      employeeEmail: employeeData.employeeEmail,
      employeeAvatar: employeeData.employeeAvatar,
      role: employeeData.role,
      department: employeeData.department,
      location: employeeData.location,
      weekPeriod: employeeData.weekPeriod,
      startDate: shift.date,
      endDate: shift.date, // Single day shift
      totalHours: shift.hours,
      regularHours: shift.hours > 8 ? 8 : shift.hours,
      overtimeHours: shift.hours > 8 ? shift.hours - 8 : 0,
      breakHours: shift.breakHours,
      status: employeeData.status,
      submittedDate: employeeData.submittedDate,
      lastModified: employeeData.lastModified,
      approvedBy: employeeData.approvedBy,
      approvedDate: employeeData.approvedDate,
      rejectedBy: employeeData.rejectedBy,
      rejectedDate: employeeData.rejectedDate,
      rejectionReason: employeeData.rejectionReason,
      project: shift.project,
      notes: shift.description,
      currentShiftStart: shift.startTime,
      currentShiftEnd: shift.endTime,
      dailyHours: [shift] // Keep the single shift data
    }));
  };

  // Employee data templates
  const employeeTemplates = [
    {
      id: 101,
      employeeName: "Sarah Johnson",
      employeeEmail: "sarah.johnson@company.com",
      employeeAvatar: "",
      role: "Operations Manager", 
      department: "Operations",
      location: "Chicago Office",
      weekPeriod: currentPeriod.label,
      status: "Pending Approval",
      submittedDate: currentPeriod.end.toISOString().split('T')[0],
      lastModified: currentPeriod.end.toISOString().split('T')[0],
      dailyHours: [
        { date: getDateOffset(0), hours: 9.0, breakHours: 0.5, startTime: "07:30 AM", endTime: "05:00 PM", project: "Operations Optimization", description: "Process analysis and workflow review" },
        { date: getDateOffset(1), hours: 9.0, breakHours: 0.5, startTime: "07:30 AM", endTime: "05:00 PM", project: "Operations Optimization", description: "Team meetings and coordination" },
        { date: getDateOffset(2), hours: 9.0, breakHours: 0.5, startTime: "07:30 AM", endTime: "05:00 PM", project: "Operations Optimization", description: "Performance review sessions" },
        { date: getDateOffset(3), hours: 9.0, breakHours: 1.0, startTime: "07:30 AM", endTime: "05:30 PM", project: "Operations Optimization", description: "Strategic planning workshops" },
        { date: getDateOffset(4), hours: 9.0, breakHours: 1.0, startTime: "07:30 AM", endTime: "05:30 PM", project: "Operations Optimization", description: "Documentation and reporting" }
      ]
    },
    {
      id: 102,
      employeeName: "Mark Thompson",
      employeeEmail: "mark.thompson@company.com",
      employeeAvatar: "",
      role: "Senior Developer",
      department: "Engineering",
      location: "San Francisco Office",
      weekPeriod: currentPeriod.label,
      status: "Approved",
      submittedDate: getDateOffset(5),
      lastModified: getDateOffset(5),
      approvedBy: "Sarah Johnson",
      approvedDate: currentPeriod.end.toISOString().split('T')[0],
      dailyHours: [
        { date: getDateOffset(0), hours: 8.0, breakHours: 0.5, startTime: "09:00 AM", endTime: "05:30 PM", project: "Mobile App V2.0", description: "Authentication module development" },
        { date: getDateOffset(1), hours: 8.5, breakHours: 0.5, startTime: "09:00 AM", endTime: "06:00 PM", project: "Mobile App V2.0", description: "API integration and testing" },
        { date: getDateOffset(2), hours: 8.5, breakHours: 0.5, startTime: "09:00 AM", endTime: "06:00 PM", project: "Mobile App V2.0", description: "UI components design" },
        { date: getDateOffset(3), hours: 8.0, breakHours: 0.5, startTime: "09:00 AM", endTime: "05:30 PM", project: "Mobile App V2.0", description: "Testing and debugging" },
        { date: getDateOffset(4), hours: 9.0, breakHours: 0.0, startTime: "09:00 AM", endTime: "06:00 PM", project: "Mobile App V2.0", description: "Release preparation" }
      ]
    },
    {
      id: 103,
      employeeName: "Jessica Chen",
      employeeEmail: "jessica.chen@company.com",
      employeeAvatar: "",
      role: "Marketing Director",
      department: "Marketing",
      location: "Remote",
      weekPeriod: currentPeriod.label,
      status: "Rejected",
      submittedDate: getDateOffset(4),
      lastModified: getDateOffset(4),
      rejectedBy: "Sarah Johnson",
      rejectedDate: currentPeriod.end.toISOString().split('T')[0],
      rejectionReason: "Insufficient detail on campaign budget allocation activities",
      dailyHours: [
        { date: getDateOffset(0), hours: 7.5, breakHours: 0.5, startTime: "08:00 AM", endTime: "04:00 PM", project: "Summer Campaign 2025", description: "Campaign planning and strategy" },
        { date: getDateOffset(1), hours: 8.0, breakHours: 0.5, startTime: "08:00 AM", endTime: "04:30 PM", project: "Summer Campaign 2025", description: "Content creation and review" },
        { date: getDateOffset(2), hours: 7.5, breakHours: 0.5, startTime: "08:00 AM", endTime: "04:00 PM", project: "Summer Campaign 2025", description: "Budget planning analysis" },
        { date: getDateOffset(3), hours: 8.0, breakHours: 0.5, startTime: "08:00 AM", endTime: "04:30 PM", project: "Summer Campaign 2025", description: "Team coordination meetings" },
        { date: getDateOffset(4), hours: 7.5, breakHours: 1.0, startTime: "08:00 AM", endTime: "04:30 PM", project: "Summer Campaign 2025", description: "Campaign performance review" }
      ]
    },
    {
      id: 104,
      employeeName: "Robert Kim",
      employeeEmail: "robert.kim@company.com",
      employeeAvatar: "",
      role: "DevOps Engineer",
      department: "Engineering",
      location: "Austin Office",
      weekPeriod: currentPeriod.label,
      startDate: currentPeriod.start.toISOString().split('T')[0],
      endDate: currentPeriod.end.toISOString().split('T')[0],
      totalHours: 48.0,
      regularHours: 40.0,
      overtimeHours: 8.0,
      breakHours: 2.5,
      status: "Pending Approval",
      submittedDate: currentPeriod.end.toISOString().split('T')[0],
      lastModified: currentPeriod.end.toISOString().split('T')[0],
      project: "Infrastructure Migration",
      notes: "Critical system migration required extensive overtime",
      currentShiftStart: "06:00 AM",
      currentShiftEnd: "06:30 PM",
      dailyHours: [
        { date: getDateOffset(0), hours: 10.0, breakHours: 0.5, startTime: "06:00", endTime: "16:30", project: "Infrastructure Migration", description: "Server migration planning" },
        { date: getDateOffset(1), hours: 10.0, breakHours: 0.5, startTime: "06:00", endTime: "16:30", project: "Infrastructure Migration", description: "Database migration" },
        { date: getDateOffset(2), hours: 9.0, breakHours: 0.5, startTime: "06:00", endTime: "15:30", project: "Infrastructure Migration", description: "Network configuration" },
        { date: getDateOffset(3), hours: 9.5, breakHours: 0.5, startTime: "06:00", endTime: "16:00", project: "Infrastructure Migration", description: "Load testing" },
        { date: getDateOffset(4), hours: 9.5, breakHours: 0.5, startTime: "06:00", endTime: "16:00", project: "Infrastructure Migration", description: "Go-live support" }
      ]
    },
    {
      id: 105, // Changed from 104 to 105 to avoid duplicate IDs
      employeeName: "Robert Kim",
      employeeEmail: "robert.kim@company.com",
      employeeAvatar: "",
      role: "DevOps Engineer",
      department: "Engineering",
      location: "Austin Office",
      weekPeriod: currentPeriod.label,
      status: "Pending Approval",
      submittedDate: currentPeriod.end.toISOString().split('T')[0],
      lastModified: currentPeriod.end.toISOString().split('T')[0],
      dailyHours: [
        { date: getDateOffset(0), hours: 10.0, breakHours: 0.5, startTime: "06:00 AM", endTime: "04:30 PM", project: "Infrastructure Migration", description: "Server migration planning" },
        { date: getDateOffset(1), hours: 10.0, breakHours: 0.5, startTime: "06:00 AM", endTime: "04:30 PM", project: "Infrastructure Migration", description: "Database migration execution" },
        { date: getDateOffset(2), hours: 9.0, breakHours: 0.5, startTime: "06:00 AM", endTime: "03:30 PM", project: "Infrastructure Migration", description: "Network configuration" },
        { date: getDateOffset(3), hours: 9.5, breakHours: 0.5, startTime: "06:00 AM", endTime: "04:00 PM", project: "Infrastructure Migration", description: "Load testing and optimization" },
        { date: getDateOffset(4), hours: 9.5, breakHours: 0.5, startTime: "06:00 AM", endTime: "04:00 PM", project: "Infrastructure Migration", description: "Go-live support" }
      ]
    },
    {
      id: 106, // Changed from 105 to 106
      employeeName: "Amanda Foster",
      employeeEmail: "amanda.foster@company.com",
      employeeAvatar: "",
      role: "HR Specialist",
      department: "Human Resources",
      location: "New York Office",
      weekPeriod: currentPeriod.label,
      status: "Approved",
      submittedDate: getDateOffset(5),
      lastModified: getDateOffset(5),
      approvedBy: "Jane Smith",
      approvedDate: getDateOffset(5),
      dailyHours: [
        { date: getDateOffset(0), hours: 8.0, breakHours: 0.5, startTime: "09:00 AM", endTime: "05:30 PM", project: "Employee Onboarding Program", description: "New hire orientations" },
        { date: getDateOffset(1), hours: 8.0, breakHours: 1.0, startTime: "09:00 AM", endTime: "06:00 PM", project: "Employee Onboarding Program", description: "Policy updates and training" },
        { date: getDateOffset(2), hours: 8.0, breakHours: 1.0, startTime: "09:00 AM", endTime: "06:00 PM", project: "Employee Onboarding Program", description: "Training sessions delivery" },
        { date: getDateOffset(3), hours: 8.0, breakHours: 0.5, startTime: "09:00 AM", endTime: "05:30 PM", project: "Employee Onboarding Program", description: "Documentation review" },
        { date: getDateOffset(4), hours: 8.0, breakHours: 1.0, startTime: "09:00 AM", endTime: "06:00 PM", project: "Employee Onboarding Program", description: "Benefits enrollment support" }
      ]
    },
    {
      id: 107, // Changed from 106 to 107
      employeeName: "Daniel Rodriguez",
      employeeEmail: "daniel.rodriguez@company.com",
      employeeAvatar: "",
      role: "Sales Manager",
      department: "Sales",
      location: "Los Angeles Office",
      weekPeriod: currentPeriod.label,
      status: "Open",
      submittedDate: null,
      lastModified: currentPeriod.end.toISOString().split('T')[0],
      dailyHours: [
        { date: getDateOffset(0), hours: 9.0, breakHours: 0.5, startTime: "08:00 AM", endTime: "05:30 PM", project: "Q2 Sales Drive", description: "Client meetings and presentations" },
        { date: getDateOffset(1), hours: 8.5, breakHours: 0.5, startTime: "08:00 AM", endTime: "05:00 PM", project: "Q2 Sales Drive", description: "Proposal preparation" },
        { date: getDateOffset(2), hours: 9.0, breakHours: 0.5, startTime: "08:00 AM", endTime: "05:30 PM", project: "Q2 Sales Drive", description: "Pipeline review and analysis" },
        { date: getDateOffset(3), hours: 8.5, breakHours: 0.5, startTime: "08:00 AM", endTime: "05:00 PM", project: "Q2 Sales Drive", description: "Team planning session" },
        { date: getDateOffset(4), hours: 8.5, breakHours: 0.0, startTime: "08:00 AM", endTime: "04:30 PM", project: "Q2 Sales Drive", description: "Quarter-end activities (ongoing)" }
      ]
    },
    {
      id: 108, // Changed from 107 to 108
      employeeName: "Linda Zhang",
      employeeEmail: "linda.zhang@company.com",
      employeeAvatar: "",
      role: "Data Scientist",
      department: "Analytics",
      location: "Seattle Office",
      weekPeriod: currentPeriod.label,
      status: "Draft",
      submittedDate: null,
      lastModified: getDateOffset(4),
      dailyHours: [
        { date: getDateOffset(0), hours: 7.0, breakHours: 0.5, startTime: "10:00 AM", endTime: "05:30 PM", project: "Customer Analytics Platform", description: "Data modeling and analysis" },
        { date: getDateOffset(1), hours: 7.0, breakHours: 0.5, startTime: "10:00 AM", endTime: "05:30 PM", project: "Customer Analytics Platform", description: "Algorithm development" },
        { date: getDateOffset(2), hours: 7.5, breakHours: 0.5, startTime: "10:00 AM", endTime: "06:00 PM", project: "Customer Analytics Platform", description: "Machine learning models" },
        { date: getDateOffset(3), hours: 7.0, breakHours: 0.5, startTime: "10:00 AM", endTime: "05:30 PM", project: "Customer Analytics Platform", description: "Data visualization development" },
        { date: getDateOffset(4), hours: 7.5, breakHours: 0.5, startTime: "10:00 AM", endTime: "06:00 PM", project: "Customer Analytics Platform", description: "Performance optimization" }
      ]
    },
    {
      id: 109, // Changed from 108 to 109
      employeeName: "Christopher Lee",
      employeeEmail: "christopher.lee@company.com",
      employeeAvatar: "",
      role: "UX Designer",
      department: "Design",
      location: "Remote",
      weekPeriod: currentPeriod.label,
      status: "Pending Approval",
      submittedDate: currentPeriod.end.toISOString().split('T')[0],
      lastModified: currentPeriod.end.toISOString().split('T')[0],
      dailyHours: [
        { date: getDateOffset(0), hours: 8.0, breakHours: 0.5, startTime: "09:30 AM", endTime: "06:00 PM", project: "Design System V3", description: "Component audit and review" },
        { date: getDateOffset(1), hours: 8.0, breakHours: 0.5, startTime: "09:30 AM", endTime: "06:00 PM", project: "Design System V3", description: "Color palette revision" },
        { date: getDateOffset(2), hours: 8.0, breakHours: 1.0, startTime: "09:30 AM", endTime: "06:30 PM", project: "Design System V3", description: "Typography system design" },
        { date: getDateOffset(3), hours: 8.0, breakHours: 0.5, startTime: "09:30 AM", endTime: "06:00 PM", project: "Design System V3", description: "Iconography review" },
        { date: getDateOffset(4), hours: 8.0, breakHours: 0.5, startTime: "09:30 AM", endTime: "06:00 PM", project: "Design System V3", description: "Documentation updates" }
      ]
    },
  ];

  // Generate individual shift records from all employee templates
  const timesheets = employeeTemplates.flatMap(createShiftRecords);

  const currentUser = {
    name: session.email === "admin@company.com" ? "System Administrator" :
          session.email === "hr@company.com" ? "Jane Smith" :
          session.email === "manager@company.com" ? "Sarah Johnson" :
          "John Doe",
    email: session.email,
    roles: session.roles,
    location: "New York Office"
  };

  return (
    <MainLayout user={currentUser}>
      <TimesheetsClient 
        initialTimesheets={timesheets} 
        currentUser={currentUser}
        initialPayPeriod={currentPeriod}
        payPeriodSettings={payPeriodSettings}
      />
    </MainLayout>
  );
}