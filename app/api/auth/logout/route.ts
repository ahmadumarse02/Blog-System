import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  console.log("🚪 Logout request received");
  
  try {
    // Delete the session cookie
    (await cookies()).delete("session");
    
    console.log("✅ User logged out successfully");
    
    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}