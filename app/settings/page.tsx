import CompanySettingsClient from "./settings-client";

export default function SettingsPage() {
  // Mock company settings - in real app, this would come from database
  const initialSettings = {
    companyName: "HRMS Solutions Inc.",
    payPeriodType: "weekly" as const,
    payPeriodStartDay: 1, // Monday = 1, Sunday = 0
    timezone: "America/New_York",
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    standardHours: 40,
    overtimeThreshold: 40,
    currency: "USD",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h" as const
  };

  return <CompanySettingsClient initialSettings={initialSettings} />;
}