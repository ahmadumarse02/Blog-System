import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { MainLayout } from "@/components/layout/main-layout";
import EmployeesClient from "./employees-client";

export default async function EmployeesPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  console.log("Employees page accessed by:", session.email, "with roles:", session.roles);

  // Enhanced mock employee data with more comprehensive information
  const employees = [
    {
      id: 1,
      name: "Jane Smith",
      email: "jane.smith@company.com",
      role: "HR Manager",
      department: "Human Resources",
      location: "New York Office",
      phone: "+1 (555) 123-4567",
      status: "Active",
      avatar: "",
      joinDate: "2022-03-15",
      employeeId: "EMP001",
      salary: 85000,
      manager: "System Administrator",
      skills: ["Leadership", "Recruitment", "Employee Relations"],
      notes: "Excellent performance in Q4 2024"
    },
    {
      id: 2,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Software Engineer",
      department: "Engineering",
      location: "San Francisco Office",
      phone: "+1 (555) 234-5678",
      status: "Active",
      avatar: "",
      joinDate: "2023-01-10",
      employeeId: "EMP002",
      salary: 95000,
      manager: "Jane Smith",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      notes: "Tech lead for Project Alpha"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Location Manager",
      department: "Operations",
      location: "Chicago Office",
      phone: "+1 (555) 345-6789",
      status: "Active",
      avatar: "",
      joinDate: "2021-08-22",
      employeeId: "EMP003",
      salary: 78000,
      manager: "System Administrator",
      skills: ["Operations", "Team Management", "Process Improvement"],
      notes: "Managed successful office relocation"
    },
    {
      id: 4,
      name: "Mike Wilson",
      email: "mike.wilson@company.com",
      role: "Sales Representative",
      department: "Sales",
      location: "Los Angeles Office",
      phone: "+1 (555) 456-7890",
      status: "On Leave",
      avatar: "",
      joinDate: "2022-11-05",
      employeeId: "EMP004",
      salary: 65000,
      manager: "Sarah Johnson",
      skills: ["Sales", "Customer Relations", "CRM"],
      notes: "On paternity leave until March 2025"
    },
    {
      id: 5,
      name: "Emily Chen",
      email: "emily.chen@company.com",
      role: "UX Designer",
      department: "Design",
      location: "Remote",
      phone: "+1 (555) 567-8901",
      status: "Active",
      avatar: "",
      joinDate: "2023-06-01",
      employeeId: "EMP005",
      salary: 72000,
      manager: "John Doe",
      skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
      notes: "Leading design system initiative"
    },
    {
      id: 6,
      name: "David Martinez",
      email: "david.martinez@company.com",
      role: "DevOps Engineer",
      department: "Engineering",
      location: "Austin Office",
      phone: "+1 (555) 678-9012",
      status: "Active",
      avatar: "",
      joinDate: "2022-09-15",
      employeeId: "EMP006",
      salary: 92000,
      manager: "John Doe",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      notes: "Infrastructure optimization expert"
    },
    {
      id: 7,
      name: "Lisa Wang",
      email: "lisa.wang@company.com",
      role: "Marketing Specialist",
      department: "Marketing",
      location: "Seattle Office",
      phone: "+1 (555) 789-0123",
      status: "Active",
      avatar: "",
      joinDate: "2023-02-20",
      employeeId: "EMP007",
      salary: 58000,
      manager: "Sarah Johnson",
      skills: ["Digital Marketing", "Content Strategy", "Analytics"],
      notes: "Increased social media engagement by 40%"
    },
    {
      id: 8,
      name: "Robert Taylor",
      email: "robert.taylor@company.com",
      role: "Finance Analyst",
      department: "Finance",
      location: "New York Office",
      phone: "+1 (555) 890-1234",
      status: "Inactive",
      avatar: "",
      joinDate: "2021-04-10",
      employeeId: "EMP008",
      salary: 68000,
      manager: "Jane Smith",
      skills: ["Financial Analysis", "Excel", "Budgeting", "Reporting"],
      notes: "Resigned - last day February 28, 2025"
    }
  ];

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
      <EmployeesClient initialEmployees={employees} currentUser={currentUser} />
    </MainLayout>
  );
}