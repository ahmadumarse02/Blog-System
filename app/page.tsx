import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Hero } from "@/components/home/Hero";
import { Logos } from "@/components/home/Logos";
import { Features } from "@/components/home/Features";
import { redirect } from "next/navigation";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const session = await getUser();

  if (session?.id) {
    return redirect("/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <Hero />
      <Logos />
      <Features />
    </div>
  );
}
