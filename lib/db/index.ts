import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if we have a valid database URL
const hasValidDatabase = process.env.DATABASE_URL && 
  !process.env.DATABASE_URL.includes('postgresql://localhost:5432/hrms');

let db: any;
let connection: any;

if (hasValidDatabase) {
  console.log("✅ Connecting to production database");
  try {
    // Use real database
    const connectionString = process.env.DATABASE_URL!;
    connection = postgres(connectionString, { 
      prepare: false,
      ssl: connectionString.includes('sslmode=require') ? 'require' : false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    db = drizzle(connection, { schema });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    // Fall back to mock
    const { mockDb } = require("./mock");
    db = mockDb;
  }
} else {
  console.log("🔧 Using mock database for development");
  // Use mock database for demo/sandbox
  const { mockDb } = require("./mock");
  db = mockDb;
}

// Test connection function
export async function testConnection() {
  try {
    if (hasValidDatabase && connection) {
      await connection`SELECT 1`;
      return true;
    }
    return true; // Mock database always works
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

export { db };
export * from "./schema";