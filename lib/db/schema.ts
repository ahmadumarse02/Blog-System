import { pgTable, text, uuid, timestamp, boolean, integer, decimal, jsonb, varchar, date, time } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users and Authentication
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Roles and Permissions
export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  description: text("description"),
  permissions: jsonb("permissions").notNull(), // Store permissions as JSON
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRoles = pgTable("user_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  roleId: uuid("role_id").references(() => roles.id).notNull(),
  locationId: uuid("location_id").references(() => locations.id), // Optional location scoping
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

// Locations
export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  timezone: varchar("timezone", { length: 50 }).default("UTC"),
  coordinates: jsonb("coordinates"), // {lat, lng} for geofencing
  geofenceRadius: integer("geofence_radius").default(100), // meters
  isActive: boolean("is_active").default(true).notNull(),
  settings: jsonb("settings"), // Location-specific settings
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Departments
export const departments = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  locationId: uuid("location_id").references(() => locations.id),
  managerId: uuid("manager_id").references(() => employees.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Employees
export const employees = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  employeeNumber: varchar("employee_number", { length: 50 }).unique().notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  middleName: varchar("middle_name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: date("date_of_birth"),
  hireDate: date("hire_date").notNull(),
  terminationDate: date("termination_date"),
  jobTitle: varchar("job_title", { length: 200 }),
  department: varchar("department", { length: 200 }),
  locationId: uuid("location_id").references(() => locations.id).notNull(),
  departmentId: uuid("department_id").references(() => departments.id),
  managerId: uuid("manager_id").references(() => employees.id),
  employmentType: varchar("employment_type", { length: 50 }).notNull(), // full-time, part-time, contract
  workSchedule: varchar("work_schedule", { length: 50 }).default("standard"), // standard, flexible, remote
  salary: decimal("salary", { precision: 12, scale: 2 }),
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  bankAccount: jsonb("bank_account"), // Encrypted bank details
  taxInfo: jsonb("tax_info"), // Tax withholding information
  emergencyContact: jsonb("emergency_contact"),
  address: jsonb("address"),
  biometricData: jsonb("biometric_data"), // Face recognition templates (encrypted)
  profilePicture: text("profile_picture"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Leave Types
export const leaveTypes = pgTable("leave_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isPaid: boolean("is_paid").default(true),
  maxDaysPerYear: integer("max_days_per_year"),
  accrualRate: decimal("accrual_rate", { precision: 5, scale: 2 }), // Days per period
  accrualPeriod: varchar("accrual_period", { length: 20 }).default("monthly"), // monthly, weekly, yearly
  carryOverLimit: integer("carry_over_limit").default(0),
  requiresApproval: boolean("requires_approval").default(true),
  requiresDocumentation: boolean("requires_documentation").default(false),
  locationId: uuid("location_id").references(() => locations.id), // Location-specific leave types
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Employee Leave Balances
export const leaveBalances = pgTable("leave_balances", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  leaveTypeId: uuid("leave_type_id").references(() => leaveTypes.id).notNull(),
  year: integer("year").notNull(),
  allocated: decimal("allocated", { precision: 8, scale: 2 }).default("0"),
  used: decimal("used", { precision: 8, scale: 2 }).default("0"),
  pending: decimal("pending", { precision: 8, scale: 2 }).default("0"),
  carried: decimal("carried", { precision: 8, scale: 2 }).default("0"),
  lastAccrual: timestamp("last_accrual"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Leave Requests
export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  leaveTypeId: uuid("leave_type_id").references(() => leaveTypes.id).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: decimal("total_days", { precision: 5, scale: 2 }).notNull(),
  reason: text("reason"),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, approved, rejected, cancelled
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: uuid("reviewed_by").references(() => employees.id),
  reviewComments: text("review_comments"),
  attachments: jsonb("attachments"), // Array of file URLs
  isEmergency: boolean("is_emergency").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Scheduled Shifts
export const scheduledShifts = pgTable("scheduled_shifts", {
  id: uuid("id").defaultRandom().primaryKey(),
  locationId: uuid("location_id").references(() => locations.id).notNull(),
  departmentId: uuid("department_id").references(() => departments.id),
  assignedEmployeeId: uuid("assigned_employee_id").references(() => employees.id),
  shiftDate: date("shift_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  shiftType: varchar("shift_type", { length: 50 }).notNull(), // morning, evening, night, custom
  requiredRole: varchar("required_role", { length: 100 }),
  minimumStaff: integer("minimum_staff").default(1),
  notes: text("notes"),
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: jsonb("recurring_pattern"), // Weekly pattern, end date, etc.
  status: varchar("status", { length: 20 }).default("scheduled").notNull(), // scheduled, filled, cancelled
  createdBy: uuid("created_by").references(() => employees.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Attendance Records
export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  shiftId: uuid("shift_id").references(() => scheduledShifts.id),
  locationId: uuid("location_id").references(() => locations.id).notNull(),
  clockInTime: timestamp("clock_in_time"),
  clockOutTime: timestamp("clock_out_time"),
  clockInLocation: jsonb("clock_in_location"), // GPS coordinates
  clockOutLocation: jsonb("clock_out_location"),
  clockInMethod: varchar("clock_in_method", { length: 50 }), // app, biometric, manual, badge
  clockOutMethod: varchar("clock_out_method", { length: 50 }),
  hoursWorked: decimal("hours_worked", { precision: 8, scale: 2 }),
  overtimeHours: decimal("overtime_hours", { precision: 8, scale: 2 }).default("0"),
  breakMinutes: integer("break_minutes").default(0),
  status: varchar("status", { length: 20 }).default("present").notNull(), // present, absent, late, partial
  notes: text("notes"),
  isManualEntry: boolean("is_manual_entry").default(false),
  enteredBy: uuid("entered_by").references(() => employees.id),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Timesheet Entries
export const timesheetEntries = pgTable("timesheet_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  weekEnding: date("week_ending").notNull(),
  totalHours: decimal("total_hours", { precision: 8, scale: 2 }).notNull(),
  regularHours: decimal("regular_hours", { precision: 8, scale: 2 }).notNull(),
  overtimeHours: decimal("overtime_hours", { precision: 8, scale: 2 }).default("0"),
  sickHours: decimal("sick_hours", { precision: 8, scale: 2 }).default("0"),
  vacationHours: decimal("vacation_hours", { precision: 8, scale: 2 }).default("0"),
  holidayHours: decimal("holiday_hours", { precision: 8, scale: 2 }).default("0"),
  dailyBreakdown: jsonb("daily_breakdown"), // Array of daily hour entries
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, submitted, approved, rejected
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  approvedBy: uuid("approved_by").references(() => employees.id),
  rejectionReason: text("rejection_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payroll Runs
export const payrollRuns = pgTable("payroll_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  payPeriodStart: date("pay_period_start").notNull(),
  payPeriodEnd: date("pay_period_end").notNull(),
  payDate: date("pay_date").notNull(),
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, processing, completed, cancelled
  totalGrossPay: decimal("total_gross_pay", { precision: 15, scale: 2 }).default("0"),
  totalTaxes: decimal("total_taxes", { precision: 15, scale: 2 }).default("0"),
  totalNetPay: decimal("total_net_pay", { precision: 15, scale: 2 }).default("0"),
  totalEmployees: integer("total_employees").default(0),
  locationId: uuid("location_id").references(() => locations.id), // If location-specific
  processedBy: uuid("processed_by").references(() => employees.id).notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payroll Records
export const payrollRecords = pgTable("payroll_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  payrollRunId: uuid("payroll_run_id").references(() => payrollRuns.id).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  regularHours: decimal("regular_hours", { precision: 8, scale: 2 }).default("0"),
  overtimeHours: decimal("overtime_hours", { precision: 8, scale: 2 }).default("0"),
  sickHours: decimal("sick_hours", { precision: 8, scale: 2 }).default("0"),
  vacationHours: decimal("vacation_hours", { precision: 8, scale: 2 }).default("0"),
  holidayHours: decimal("holiday_hours", { precision: 8, scale: 2 }).default("0"),
  regularPay: decimal("regular_pay", { precision: 12, scale: 2 }).default("0"),
  overtimePay: decimal("overtime_pay", { precision: 12, scale: 2 }).default("0"),
  bonuses: decimal("bonuses", { precision: 12, scale: 2 }).default("0"),
  commissions: decimal("commissions", { precision: 12, scale: 2 }).default("0"),
  allowances: decimal("allowances", { precision: 12, scale: 2 }).default("0"),
  grossPay: decimal("gross_pay", { precision: 12, scale: 2 }).notNull(),
  federalTax: decimal("federal_tax", { precision: 12, scale: 2 }).default("0"),
  stateTax: decimal("state_tax", { precision: 12, scale: 2 }).default("0"),
  socialSecurity: decimal("social_security", { precision: 12, scale: 2 }).default("0"),
  medicare: decimal("medicare", { precision: 12, scale: 2 }).default("0"),
  otherDeductions: decimal("other_deductions", { precision: 12, scale: 2 }).default("0"),
  totalDeductions: decimal("total_deductions", { precision: 12, scale: 2 }).default("0"),
  netPay: decimal("net_pay", { precision: 12, scale: 2 }).notNull(),
  payslipUrl: text("payslip_url"), // URL to generated payslip PDF
  paymentMethod: varchar("payment_method", { length: 50 }).default("bank_transfer"),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"), // pending, paid, failed
  earningsBreakdown: jsonb("earnings_breakdown"), // Detailed earnings components
  deductionsBreakdown: jsonb("deductions_breakdown"), // Detailed deductions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  employeeId: uuid("employee_id").references(() => employees.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: uuid("entity_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  sessionId: varchar("session_id", { length: 255 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// System Settings
export const systemSettings = pgTable("system_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: jsonb("value").notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }),
  isEncrypted: boolean("is_encrypted").default(false),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  employee: one(employees, {
    fields: [users.id],
    references: [employees.userId],
  }),
  userRoles: many(userRoles),
  auditLogs: many(auditLogs),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  location: one(locations, {
    fields: [userRoles.locationId],
    references: [locations.id],
  }),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  employees: many(employees),
  departments: many(departments),
  userRoles: many(userRoles),
  scheduledShifts: many(scheduledShifts),
  attendanceRecords: many(attendanceRecords),
  leaveTypes: many(leaveTypes),
  payrollRuns: many(payrollRuns),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  location: one(locations, {
    fields: [departments.locationId],
    references: [locations.id],
  }),
  manager: one(employees, {
    fields: [departments.managerId],
    references: [employees.id],
  }),
  employees: many(employees),
  scheduledShifts: many(scheduledShifts),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [employees.locationId],
    references: [locations.id],
  }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
  }),
  directReports: many(employees),
  leaveBalances: many(leaveBalances),
  leaveRequests: many(leaveRequests),
  scheduledShifts: many(scheduledShifts),
  attendanceRecords: many(attendanceRecords),
  timesheetEntries: many(timesheetEntries),
  payrollRecords: many(payrollRecords),
  auditLogs: many(auditLogs),
}));

export const leaveTypesRelations = relations(leaveTypes, ({ one, many }) => ({
  location: one(locations, {
    fields: [leaveTypes.locationId],
    references: [locations.id],
  }),
  leaveBalances: many(leaveBalances),
  leaveRequests: many(leaveRequests),
}));

export const leaveBalancesRelations = relations(leaveBalances, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveBalances.employeeId],
    references: [employees.id],
  }),
  leaveType: one(leaveTypes, {
    fields: [leaveBalances.leaveTypeId],
    references: [leaveTypes.id],
  }),
}));

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveRequests.employeeId],
    references: [employees.id],
  }),
  leaveType: one(leaveTypes, {
    fields: [leaveRequests.leaveTypeId],
    references: [leaveTypes.id],
  }),
  reviewer: one(employees, {
    fields: [leaveRequests.reviewedBy],
    references: [employees.id],
  }),
}));

