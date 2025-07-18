import { NextRequest, NextResponse } from "next/server";
import { signToken, SessionPayload } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log("🔐 Login attempt for email:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Demo credentials - simplified for reliable operation
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
    
    console.log("✅ Login successful for:", email);
    
    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        email: email,
        name: userInfo.name,
        roles: userInfo.roles,
      },
    });

    // Set cookie with secure options directly on response
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: false, // Set to false for development, will be secure in production
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
      sameSite: "lax",
    });

    console.log("🍪 Session cookie set for:", email, "Token:", token.substring(0, 20) + "...");
    
    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}