import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { MainLayout } from "@/components/layout/main-layout";
import SchedulePageClient from "./schedule-client";

export default async function SchedulePage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  console.log("Schedule page accessed by:", session.email, "with roles:", session.roles);

  // Create user data from session
  const userData = {
    name: session.email === 'admin@company.com' ? 'System Administrator' :
          session.email === 'hr@company.com' ? 'Jane Smith' :
          session.email === 'manager@company.com' ? 'Sarah Johnson' :
          'John Doe',
    email: session.email,
    avatar: undefined,
    roles: Array.isArray(session.roles) ? session.roles : [],
    location: session.locationId ? `Location ${session.locationId}` : undefined,
  };

  return (
    <MainLayout user={userData}>
      <SchedulePageClient />
    </MainLayout>
  );
}