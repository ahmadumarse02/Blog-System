"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/logo.svg";
import { DashboardItems } from "@/components/dashboard/DashboardItems";
import { CircleUser, Globe, Home, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/ThemeToogle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Sites",
    href: "/sites",
    icon: Globe,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar for desktop */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image src={Logo} alt="" className="size-8" />
              <h1 className="text-2xl">
                Blog<span className="text-primary">System</span>
              </h1>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 font-medium lg:px-4">
              <DashboardItems />
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTitle className="hidden"></SheetTitle>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex items-center gap-2 p-4 border-b">
                  <Image src={Logo} alt="" className="size-8" />
                  <h1 className="text-xl font-semibold">
                    Blog<span className="text-primary">System</span>
                  </h1>
                </div>
                <nav className="p-4">
                  <DashboardItems />
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="ml-auto flex items-center gap-x-5">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <LogoutLink>Logout</LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6">
          {children}
        </main>
      </div>
    </section>
  );
}
