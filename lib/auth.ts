import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, employees } from "./db/schema";
import { eq } from "drizzle-orm";

const secretKey = process.env.JWT_SECRET || "your-secret-key";
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: string;
  employeeId?: string;
  email: string;
  roles: string[];
  locationId?: string;
  expiresAt: Date;
  [key: string]: any; // Add index signature for JWT compatibility
}

export async function signToken(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.log("Token verification failed:", error);
    return null;
  }
}

export async function createSession(userId: string) {
  console.log("Creating session for user:", userId);
  
  try {
    // Get user with employee data and roles
    const userWithEmployee = await db.query.users.findFirst({
      where: { id: userId },
    });

    if (!userWithEmployee) {
      throw new Error("User not found");
    }

    // Default roles based on email for demo
    let roles: string[] = [];
    if (userWithEmployee.email === 'admin@company.com') {
      roles = ['Admin'];
    } else if (userWithEmployee.email === 'hr@company.com') {
      roles = ['HR Manager'];
    } else if (userWithEmployee.email === 'manager@company.com') {
      roles = ['Location Manager'];
    } else {
      roles = ['Employee'];
    }
    
    const payload: SessionPayload = {
      userId: userWithEmployee.id,
      employeeId: userWithEmployee.employee?.id || undefined,
      email: userWithEmployee.email,
      roles: roles,
      locationId: userWithEmployee.employee?.locationId || undefined,
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

    console.log("Session created successfully for:", userWithEmployee.email);
    return payload;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = (await cookies()).get("session");
  
  if (!sessionCookie?.value) {
    return null;
  }

  return await verifyToken(sessionCookie.value);
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}

export async function requireRole(requiredRoles: string[]) {
  const session = await requireAuth();
  const hasRole = requiredRoles.some(role => session.roles.includes(role));
  
  if (!hasRole) {
    throw new Error(`Access denied. Required roles: ${requiredRoles.join(", ")}`);
  }
  
  return session;
}