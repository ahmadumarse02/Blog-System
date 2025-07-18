import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { seed } from '../lib/db/seed';

async function setupDatabase() {
  try {
    console.log('🔗 Connecting to database...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Create connection
    const connection = postgres(databaseUrl, { max: 1 });
    const db = drizzle(connection);

    console.log('📋 Running database migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('🌱 Seeding database with initial data...');
    await seed();

    console.log('✅ Database setup completed successfully!');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();