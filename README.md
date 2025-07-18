# HRMS Enterprise - Human Resource Management System

A comprehensive, enterprise-grade Human Resource Management System built with Next.js, PostgreSQL, and Drizzle ORM. This system provides multi-location support, role-based access control, and covers all aspects of HR management from employee onboarding to payroll processing.

## Features

### 🔐 Authentication & Authorization
- **Multi-role Support**: Admin, HR Manager, Location Manager, Employee
- **Fine-grained Permissions**: Field-level access control
- **Location-scoped Access**: Managers can only access their location's data
- **Secure Authentication**: JWT-based sessions with middleware protection

### 👥 Employee Management
- **Complete Employee Profiles**: Personal info, employment details, emergency contacts
- **Organizational Structure**: Department and manager hierarchies
- **Multi-location Support**: Employees can be assigned to different office locations
- **Document Management**: Profile pictures, attachments, and document storage

### ⏰ Time & Attendance
- **Multiple Clock-in Methods**: Web, mobile app, biometric, RFID
- **Geofencing**: Location-based attendance validation
- **Face Recognition**: Optional biometric authentication
- **Automatic Timesheet Generation**: From clock-in/out records
- **Approval Workflows**: Manager approval for timesheets

### 📅 Shift Scheduling & Roster Management
- **Dynamic Shift Creation**: Flexible shift patterns and recurring schedules
- **Auto-scheduling**: AI-powered shift assignment based on availability
- **Shift Swapping**: Employee self-service shift exchanges
- **Role-based Scheduling**: Ensure qualified staff are assigned
- **Real-time Updates**: Live schedule changes and notifications

### 🏖️ Leave Management
- **Multiple Leave Types**: Annual, sick, personal, maternity, etc.
- **Automatic Accrual**: Rule-based leave balance calculations
- **Approval Workflows**: Multi-level approval chains
- **Leave Calendar**: Visual overview of team leave schedules
- **Balance Tracking**: Real-time leave balance monitoring

### 💰 Payroll Management
- **Automated Calculations**: Salary, overtime, taxes, deductions
- **Multi-currency Support**: Different currencies per location
- **Tax Compliance**: Automatic tax calculations per jurisdiction
- **Payslip Generation**: Secure PDF payslips with password protection
- **Bank Integration**: Direct deposit and payment processing

### 📊 Analytics & Reporting
- **HR Dashboards**: Executive, HR, and location-specific dashboards
- **Custom Reports**: Flexible report builder
- **Attendance Analytics**: Trends, patterns, and insights
- **Payroll Reports**: Cost analysis and budget tracking
- **Compliance Reporting**: Audit trails and regulatory reports

### 🌍 Multi-location Support
- **Global Operations**: Support for multiple countries and timezones
- **Localized Settings**: Location-specific working hours, holidays, regulations
- **Currency Handling**: Multi-currency payroll and reporting
- **Compliance Management**: Region-specific labor law compliance

### 🔒 Security & Compliance
- **Data Encryption**: At-rest and in-transit encryption
- **Audit Trails**: Comprehensive logging of all system activities
- **GDPR Compliance**: Data portability, right to be forgotten
- **HIPAA Support**: Healthcare data protection (if applicable)
- **Role-based Security**: Principle of least privilege

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes, Server Components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with secure cookies
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Deployment**: Vercel, AWS, or on-premise Docker

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hrms-enterprise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your database credentials:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/hrms"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed with demo data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

The seed script creates the following demo accounts:

- **Admin**: `admin@company.com` / `admin123`
- **HR Manager**: `hr@company.com` / `hr123` 
- **Location Manager**: `manager@company.com` / `manager123`
- **Employee**: `employee@company.com` / `emp123`

## Database Schema

The system uses a comprehensive PostgreSQL schema with the following key entities:

- **Users & Authentication**: User accounts, roles, permissions
- **Employees**: Employee profiles, emergency contacts, documents
- **Locations**: Office locations, departments, settings
- **Time & Attendance**: Clock records, timesheets, shifts
- **Leave Management**: Leave types, balances, requests
- **Payroll**: Pay runs, payroll records, payslips
- **Audit & Compliance**: Activity logs, system settings

## Architecture

### Deployment Options

#### Cloud Deployment (Recommended)
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Database**: AWS RDS, Google Cloud SQL, or Supabase
- **File Storage**: AWS S3, Google Cloud Storage
- **Email**: SendGrid, AWS SES, or similar

#### On-Premise Deployment
- **Docker**: Complete containerized setup
- **Kubernetes**: Scalable orchestration
- **Local Database**: Self-hosted PostgreSQL
- **Reverse Proxy**: Nginx or Apache

### Security Features

- **Authentication**: JWT tokens with secure cookies
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption at rest and in transit
- **Audit Logging**: Complete activity tracking
- **Input Validation**: Comprehensive data validation
- **Rate Limiting**: API protection against abuse

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Employee Management
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/[id]` - Get employee details
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Deactivate employee

### Attendance Management
- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out
- `GET /api/attendance/records` - Get attendance records
- `GET /api/timesheets` - Get timesheets

### Leave Management
- `GET /api/leave/types` - Get leave types
- `POST /api/leave/requests` - Submit leave request
- `GET /api/leave/requests` - Get leave requests
- `PUT /api/leave/requests/[id]/approve` - Approve leave
- `PUT /api/leave/requests/[id]/reject` - Reject leave

### Payroll Management
- `GET /api/payroll/runs` - Get payroll runs
- `POST /api/payroll/runs` - Create payroll run
- `GET /api/payroll/payslips` - Get payslips

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## Roadmap

### Phase 1 (Current)
- ✅ Core authentication and authorization
- ✅ Employee management
- ✅ Basic attendance tracking
- ✅ Leave management
- ✅ Multi-location support

### Phase 2 (Next)
- 🔄 Advanced scheduling features
- 🔄 Payroll processing
- 🔄 Reporting and analytics
- 🔄 Mobile app

### Phase 3 (Future)
- 📋 Performance management
- 📋 Training and development
- 📋 Recruitment module
- 📋 Advanced analytics and AI
- 📋 Third-party integrations

---

Built with ❤️ by the HRMS Enterprise Team