export const scheduledShiftsRelations = relations(scheduledShifts, ({ one, many }) => ({
  location: one(locations, {
    fields: [scheduledShifts.locationId],
    references: [locations.id],
  }),
  department: one(departments, {
    fields: [scheduledShifts.departmentId],
    references: [departments.id],
  }),
  assignedEmployee: one(employees, {
    fields: [scheduledShifts.assignedEmployeeId],
    references: [employees.id],
  }),
  createdBy: one(employees, {
    fields: [scheduledShifts.createdBy],
    references: [employees.id],
  }),
  attendanceRecords: many(attendanceRecords),
}));

export const attendanceRecordsRelations = relations(attendanceRecords, ({ one }) => ({
  employee: one(employees, {
    fields: [attendanceRecords.employeeId],
    references: [employees.id],
  }),
  shift: one(scheduledShifts, {
    fields: [attendanceRecords.shiftId],
    references: [scheduledShifts.id],
  }),
  location: one(locations, {
    fields: [attendanceRecords.locationId],
    references: [locations.id],
  }),
  enteredBy: one(employees, {
    fields: [attendanceRecords.enteredBy],
    references: [employees.id],
  }),
}));

export const timesheetEntriesRelations = relations(timesheetEntries, ({ one }) => ({
  employee: one(employees, {
    fields: [timesheetEntries.employeeId],
    references: [employees.id],
  }),
  approvedBy: one(employees, {
    fields: [timesheetEntries.approvedBy],
    references: [employees.id],
  }),
}));

export const payrollRunsRelations = relations(payrollRuns, ({ one, many }) => ({
  location: one(locations, {
    fields: [payrollRuns.locationId],
    references: [locations.id],
  }),
  processedBy: one(employees, {
    fields: [payrollRuns.processedBy],
    references: [employees.id],
  }),
  payrollRecords: many(payrollRecords),
}));

export const payrollRecordsRelations = relations(payrollRecords, ({ one }) => ({
  payrollRun: one(payrollRuns, {
    fields: [payrollRecords.payrollRunId],
    references: [payrollRuns.id],
  }),
  employee: one(employees, {
    fields: [payrollRecords.employeeId],
    references: [employees.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
  employee: one(employees, {
    fields: [auditLogs.employeeId],
    references: [employees.id],
  }),
}));

export const systemSettingsRelations = relations(systemSettings, ({ one }) => ({
  updatedBy: one(users, {
    fields: [systemSettings.updatedBy],
    references: [users.id],
  }),
}));