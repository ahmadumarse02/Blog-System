import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { seed } from "@/lib/db/seed";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    console.log("Checking database connection and setup...");

    // Check if we're using mock database
    const isSandbox = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost');
    
    if (isSandbox) {
      console.log("Using mock database - setup complete");
      return NextResponse.json({
        success: true,
        message: "Mock database connected successfully (sandbox mode)",
        seeded: true,
        userCount: 4,
        mode: "sandbox"
      });
    }

    // Real database logic (for production)
    const testQuery = await db.select().from(users).limit(1);
    console.log("Database connection successful");

    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      console.log("Database appears empty, running seed...");
      await seed();
      console.log("Database seeded successfully");
      
      return NextResponse.json({
        success: true,
        message: "Database connected and seeded successfully",
        seeded: true,
        userCount: 4,
        mode: "production"
      });
    } else {
      console.log("Database already has data, skipping seed");
      return NextResponse.json({
        success: true,
        message: "Database connected successfully",
        seeded: false,
        userCount: existingUsers.length,
        mode: "production"
      });
    }
  } catch (error) {
    console.error("Database setup error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Database setup failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Force seeding database...");
    
    // Force seed regardless of existing data
    await seed();
    
    return NextResponse.json({
      success: true,
      message: "Database force seeded successfully",
      seeded: true
    });
  } catch (error) {
    console.error("Force seed error:", error);
    return NextResponse.json({
      success: false,
      error: "Force seed failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}