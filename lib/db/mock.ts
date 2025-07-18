// Mock database for sandbox environment
// In production, this would be replaced with actual PostgreSQL connection

interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface MockEmployee {
  id: string;
  userId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate: string;
  jobTitle?: string;
  locationId: string;
  employmentType: string;
  workSchedule: string;
  salary?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MockLocation {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone: string;
  isActive: boolean;
  createdAt: Date;
}

interface MockRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, string[]>;
  createdAt: Date;
}

interface MockUserRole {
  id: string;
  userId: string;
  roleId: string;
  locationId?: string;
  assignedAt: Date;
}

// Mock data
let mockUsers: MockUser[] = [];
let mockEmployees: MockEmployee[] = [];
let mockLocations: MockLocation[] = [];
let mockRoles: MockRole[] = [];
let mockUserRoles: MockUserRole[] = [];

// Initialize with demo data
function initializeMockData() {
  const now = new Date();
  
  // Locations
  const nyLocation: MockLocation = {
    id: "1",
    name: "New York Office",
    address: "123 Business Ave, New York, NY 10001",
    city: "New York",
    state: "NY",
    country: "USA",
    timezone: "America/New_York",
    isActive: true,
    createdAt: now,
  };
  
  const londonLocation: MockLocation = {
    id: "2",
    name: "London Office",
    address: "456 Corporate St, London, UK",
    city: "London",
    state: "England",
    country: "UK",
    timezone: "Europe/London",
    isActive: true,
    createdAt: now,
  };
  
  mockLocations = [nyLocation, londonLocation];
  
  // Roles
  const adminRole: MockRole = {
    id: "1",
    name: "Admin",
    description: "Full system access",
    permissions: {
      users: ["create", "read", "update", "delete"],
      employees: ["create", "read", "update", "delete"],
      attendance: ["create", "read", "update", "delete"],
      leave: ["create", "read", "update", "delete", "approve"],
      payroll: ["create", "read", "update", "delete", "process"],
      reports: ["read", "export"],
      settings: ["read", "update"],
      audit: ["read"]
    },
    createdAt: now,
  };
  
  const hrRole: MockRole = {
    id: "2",
    name: "HR Manager",
    description: "HR operations",
    permissions: {
      employees: ["create", "read", "update"],
      attendance: ["read", "update"],
      leave: ["read", "approve"],
      payroll: ["read", "process"],
      reports: ["read", "export"]
    },
    createdAt: now,
  };
  
  const employeeRole: MockRole = {
    id: "3",
    name: "Employee",
    description: "Basic employee access",
    permissions: {
      profile: ["read", "update"],
      attendance: ["create", "read"],
      leave: ["create", "read"],
      schedule: ["read"],
      payroll: ["read"]
    },
    createdAt: now,
  };
  
  const locationManagerRole: MockRole = {
    id: "4",
    name: "Location Manager",
    description: "Manage location operations",
    permissions: {
      employees: ["read", "update"],
      attendance: ["read", "update"],
      leave: ["read", "approve"],
      schedule: ["create", "read", "update"],
      reports: ["read"]
    },
    createdAt: now,
  };
  
  mockRoles = [adminRole, hrRole, employeeRole, locationManagerRole];
  
  // Users (passwords are hashed for: admin123, hr123, emp123, manager123)
  const adminUser: MockUser = {
    id: "1",
    email: "admin@company.com",
    passwordHash: "$2a$12$oVVWXPVuMuceKdNUDGLNDuTDbNIgBmCU5Aqj0a5NbifTM15HAV43y", // admin123
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  const hrUser: MockUser = {
    id: "2",
    email: "hr@company.com",
    passwordHash: "$2a$12$83E9z6uqpBQqvgFRRCmVguGQqUqo3VquubIZ2ytmb5BLLKW4h.s.6", // hr123
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  const empUser: MockUser = {
    id: "3",
    email: "employee@company.com",
    passwordHash: "$2a$12$/Omx1VkaYYQKog6smq2.o.QU0jvUs0996/LY7Q3JjmBeG8Rdto9pK", // emp123
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  const managerUser: MockUser = {
    id: "4",
    email: "manager@company.com",
    passwordHash: "$2a$12$GA0mtNUre3jo4dSr.dJTNeWyQ2L7XYNTg2JHoneEQ7.jmg/.r1ViO", // manager123
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  mockUsers = [adminUser, hrUser, empUser, managerUser];
  
  // Employees
  const adminEmployee: MockEmployee = {
    id: "1",
    userId: "1",
    employeeNumber: "EMP001",
    firstName: "System",
    lastName: "Administrator",
    email: "admin@company.com",
    phone: "+1-555-0001",
    hireDate: "2023-01-01",
    jobTitle: "System Administrator",
    locationId: "1",
    employmentType: "full-time",
    workSchedule: "standard",
    salary: "120000.00",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  const hrEmployee: MockEmployee = {
    id: "2",
    userId: "2",
    employeeNumber: "EMP002",
    firstName: "Jane",
    lastName: "Smith",
    email: "hr@company.com",
    phone: "+1-555-0002",
    hireDate: "2023-02-01",
    jobTitle: "HR Manager",
    locationId: "1",
    employmentType: "full-time",
    workSchedule: "standard",
    salary: "90000.00",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  const empEmployee: MockEmployee = {
    id: "3",
    userId: "3",
    employeeNumber: "EMP003",
    firstName: "John",
    lastName: "Doe",
    email: "employee@company.com",
    phone: "+1-555-0003",
    hireDate: "2023-03-01",
    jobTitle: "Software Developer",
    locationId: "1",
    employmentType: "full-time",
    workSchedule: "remote",
    salary: "75000.00",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  const managerEmployee: MockEmployee = {
    id: "4",
    userId: "4",
    employeeNumber: "EMP004",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "manager@company.com",
    phone: "+44-20-1234-5678",
    hireDate: "2022-12-01",
    jobTitle: "Location Manager",
    locationId: "2",
    employmentType: "full-time",
    workSchedule: "standard",
    salary: "85000.00",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  mockEmployees = [adminEmployee, hrEmployee, empEmployee, managerEmployee];
  
  // User Roles
  mockUserRoles = [
    {
      id: "1",
      userId: "1",
      roleId: "1",
      assignedAt: now,
    },
    {
      id: "2",
      userId: "2",
      roleId: "2",
      assignedAt: now,
    },
    {
      id: "3",
      userId: "3",
      roleId: "3",
      assignedAt: now,
    },
    {
      id: "4",
      userId: "4",
      roleId: "4",
      locationId: "2",
      assignedAt: now,
    },
  ];
}

// Mock query functions
export const mockDb = {
  query: {
    users: {
      findFirst: async ({ where }: { where: any }) => {
        if (!mockUsers.length) initializeMockData();
        
        // Simple email lookup
        if (where && typeof where === 'object') {
          const user = mockUsers.find(u => u.email === where.email || u.id === where.id);
          if (!user) return null;
          
          // Include related employee and user roles
          const employee = mockEmployees.find(e => e.userId === user.id);
          const userRoles = mockUserRoles.filter(ur => ur.userId === user.id);
          const location = employee ? mockLocations.find(l => l.id === employee.locationId) : null;
          
          return {
            ...user,
            employee: employee ? {
              ...employee,
              location: location
            } : null,
            userRoles: userRoles.map(ur => ({
              ...ur,
              role: mockRoles.find(r => r.id === ur.roleId),
              location: ur.locationId ? mockLocations.find(l => l.id === ur.locationId) : null
            }))
          };
        }
        
        return null;
      }
    }
  },
  
  update: async () => ({ returning: () => [] }),
  
  select: () => ({
    from: () => ({
      limit: () => mockUsers,
      where: () => mockUsers
    })
  })
};

// Initialize on import
if (typeof window === 'undefined') {
  initializeMockData();
}