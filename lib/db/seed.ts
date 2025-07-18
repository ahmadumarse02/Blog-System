import { db } from "./index";
import { 
  users, 
  roles, 
  userRoles, 
  locations, 
  departments, 
  employees, 
  leaveTypes,
  leaveBalances,
  systemSettings
} from "./schema";
import { hashPassword } from "../auth";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Create default locations
    const [nyLocation, londonLocation, sydneyLocation] = await db.insert(locations).values([
      {
        name: "New York Office",
        address: "123 Business Ave, New York, NY 10001",
        city: "New York",
        state: "NY",
        country: "USA",
        timezone: "America/New_York",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        geofenceRadius: 100,
        settings: {
          workingHours: { start: "09:00", end: "17:00" },
          lunchBreak: { start: "12:00", end: "13:00" }
        }
      },
      {
        name: "London Office",
        address: "456 Corporate St, London, UK",
        city: "London",
        state: "England",
        country: "UK",
        timezone: "Europe/London",
        coordinates: { lat: 51.5074, lng: -0.1278 },
        geofenceRadius: 150,
        settings: {
          workingHours: { start: "09:00", end: "17:30" },
          lunchBreak: { start: "12:30", end: "13:30" }
        }
      },
      {
        name: "Sydney Office",
        address: "789 Harbor Rd, Sydney, NSW 2000",
        city: "Sydney",
        state: "NSW",
        country: "Australia",
        timezone: "Australia/Sydney",
        coordinates: { lat: -33.8688, lng: 151.2093 },
        geofenceRadius: 120,
        settings: {
          workingHours: { start: "08:30", end: "16:30" },
          lunchBreak: { start: "12:00", end: "13:00" }
        }
      }
    ]).returning();

    console.log("Created locations");

    // Create default roles
    const [adminRole, hrRole, locationManagerRole, employeeRole] = await db.insert(roles).values([
      {
        name: "Admin",
        description: "Full system access and configuration",
        permissions: {
          users: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
          attendance: ["create", "read", "update", "delete"],
          leave: ["create", "read", "update", "delete", "approve"],
          payroll: ["create", "read", "update", "delete", "process"],
          reports: ["read", "export"],
          settings: ["read", "update"],
          audit: ["read"]
        }
      },
      {
        name: "HR Manager",
        description: "HR operations and employee management",
        permissions: {
          employees: ["create", "read", "update"],
          attendance: ["read", "update"],
          leave: ["read", "approve"],
          payroll: ["read", "process"],
          reports: ["read", "export"],
          settings: ["read"]
        }
      },
      {
        name: "Location Manager",
        description: "Manage employees and operations at specific location",
        permissions: {
          employees: ["read", "update"],
          attendance: ["read", "update"],
          leave: ["read", "approve"],
          schedule: ["create", "read", "update"],
          reports: ["read"]
        }
      },
      {
        name: "Employee",
        description: "Basic employee access",
        permissions: {
          profile: ["read", "update"],
          attendance: ["create", "read"],
          leave: ["create", "read"],
          schedule: ["read"],
          payroll: ["read"]
        }
      }
    ]).returning();

    console.log("Created roles");

    // Create departments
    const [itDept, hrDept, salesDept] = await db.insert(departments).values([
      {
        name: "Information Technology",
        description: "IT support and development",
        locationId: nyLocation.id
      },
      {
        name: "Human Resources",
        description: "HR operations and employee relations",
        locationId: nyLocation.id
      },
      {
        name: "Sales",
        description: "Sales and business development",
        locationId: londonLocation.id
      }
    ]).returning();

    console.log("Created departments");

    // Hash passwords
    const adminPassword = await hashPassword("admin123");
    const hrPassword = await hashPassword("hr123");
    const empPassword = await hashPassword("emp123");
    const managerPassword = await hashPassword("manager123");

    // Create users
    const [adminUser, hrUser, empUser, managerUser] = await db.insert(users).values([
      {
        email: "admin@company.com",
        passwordHash: adminPassword
      },
      {
        email: "hr@company.com",
        passwordHash: hrPassword
      },
      {
        email: "employee@company.com",
        passwordHash: empPassword
      },
      {
        email: "manager@company.com",
        passwordHash: managerPassword
      }
    ]).returning();

    console.log("Created users");

    // Create employees
    const [adminEmployee, hrEmployee, empEmployee, managerEmployee] = await db.insert(employees).values([
      {
        userId: adminUser.id,
        employeeNumber: "EMP001",
        firstName: "System",
        lastName: "Administrator",
        email: "admin@company.com",
        phone: "+1-555-0001",
        hireDate: "2023-01-01",
        jobTitle: "System Administrator",
        department: "IT",
        locationId: nyLocation.id,
        departmentId: itDept.id,
        employmentType: "full-time",
        workSchedule: "standard",
        salary: "120000.00",
        currency: "USD",
        address: {
          street: "123 Admin St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "USA"
        }
      },
      {
        userId: hrUser.id,
        employeeNumber: "EMP002",
        firstName: "Jane",
        lastName: "Smith",
        email: "hr@company.com",
        phone: "+1-555-0002",
        hireDate: "2023-02-01",
        jobTitle: "HR Manager",
        department: "Human Resources",
        locationId: nyLocation.id,
        departmentId: hrDept.id,
        employmentType: "full-time",
        workSchedule: "standard",
        salary: "90000.00",
        currency: "USD",
        address: {
          street: "456 HR Ave",
          city: "New York",
          state: "NY",
          zip: "10002",
          country: "USA"
        }
      },
      {
        userId: empUser.id,
        employeeNumber: "EMP003",
        firstName: "John",
        lastName: "Doe",
        email: "employee@company.com",
        phone: "+1-555-0003",
        hireDate: "2023-03-01",
        jobTitle: "Software Developer",
        department: "IT",
        locationId: nyLocation.id,
        departmentId: itDept.id,
        managerId: null, // Will be set after creating manager
        employmentType: "full-time",
        workSchedule: "remote",
        salary: "75000.00",
        currency: "USD",
        address: {
          street: "789 Dev St",
          city: "New York",
          state: "NY",
          zip: "10003",
          country: "USA"
        }
      },
      {
        userId: managerUser.id,
        employeeNumber: "EMP004",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "manager@company.com",
        phone: "+44-20-1234-5678",
        hireDate: "2022-12-01",
        jobTitle: "Location Manager",
        department: "Sales",
        locationId: londonLocation.id,
        departmentId: salesDept.id,
        employmentType: "full-time",
        workSchedule: "standard",
        salary: "85000.00",
        currency: "GBP",
        address: {
          street: "321 Manager Rd",
          city: "London",
          state: "England",
          zip: "SW1A 1AA",
          country: "UK"
        }
      }
    ]).returning();

    console.log("Created employees");

    // Update department managers
    await db.update(departments)
      .set({ managerId: adminEmployee.id })
      .where(eq(departments.id, itDept.id));

    await db.update(departments)
      .set({ managerId: hrEmployee.id })
      .where(eq(departments.id, hrDept.id));

    await db.update(departments)
      .set({ managerId: managerEmployee.id })
      .where(eq(departments.id, salesDept.id));

    // Set employee manager relationships
    await db.update(employees)
      .set({ managerId: adminEmployee.id })
      .where(eq(employees.id, empEmployee.id));

    console.log("Updated manager relationships");

    // Assign roles to users
    await db.insert(userRoles).values([
      {
        userId: adminUser.id,
        roleId: adminRole.id
      },
      {
        userId: hrUser.id,
        roleId: hrRole.id
      },
      {
        userId: empUser.id,
        roleId: employeeRole.id
      },
      {
        userId: managerUser.id,
        roleId: locationManagerRole.id,
        locationId: londonLocation.id
      }
    ]);

    console.log("Assigned user roles");

    // Create leave types
    const [annualLeave, sickLeave, personalLeave] = await db.insert(leaveTypes).values([
      {
        name: "Annual Leave",
        description: "Vacation and holiday time",
        isPaid: true,
        maxDaysPerYear: 25,
        accrualRate: "2.08", // ~25 days per year
        accrualPeriod: "monthly",
        carryOverLimit: 5,
        requiresApproval: true,
        requiresDocumentation: false
      },
      {
        name: "Sick Leave",
        description: "Medical leave for illness",
        isPaid: true,
        maxDaysPerYear: 10,
        accrualRate: "0.83", // ~10 days per year
        accrualPeriod: "monthly",
        carryOverLimit: 0,
        requiresApproval: false,
        requiresDocumentation: true
      },
      {
        name: "Personal Leave",
        description: "Personal time off",
        isPaid: false,
        maxDaysPerYear: 5,
        accrualRate: "0.42", // ~5 days per year
        accrualPeriod: "monthly",
        carryOverLimit: 0,
        requiresApproval: true,
        requiresDocumentation: false
      }
    ]).returning();

    console.log("Created leave types");

    // Create leave balances for all employees
    const currentYear = new Date().getFullYear();
    const allEmployees = [adminEmployee, hrEmployee, empEmployee, managerEmployee];
    const allLeaveTypes = [annualLeave, sickLeave, personalLeave];

    for (const employee of allEmployees) {
      for (const leaveType of allLeaveTypes) {
        await db.insert(leaveBalances).values({
          employeeId: employee.id,
          leaveTypeId: leaveType.id,
          year: currentYear,
          allocated: leaveType.maxDaysPerYear?.toString() || "0",
          used: "0",
          pending: "0",
          carried: "0"
        });
      }
    }

    console.log("Created leave balances");

    // Create system settings
    await db.insert(systemSettings).values([
      {
        key: "company_name",
        value: "HRMS Enterprise Corp",
        description: "Company name displayed throughout the system",
        category: "general"
      },
      {
        key: "default_currency",
        value: "USD",
        description: "Default currency for payroll calculations",
        category: "payroll"
      },
      {
        key: "overtime_threshold",
        value: "40",
        description: "Hours per week before overtime applies",
        category: "attendance"
      },
      {
        key: "overtime_multiplier",
        value: "1.5",
        description: "Overtime pay multiplier",
        category: "payroll"
      },
      {
        key: "require_approval_threshold",
        value: "3",
        description: "Number of consecutive leave days requiring approval",
        category: "leave"
      }
    ]);

    console.log("Created system settings");

    console.log("Database seed completed successfully!");
    console.log("Demo accounts created:");
    console.log("Admin: admin@company.com / admin123");
    console.log("HR Manager: hr@company.com / hr123");
    console.log("Employee: employee@company.com / emp123");
    console.log("Location Manager: manager@company.com / manager123");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed };