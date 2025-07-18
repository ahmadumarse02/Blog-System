import { NextRequest, NextResponse } from "next/server";
import { signToken, SessionPayload } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log("🔐 Simple login attempt for:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Demo credentials
    const demoCredentials = {
      'admin@company.com': { password: 'admin123', roles: ['Admin'], name: 'System Administrator' },
      'hr@company.com': { password: 'hr123', roles: ['HR Manager'], name: 'Jane Smith' },
      'employee@company.com': { password: 'emp123', roles: ['Employee'], name: 'John Doe' },
      'manager@company.com': { password: 'manager123', roles: ['Location Manager'], name: 'Sarah Johnson' }
    };

    const userInfo = demoCredentials[email.toLowerCase() as keyof typeof demoCredentials];
    
    if (!userInfo || password !== userInfo.password) {
      console.log("❌ Invalid credentials for:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session payload
    const payload: SessionPayload = {
      userId: email.split('@')[0], // Simple user ID
      email: email,
      roles: userInfo.roles,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    const token = await signToken(payload);
    
    // Set cookie with secure options
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    console.log("✅ Login successful for:", email);
    
    return NextResponse.json({
      success: true,
      user: {
        email: email,
        name: userInfo.name,
        roles: userInfo.roles,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}